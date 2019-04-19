const request = require('request');
const config = require('../config.js');

let getReposByUsername = (user, callback) => {
  let options = {
    url: `https://api.github.com/users/${user}/repos`,
    headers: {
      'User-Agent': config.USERNAME, // process.env.USERNAME, // config.USERNAME,
      'Authorization': `token ${config.TOKEN}`, // `token ${process.env.TOKEN}` // `token ${config.TOKEN}`,
    }
  };
  request.get(options, (err, response, body) => {
    if(err){ throw err; }
    callback(JSON.parse(body));
  });
}

module.exports.getReposByUsername = getReposByUsername;