import { CommandContext, Context } from "grammy";
import { threadStore } from "../handlers/message.js";

export async function resetCommand(ctx: CommandContext<Context>): Promise<void> {
  const chatId = ctx.chat.id.toString();
  threadStore.delete(chatId);

  await ctx.reply("Conversacion reiniciada. Puedes empezar una nueva consulta.");
}