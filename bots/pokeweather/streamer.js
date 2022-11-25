// eslint-disable-next-line no-unused-vars
import dotenv from 'dotenv-safe/config.js';

import { login } from 'masto';

const {
  MASTODON_ACCESS_TOKEN,
  MASTODON_DOMAIN
} = process.env;

const streamer = {
  listen: async () => {
    const masto = await login({
        url: `https://${MASTODON_DOMAIN}`,
        accessToken: MASTODON_ACCESS_TOKEN
    });

    const stream = await masto.stream.streamUser();

    // Subscribe to updates
    stream.on('update', (status) => {
        console.log(`${status.account.username}: ${status.content}`);
    });
  }
}

export default streamer;

streamer.listen();