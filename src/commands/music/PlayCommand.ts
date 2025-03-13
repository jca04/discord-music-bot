import { Message } from "discord.js";
import { BaseCommand } from "../general/BaseCommand";
import { MusicPlayer } from "../../services/MusicPlayer";

export default class PlayCommand extends BaseCommand {
  constructor() {
    super("play", "Reproduce una canción en un canal de voz.");
  }

  async execute(message: Message, args: string[]): Promise<void> {
    if (!message.member?.voice.channel) {
      message.reply("❌ Debes estar en un canal de voz.");
      return;
    }

    if (args.length === 0) {
      message.reply("🎵 Debes proporcionar el nombre o enlace de una canción.");
      return;
    }

    const song = args.join(" ");
    const musicPlayer = MusicPlayer.getInstance();
    await musicPlayer.play(message, song);
  }
}
