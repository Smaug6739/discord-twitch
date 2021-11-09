import { getAllStreamer, updateStreamer } from "../services/TwitchService";
import { getStream } from "../utils/TwitchAuth";
import { MessageEmbed, MessageAttachment } from "discord.js";
import type { TextChannel } from "discord.js";

module.exports = async (client) => {
    setInterval(await check, 30000); // 5 min
    await check();

    async function check() {
        const streamers = await getAllStreamer();
        if (streamers.length < 1) return console.log("Aucun streamer");
        for (const streamer of streamers) {
            const stream = await getStream(client, streamer.twitchUserID);
            if (stream && stream === "no data") return;

            if (!stream) return await updateStreamer(streamer, false);

            const started = new Date(stream.started_at);

            if (streamer.announced === false) {
                //@ts-ignore
                const chan: TextChannel = client.channels.cache.get("886285800671694888");
                const attachment = new MessageAttachment(
                    stream.thumbnail_url.replace("{width}", "1920").replace("{height}", "1080", "thumbnail.png")
                );
                const embed = new MessageEmbed()
                    .setAuthor(stream.user_name, streamer.profileImageUrl)
                    .attachFiles([attachment])
                    .setThumbnail(streamer.profileImageUrl)
                    .setTitle(stream.title)
                    .setURL(`https://www.twitch.tv/${stream.user_login}`)
                    .addField("Game", stream.game_name, true)
                    .addField("Viewers", `${stream.viewer_count}`, true)
                    .setColor(9521151)
                    .setImage(`attachment://thumbnail.png`);
                chan.send("Salut Lucifer lance un stream @everyone", embed);
                await updateStreamer(streamer, true, started);
            }
        }
    }
};
