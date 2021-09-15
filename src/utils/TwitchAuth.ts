import * as axios from "axios";
const cache = {
    token: null,
    lastValidation: null,
};

export async function getAcessToken(client) {
    const qs = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: client.setting.twitch_clientID,
        client_secret: client.setting.twitch_clientSecret,
    });
    //@ts-ignore
    const res = await axios.post(`https://id.twitch.tv/oauth2/token?${qs}`).catch((err) => console.error(err));
    cache.token = res.data.access_token;
    cache.lastValidation = Date.now();
    return res.data.access_token || null;
}

export async function getRefrehToken(client) {
    const currentTimestamp = Date.now();
    if (cache.token !== null) {
        if (cache.lastValidation + 60 * 60 * 1000 < currentTimestamp) {
            //@ts-ignore
            await axios
                //@ts-ignore
                .get("https://id.twitch.tv/oauth2/validate", {
                    headers: {
                        "Client-ID": client.setting.twitch_clientID,
                        Authorization: "Bearer" + cache.token,
                    },
                })
                .catch(() => getAcessToken(client));
        } else {
            return cache.token;
        }
    } else {
        return getAcessToken(client);
    }
}

export async function getUser(client, username: string) {
    //@ts-ignore
    const res = await axios
        //@ts-ignore
        .get(`https://api.twitch.tv/helix/users?login=${username}`, {
            headers: {
                "Client-ID": client.setting.twitch_clientID,
                Authorization: "Bearer " + (await getRefrehToken(client)),
            },
        })
        .catch((err) => console.log(err));
    return res.data.data[0];
}

export async function getStream(client, streamerID) {
    //@ts-ignore
    const res = await axios
        //@ts-ignore
        .get(`https://api.twitch.tv/helix/streams?user_login=${streamerID}`, {
            headers: {
                "Client-ID": client.setting.twitch_clientID,
                Authorization: "Bearer " + (await getRefrehToken(client)),
            },
        })
        .catch((err) => console.log(err));
    if(!res || res && !res.data) return "no data";
    return res.data.data[0];
}
