
const { login } = require('masto');

async function main() {
      console.log('mefore masto');

  const masto = await login({
    url: 'https://mastodon.cloud',
    accessToken: process.env.MASTODON_ACCESS_KEY
  });

  console.log('masto', masto);
}

main();
