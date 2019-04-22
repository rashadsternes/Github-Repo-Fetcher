const request = require('request');
const config = require('../config.js');

let getReposByUsername = (user, callback) => {
  let options = {
    url: `https://api.github.com/users/${user}/repos`,
    headers: {
      'User-Agent': config.USERNAME || process.env.USERNAME,
      'Authorization': `token ${config.TOKEN}`|| 'token ' + process.env.TOKEN,
    }
  };
  request.get(options, (err, response, body) => {
    if(err){ throw err; }
    callback(JSON.parse(body));
  });
}

let getColloborators = (url, callback) => {
  let options = {
    url: url,
    headers: {
      'User-Agent': config.USERNAME || process.env.USERNAME,
      'Authorization': `token ${config.TOKEN}` || 'token ' + process.env.TOKEN,
    }
  };
  request.get(options, (err, response, body) => {
    if(err){ throw err; }
    callback(JSON.parse(body));
  });
}

let convertToArr = ({id, name, html_url, description, updated_at, stargazers_count, owner}) => {
  let str = '';
  str += id ? id : null;
  str += ',';
  str += name ? name : null;
  str += ',';
  str += html_url ? html_url : null;
  str += ',';
  str += description ? description : null;
  str += ',';
  str += updated_at ? updated_at : null;
  str += ',';
  str += stargazers_count ? stargazers_count : 0;
  str += ',';
  str += owner.id ? owner.id : null;
  str += ',';
  str += owner.login ? owner.login : null;
  str += ',';
  str += owner.avatar_url ? owner.avatar_url : null;
  return str.split(',');
};

let convertToCollab = (user, collab) => {
  let arr = [];
  arr.push(user + collab);
  arr.push(user);
  arr.push(collab);
  return arr;
};

let repoFilter = (recentStorage, initialStorage, user) => {
  return new Promise((resolve, reject) => {
    if (initialStorage & user) {
      let recent = recentStorage.map((r) => r.id_repo);
      let orig = initialStorage.map((o) => o.id_repo);
      let updatedRepo = recent.filter((r) => orig.includes(r));
      let newRepo = recent.filter((r) => !orig.includes(r));
      let allUsers = [...new Set(recentStorage.map(o => o.login))];
      let top10 = recentStorage.filter((curr) => curr.login === user)
      .sort((a,b) => b.updated_at - a.updated_at )
      .sort((a,b) => b.stargazers_count - a.stargazers_count )
      .slice(0, 10);
      let top25 = recentStorage.sort((a,b) => b.updated_at - a.updated_at )
      .sort((a,b) => b.stargazers_count - a.stargazers_count )
      .slice(0, 25);
      resolve({ top10, top25, allUsers, updatedRepo, newRepo });
    } else {
      let allUsers = [...new Set(recentStorage.map(o => o.login))];
      let top25 = recentStorage.sort((a,b) => b.updated_at - a.updated_at )
      .sort((a,b) => b.stargazers_count - a.stargazers_count )
      .slice(0, 25);
      resolve({ top25, allUsers });
    }
  });
};

module.exports.getReposByUsername = getReposByUsername;
module.exports.getColloborators = getColloborators;
module.exports.convertToArr = convertToArr;
module.exports.convertToCollab = convertToCollab;
module.exports.repoFilter = repoFilter;