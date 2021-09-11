import { Model, Optional } from 'sequelize';
import { Snowflake } from 'discord.js';

interface ITwitchAttributes {
    id: number;
    discordID: Snowflake;
    twitchUserID: string;
    announced: boolean;
    started_at: Date;
}
interface ITwitchCreationAttributes extends Optional<ITwitchAttributes, "id"> {}

export interface ITwitchInstance extends Model<ITwitchCreationAttributes, ITwitchCreationAttributes> {
    id: number;
    discordID: Snowflake;
    twitchUserID: string;
    announced: boolean;
    started_at: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
