import { Schema, model } from "mongoose";

const TwitchModel = new Schema({
    _id: Schema.Types.ObjectId,
    id: Number,
    discordID: String,
    twitchUserID: String,
    announced: Boolean,
    started_at: Date,
    profileImageUrl: String,
});

export default model("TwitchModel", TwitchModel);
