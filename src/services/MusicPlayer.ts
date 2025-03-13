import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} from "@discordjs/voice";
import { Message } from "discord.js";
import ytdl from "ytdl-core";

export class MusicPlayer {
  private static instance: MusicPlayer;
  private player = createAudioPlayer();

  private constructor() {}

  public static getInstance(): MusicPlayer {
    if (!MusicPlayer.instance) {
      MusicPlayer.instance = new MusicPlayer();
    }

    return MusicPlayer.instance;
  }

  async play(message: Message, url: string) {
    const voiceChannel = message.member?.voice.channel;
    if (!voiceChannel) return;

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator!,
    });

    const stream = ytdl(url, { filter: "audioonly" });
    const resource = createAudioResource(stream);

    this.player.play(resource);
    connection.subscribe(this.player);

    message.reply(`🎶 Reproduciendo: ${url}`);
  }
}
