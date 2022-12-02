import Mastodon from 'mastodon-api';

var M = new Mastodon({
  timeout_ms: 60*1000,  // optional HTTP request timeout to apply to all requests.
  api_url: 'https://hachyderm.io/api/v1/',
  access_token: '7WIi1DRssJ41g6snfytAx3tHqnb-2hm2O9czTI0pV8s'
})

const stream = M.stream('streaming/user')

stream.on('message', (msg) => {
    console.log(msg);
})

stream.on('error', (err) => {
    console.log(err);
})

stream.on('heartbeat', (msg) => {
    console.log('thump.', msg);
})