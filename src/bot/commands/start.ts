import { CommandContext, Context } from "grammy";

export async function startCommand(ctx: CommandContext<Context>): Promise<void> {
  const welcomeMessage = [
    "Hola! Soy el asistente de inventario con IA.",
    "",
    "Puedo ayudarte a consultar productos, revisar stock, buscar proveedores y mas.",
    "Solo escribeme tu pregunta en espanol.",
    "",
    "Comandos disponibles:",
    "/help - Ver ejemplos de uso",
    "/reset - Limpiar conversacion",
    "",
    "Ejemplo: Que productos hay en la bodega principal?",
  ].join("\n");

  await ctx.reply(welcomeMessage);
}