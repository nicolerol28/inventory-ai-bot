import "dotenv/config";
import { AuthService } from "./services/auth-service.js";
import { AIService } from "./services/ai-service.js";
import { createBot } from "./bot/bot.js";

async function main(): Promise<void> {
  console.log("Starting Inventory AI Telegram Bot...");

  const authService = new AuthService();
  const aiService = new AIService(authService);

  // Verificar autenticacion al arrancar
  try {
    await authService.getToken();
  } catch (error) {
    console.error("Failed to authenticate with AI service:", error);
    process.exit(1);
  }

  const bot = createBot(aiService);

  bot.start({
    onStart: () => {
      console.log("Bot is running with polling...");
    },
  });
}

main();