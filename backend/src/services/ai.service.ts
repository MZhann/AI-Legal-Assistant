import { GoogleGenerativeAI, GenerativeModel, Content } from '@google/generative-ai';
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
}

// System prompt for the legal assistant
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

class AIService {
  private model: GenerativeModel | null = null;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (!env.googleAiApiKey) {
      console.warn('⚠️  GOOGLE_AI_API_KEY not set. AI features will be disabled.');
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(env.googleAiApiKey);
      // Using gemini-2.0-flash - fast and cheap
      this.model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash',
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 2048,
        },
      });
      this.isInitialized = true;
      console.log('✅ AI Service initialized with Gemini 2.0 Flash');
    } catch (error) {
      console.error('❌ Failed to initialize AI Service:', error);
    }
  }

  public isAvailable(): boolean {
    return this.isInitialized && this.model !== null;
  }

  /**
   * Process a chat message with RAG (Retrieval Augmented Generation)
   */
  async chat(
    userMessage: string, 
    conversationHistory: ChatMessage[] = []
  ): Promise<ChatResponse> {
    if (!this.isAvailable()) {
      throw new Error('AI Service is not available. Please check your API key.');
    }

    // RAG: Search Constitution for relevant context
    const relevantSections = searchConstitution(userMessage, 5);
    const constitutionContext = formatConstitutionContext(relevantSections);

    // Detect language from user message
    const hasKazakh = /[әіңғүұқөһ]/i.test(userMessage);
    const hasCyrillic = /[а-яё]/i.test(userMessage);
    const detectedLang = hasKazakh ? 'KAZAKH' : (hasCyrillic ? 'RUSSIAN' : 'ENGLISH');

    // Build the prompt with RAG context
    const ragPrompt = `
RELEVANT CONSTITUTION ARTICLES:
${constitutionContext}

---
USER QUESTION: ${userMessage}

DETECTED LANGUAGE: ${detectedLang}
⚠️ YOU MUST RESPOND IN ${detectedLang} ONLY! This is mandatory.

Answer the user's question based on the Constitution articles above. Cite relevant articles when applicable.
`;

    // Convert conversation history to Gemini format
    const history: Content[] = conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    try {
      // Start a chat session
      const chat = this.model!.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: 'System instructions: ' + SYSTEM_PROMPT }],
          },
          {
            role: 'model',
            parts: [{ text: 'Understood. I am an AI legal consultant for Kazakhstan law. I will follow all the rules and always cite relevant articles. How can I help you?' }],
          },
          ...history,
        ],
      });

      // Send the RAG-enhanced prompt
      const result = await chat.sendMessage(ragPrompt);
      const response = result.response;
      const text = response.text();

      // Extract citations from relevant sections
      const citations = relevantSections.map(section => ({
        article: section.article,
        title: section.title,
        excerpt: section.content.substring(0, 200) + '...',
      }));

      return {
        message: text,
        citations,
        usage: {
          promptTokens: response.usageMetadata?.promptTokenCount || 0,
          completionTokens: response.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: response.usageMetadata?.totalTokenCount || 0,
        },
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('❌ AI Chat Error:', errorMessage);
      
      // Log full error for debugging
      if (error instanceof Error && error.stack) {
        console.error('Stack:', error.stack);
      }
      
      // Just pass through the actual error message
      throw new Error(`AI Error: ${errorMessage}`);
    }
  }

  /**
   * Get a quick summary of Constitution articles for a topic
   */
  async getConstitutionSummary(topic: string): Promise<ConstitutionSection[]> {
    return searchConstitution(topic, 3);
  }
}

// Singleton instance
export const aiService = new AIService();

