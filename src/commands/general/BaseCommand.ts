import { Message } from "discord.js";

export abstract class BaseCommand {
  public name: string;
  public description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  abstract execute(message: Message, args: string[]): Promise<void>;
}
