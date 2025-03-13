import { Message } from "discord.js";
import { BaseCommand } from "./BaseCommand";

export default class PingCommand extends BaseCommand {
  constructor() {
    super("ping", "Responde con Pong!");
  }

  async execute(message: Message, args: string[]): Promise<void> {
    message.reply("🏓 Pong!");
  }
}
