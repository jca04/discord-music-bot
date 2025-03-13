import { Client, Collection, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { BaseCommand } from "./commands/general/BaseCommand";
import { pathToFileURL } from "url";

dotenv.config();

export class Bot {
  private client: Client;
  private commands: Collection<string, BaseCommand>;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.commands = new Collection();
    this.loadCommands();
    this.registerEvents();
  }

  private async loadCommands() {
    const commandFolders = fs.readdirSync(path.join(__dirname, "commands"));

    for (const folder of commandFolders) {
      const commandFiles = fs.readdirSync(
        path.join(__dirname, "commands", folder)
      );

      for (const file of commandFiles) {
        const commandPath = pathToFileURL(
          path.join(__dirname, "commands", folder, file)
        ).href;

        try {
          const commandModule = await import(commandPath);

          // Extraer la clase correctamente
          const CommandClass =
            commandModule.default.default || Object.values(commandModule)[0];

          // Verificar si es una clase válida
          if (typeof CommandClass !== "function") {
            console.warn(
              `⚠️  No se pudo cargar la clase de comando en ${file}`
            );
            continue;
          }

          const commandInstance = new CommandClass();
          this.commands.set(commandInstance.name, commandInstance);
        } catch (error) {
          console.error(`❌ Error al importar el comando ${file}:`, error);
        }
      }
    }
  }

  private registerEvents() {
    this.client.once("ready", () => {
      console.log(`✅ Bot listo como ${this.client.user?.tag}`);
    });

    this.client.on("messageCreate", async (message) => {
      if (message.author.bot || !message.content.startsWith("!")) return;

      const args = message.content.slice(1).split(" ");
      const commandName = args.shift()?.toLowerCase();

      if (!commandName) return;
      const command = this.commands.get(commandName);

      if (command) {
        try {
          await command.execute(message, args);
        } catch (error) {
          console.error(error);
          message.reply("❌ Ocurrió un error al ejecutar el comando.");
        }
      }
    });
  }

  public start() {
    this.client.login(process.env.DISCORD_TOKEN);
  }
}
