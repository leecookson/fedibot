
const { login } = require('masto');

async function main() {
      console.log('mefore masto');

  const masto = await login({
    url: 'https://mastodon.cloud',
    accessToken: '7WIi1DRssJ41g6snfytAx3tHqnb-2hm2O9czTI0pV8s'
  });

  console.log('masto', masto);
}

main();