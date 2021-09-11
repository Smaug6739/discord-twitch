import { GuildMember, User } from "discord.js";
import { Types } from "mongoose";
export async function addStreamer(user: User | GuildMember, twitchUser: any) {
    const twitchModel = require("../models/Twitch").default;
    if (!/^[a-zA-Z0-9_]{4,25}$/.test(twitchUser.login))
        return new Error(
            "twitch username invalid! make sure you're only using the streamer's username (the thing at the end of their URL)"
        );

    const merged = Object.assign(
        { _id: new Types.ObjectId() },
        {
            discordID: user.id,
            twitchUserID: twitchUser.login,
            announced: false,
            profileImageUrl: twitchUser.profile_image_url,
        }
    );
    const createGuild = new twitchModel(merged);
    await createGuild.save();
    return merged;
}

export async function updateStreamer(streamer, announced: boolean, started_at = null) {
    const twitchModel = require("../models/Twitch").default;
    await twitchModel.findOneAndUpdate(
        { twitchUserID: streamer.twitchUserID },
        {
            announced: announced,
            started_at: started_at,
        }
    );
}

export async function getAllStreamer() {
    const twitchModel = require("../models/Twitch").default;

    return twitchModel.find();
    // return twitchModel.findAll();
}
