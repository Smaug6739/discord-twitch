import { Client, Message } from "discord.js";
import * as YAML from "yamljs";
import * as path from "path";
import { addStreamer } from "./services/TwitchService";
import { getUser } from "./utils/TwitchAuth";
import * as mongoose from "mongoose";
const prefix = "!";

const client: any = new Client();
client.setting = YAML.load(path.resolve(__dirname, "../setting.yml"));
require("./modules/twitchModule")(client);

client.on("ready", () => console.log(`Logged in as ${client.user.tag}!`));

client.on("message", async (message: Message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args: string[] = message.content.slice(prefix.length).split(/ +/);
    const command: string = args.shift().toLocaleLowerCase();

    if (command === "addstreamer") {
        const streamer = message.guild.member(message.mentions.users.first());
        if (!streamer) return message.channel.send("Vous devez mentionner le streamer a qui appartient la chaine !");
        if (!args[0]) return message.channel.send("Vous devez mettre le pseudos twitch de l'utilisateur");
        const twitchUser: { id: string; login: string; type: string; broadcaster_type: string; description: string } =
            await getUser(client, args[0]);
        if (!twitchUser) return message.channel.send("Utilisateur twitch invalid !");
        await addStreamer(streamer, twitchUser);
        message.channel.send("Streameur ajouter à la liste");
    }
});
console.log(`Trying to connect`);
mongoose.connect("mongodb://localhost:27017/twitch-bot");
mongoose.connection.on("connected", () => {
    console.log("Mongoose is connected");
});
mongoose.connection.on("error", () => {
    console.log("Connection failed.");
});
client.login(client.setting.token);
