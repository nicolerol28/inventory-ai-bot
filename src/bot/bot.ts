import { Bot } from "grammy";
import { config } from "../config/env.js";
import { AIService } from "../services/ai-service.js";
import { startCommand } from "./commands/start.js";
import { helpCommand } from "./commands/help.js";
import { resetCommand } from "./commands/reset.js";
import { createMessageHandler } from "./handlers/message.js";

export function createBot(aiService: AIService): Bot {
  const bot = new Bot(config.telegram.botToken);

  bot.command("start", startCommand);
  bot.command("help", helpCommand);
  bot.command("reset", resetCommand);

  bot.on("message:text", createMessageHandler(aiService));

  bot.catch((err) => {
    console.error("Bot error:", err.message);
  });

  return bot;
}