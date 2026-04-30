import OpenAI, { APIError } from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { env } from '../config/index.js';
import { searchConstitution, formatConstitutionContext, ConstitutionSection } from '../data/constitution-kz.js';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  message: string;
  citations: {
    article: string;
    title: string;
    excerpt: string;
  }[];
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model?: string;
}

export type AIErrorCode =
  | 'AI_UNAVAILABLE'
  | 'AI_RATE_LIMITED'
  | 'AI_AUTH_ERROR'
  | 'AI_BAD_REQUEST'
  | 'AI_UNKNOWN';

export class AIServiceError extends Error {
  public readonly code: AIErrorCode;
  public readonly statusCode: number;
  public readonly retryAfterSec?: number;

  constructor(message: string, code: AIErrorCode, statusCode = 500, retryAfterSec?: number) {
    super(message);
    this.name = 'AIServiceError';
    this.code = code;
    this.statusCode = statusCode;
    this.retryAfterSec = retryAfterSec;
  }
}

const SYSTEM_PROMPT = `Сіз Қазақстан Республикасының заңнамасы бойынша AI құқықтық консультант боласыз.

🌐 LANGUAGE RULE (VERY IMPORTANT - FOLLOW STRICTLY):
- If the user writes in RUSSIAN → You MUST respond in RUSSIAN only
- If the user writes in KAZAKH → You MUST respond in KAZAKH only  
- If the user writes in ENGLISH → You MUST respond in ENGLISH only
- Detect the language from the user's message and match it exactly

ОСНОВНЫЕ ПРАВИЛА / НЕГІЗГІ ЕРЕЖЕЛЕР:
1. Отвечай на вопросы только по законодательству Казахстана
2. ВСЕГДА указывай название закона и номер статьи
3. Объясняй юридические термины простым языком
4. Если не уверен - скажи об этом прямо
5. Ты НЕ заменяешь профессионального юриста
6. Будь краток, но содержателен

В КОНЦЕ КАЖДОГО ОТВЕТА ДОБАВЬ (на языке пользователя):
- На русском: "⚠️ Данная информация носит справочный характер и не заменяет профессиональную юридическую консультацию."
- На казахском: "⚠️ Бұл ақпарат тек ақпараттық мақсатта берілген және кәсіби заңгерлік кеңестің орнын баспайды."
- На английском: "⚠️ This information is for reference only and does not replace professional legal advice."

You have access to the Constitution of the Republic of Kazakhstan.`;

// Primary model first; on persistent 429 / model error we try the fallback once.
const MODEL_CHAIN = ['gpt-4o-mini', 'gpt-3.5-turbo'] as const;

const MAX_RETRIES_PER_MODEL = 2;
const BASE_BACKOFF_MS = 800;
const MAX_BACKOFF_MS = 4000;

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function parseRetryAfter(value: unknown): number | undefined {
  if (typeof value === 'string') {
    const n = parseFloat(value);
    if (!Number.isNaN(n)) return n;
  }
  return undefined;
}

function classifyError(err: unknown): {
  code: AIErrorCode;
  statusCode: number;
  retryAfterSec?: number;
  raw: string;
} {
  if (err instanceof APIError) {
    const status = err.status ?? 0;
    const raw = err.message || `OpenAI error ${status}`;

    if (status === 429) {
      const headers = (err as APIError & { headers?: Record<string, string> }).headers;
      const retryAfterSec = parseRetryAfter(headers?.['retry-after']);
      return { code: 'AI_RATE_LIMITED', statusCode: 429, retryAfterSec, raw };
    }
    if (status === 401 || status === 403) {
      return { code: 'AI_AUTH_ERROR', statusCode: 503, raw };
    }
    if (status === 400 || status === 404 || status === 422) {
      return { code: 'AI_BAD_REQUEST', statusCode: 400, raw };
    }
    return { code: 'AI_UNKNOWN', statusCode: 502, raw };
  }

  const raw = err instanceof Error ? err.message : String(err);
  const lower = raw.toLowerCase();
  if (lower.includes('429') || lower.includes('rate limit') || lower.includes('quota')) {
    return { code: 'AI_RATE_LIMITED', statusCode: 429, raw };
  }
  if (lower.includes('401') || lower.includes('403') || lower.includes('api key') || lower.includes('unauthorized')) {
    return { code: 'AI_AUTH_ERROR', statusCode: 503, raw };
  }
  if (lower.includes('400') || lower.includes('invalid')) {
    return { code: 'AI_BAD_REQUEST', statusCode: 400, raw };
  }
  return { code: 'AI_UNKNOWN', statusCode: 502, raw };
}

class AIService {
  private client: OpenAI | null = null;
  private isInitialized = false;
  private activeModelName: string = MODEL_CHAIN[0];

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    const apiKey = env.openaiApiKey;
    if (!apiKey) {
      console.warn('⚠️  OPENAI_API_KEY not set. AI features will be disabled.');
      return;
    }

    try {
      this.client = new OpenAI({ apiKey });
      this.isInitialized = true;
      console.log(
        `✅ AI Service initialized (OpenAI). Primary: ${MODEL_CHAIN[0]}, fallback: ${MODEL_CHAIN[1]}`
      );
    } catch (error) {
      console.error('❌ Failed to initialize AI Service:', error);
    }
  }

  public isAvailable(): boolean {
    return this.isInitialized && this.client !== null;
  }

  public getActiveModel(): string {
    return this.activeModelName;
  }

  /**
   * Process a chat message with RAG (Retrieval Augmented Generation)
   * with retries and automatic fallback to a secondary model on 429/server errors.
   */
  async chat(
    userMessage: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<ChatResponse> {
    if (!this.isAvailable() || !this.client) {
      throw new AIServiceError(
        'AI service is not configured. OPENAI_API_KEY is missing.',
        'AI_UNAVAILABLE',
        503
      );
    }

    const relevantSections = searchConstitution(userMessage, 5);
    const constitutionContext = formatConstitutionContext(relevantSections);

    const hasKazakh = /[әіңғүұқөһ]/i.test(userMessage);
    const hasCyrillic = /[а-яё]/i.test(userMessage);
    const detectedLang = hasKazakh ? 'KAZAKH' : (hasCyrillic ? 'RUSSIAN' : 'ENGLISH');

    const ragPrompt = `
RELEVANT CONSTITUTION ARTICLES:
${constitutionContext}

---
USER QUESTION: ${userMessage}

DETECTED LANGUAGE: ${detectedLang}
⚠️ YOU MUST RESPOND IN ${detectedLang} ONLY! This is mandatory.

Answer the user's question based on the Constitution articles above. Cite relevant articles when applicable.
`;

    // Cap history to last 18 turns to keep request small and predictable.
    const trimmedHistory = conversationHistory.slice(-18);

    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...trimmedHistory.map<ChatCompletionMessageParam>(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      })),
      { role: 'user', content: ragPrompt },
    ];

    let lastClassified: ReturnType<typeof classifyError> | undefined;

    for (const modelName of MODEL_CHAIN) {
      for (let attempt = 0; attempt <= MAX_RETRIES_PER_MODEL; attempt++) {
        try {
          const completion = await this.client.chat.completions.create({
            model: modelName,
            messages,
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 2048,
          });

          const text = completion.choices[0]?.message?.content?.trim() ?? '';
          if (!text) {
            throw new AIServiceError(
              'Empty response from AI provider',
              'AI_UNKNOWN',
              502
            );
          }

          this.activeModelName = modelName;

          const citations = relevantSections.map(section => ({
            article: section.article,
            title: section.title,
            excerpt: section.content.substring(0, 200) + '...',
          }));

          return {
            message: text,
            citations,
            usage: {
              promptTokens: completion.usage?.prompt_tokens ?? 0,
              completionTokens: completion.usage?.completion_tokens ?? 0,
              totalTokens: completion.usage?.total_tokens ?? 0,
            },
            model: modelName,
          };
        } catch (error: unknown) {
          // If we already wrapped it ourselves, propagate.
          if (error instanceof AIServiceError) throw error;

          const classified = classifyError(error);
          lastClassified = classified;

          console.error(
            `❌ AI chat error on model=${modelName} attempt=${attempt + 1}/${MAX_RETRIES_PER_MODEL + 1} ` +
              `code=${classified.code} status=${classified.statusCode}: ${classified.raw}`
          );

          // Don't retry on auth/bad-request – these will not recover.
          if (classified.code === 'AI_AUTH_ERROR' || classified.code === 'AI_BAD_REQUEST') {
            throw new AIServiceError(classified.raw, classified.code, classified.statusCode);
          }

          if (attempt < MAX_RETRIES_PER_MODEL) {
            const backoff = Math.min(BASE_BACKOFF_MS * Math.pow(2, attempt), MAX_BACKOFF_MS);
            const suggested =
              classified.code === 'AI_RATE_LIMITED' && classified.retryAfterSec
                ? Math.min(classified.retryAfterSec * 1000, MAX_BACKOFF_MS)
                : 0;
            const waitMs = Math.max(backoff, suggested);
            console.warn(`⏳ Retrying after ${waitMs}ms on model ${modelName}...`);
            await sleep(waitMs);
            continue;
          }
          break;
        }
      }
      console.warn(`↪️  Falling back from ${modelName} to next model in chain`);
    }

    if (lastClassified) {
      throw new AIServiceError(
        lastClassified.raw,
        lastClassified.code,
        lastClassified.statusCode,
        lastClassified.retryAfterSec
      );
    }
    throw new AIServiceError('Unknown AI failure', 'AI_UNKNOWN', 502);
  }

  /**
   * Get a quick summary of Constitution articles for a topic
   */
  async getConstitutionSummary(topic: string): Promise<ConstitutionSection[]> {
    return searchConstitution(topic, 3);
  }
}

export const aiService = new AIService();
