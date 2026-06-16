import axios, { AxiosError } from "axios";
import { env } from "../config/env.js";

const http = axios.create({
  baseURL: env.backendApiUrl,
  timeout: 60_000,
});

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

function extractErrorMessage(err: unknown): never {
  if (err instanceof AxiosError) {
    const message = err.response?.data?.error?.message as string | undefined;
    throw new ApiError(message || err.message, err.response?.status);
  }
  throw err;
}

export interface LoginResult {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export async function login(email: string, password: string): Promise<LoginResult> {
  try {
    const { data } = await http.post("/auth/login", { email, password });
    return data.data as LoginResult;
  } catch (err) {
    return extractErrorMessage(err);
  }
}

export interface ChatSummary {
  id: string;
  title: string;
  messageCount: number;
  lastActivity: string;
  createdAt: string;
  preview: string;
}

export async function getChats(token: string): Promise<ChatSummary[]> {
  try {
    const { data } = await http.get("/user/chats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.data.chats as ChatSummary[];
  } catch (err) {
    return extractErrorMessage(err);
  }
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface ChatDetail {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastActivity: string;
  createdAt: string;
}

export async function getChat(token: string, chatId: string): Promise<ChatDetail> {
  try {
    const { data } = await http.get(`/user/chats/${chatId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.data.chat as ChatDetail;
  } catch (err) {
    return extractErrorMessage(err);
  }
}

export async function createChat(token: string): Promise<{ id: string; title: string }> {
  try {
    const { data } = await http.post(
      "/user/chats",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data.data.chat as { id: string; title: string };
  } catch (err) {
    return extractErrorMessage(err);
  }
}

export interface SendMessageResult {
  response: string;
  citations?: Array<{ article?: string; title?: string; excerpt?: string }>;
  chatId: string;
  messageCount: number;
}

export async function sendMessage(
  token: string,
  chatId: string,
  message: string
): Promise<SendMessageResult> {
  try {
    const { data } = await http.post(
      `/user/chats/${chatId}/message`,
      { message },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data.data as SendMessageResult;
  } catch (err) {
    return extractErrorMessage(err);
  }
}
