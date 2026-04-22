import { Context } from "grammy";
import { AIService } from "../../services/ai-service.js";
import { config } from "../../config/env.js";

// Almacena el threadId por cada chat de Telegram
export const threadStore = new Map<string, string>();

// Rate limiting en memoria: cuantos mensajes ha enviado cada chat
const rateLimitStore = new Map<string, number[]>();

function isRateLimited(chatId: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitStore.get(chatId) || [];

  // Filtrar solo los mensajes dentro de la ventana de tiempo
  const recent = timestamps.filter((t) => now - t < config.rateLimit.windowMs);
  rateLimitStore.set(chatId, recent);

  if (recent.length >= config.rateLimit.maxMessages) {
    return true;
  }

  recent.push(now);
  return false;
}

function getThreadId(chatId: string): string {
  let threadId = threadStore.get(chatId);
  if (!threadId) {
    threadId = `telegram-${chatId}-${Date.now()}`;
    threadStore.set(chatId, threadId);
  }
  return threadId;
}

export function createMessageHandler(aiService: AIService) {
  return async (ctx: Context): Promise<void> => {
    const text = ctx.message?.text;
    if (!text) return;

    const chatId = ctx.chat?.id.toString();
    if (!chatId) return;

    if (isRateLimited(chatId)) {
      await ctx.reply(
        "Has enviado muchos mensajes. Espera un momento antes de continuar."
      );
      return;
    }
    
    await ctx.replyWithChatAction("typing");

    try {
      const threadId = getThreadId(chatId);
      const response = await aiService.chat(text, threadId);

      await ctx.reply(response);
    } catch (error) {
      console.error("Error processing message:", error);
      await ctx.reply(
        "Ocurrio un error al procesar tu mensaje. Intenta de nuevo en un momento."
      );
    }
  };
}