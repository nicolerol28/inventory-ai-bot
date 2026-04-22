import { CommandContext, Context } from "grammy";

export async function helpCommand(ctx: CommandContext<Context>): Promise<void> {
  const helpMessage = [
    "Asistente de Inventario - Ayuda",
    "",
    "Escribeme cualquier pregunta sobre el inventario. Algunos ejemplos:",
    "",
    "Productos y stock:",
    '- "Que productos hay en la bodega principal?"',
    '- "Cuantas unidades de arroz tenemos?"',
    '- "Busca productos de limpieza"',
    "",
    "Bodegas y proveedores:",
    '- "Cuales son las bodegas disponibles?"',
    '- "Quien provee productos electronicos?"',
    "",
    "Movimientos:",
    '- "Que movimientos hubo hoy en la bodega Norte?"',
    '- "Genera un reporte de compras para la bodega Sur"',
    "",
    "Comandos:",
    "/reset - Limpiar conversacion y empezar de nuevo",
    "/help - Ver este mensaje",
  ].join("\n");

  await ctx.reply(helpMessage);
}