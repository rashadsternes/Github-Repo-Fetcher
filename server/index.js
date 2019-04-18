const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const {TOKEN, USERNAME} = require('../config.js');
const storeOnDb = require('../database/index.js').save;

app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.urlencoded({extended: true}));

app.post('/repos', function (req, res) {
  let {user} = req.body;
  let options = {
    url: `https://api.github.com/users/${user}/repos`,
    headers: {
      'User-Agent': USERNAME,
      'Authorization': `token ${TOKEN}`,
   },
  };
  request.get(options, (err, response, body) => {
    if(err){ throw err; }
    let githubRepoArr = JSON.parse(body);
    storeOnDb(githubRepoArr);
    // Upon successful storage either
    // (a) Make subsequent database query to db for 25 repos sorted on updated_at
    // (b) Attach the wanted 25 repos to a successful promise
    res.send({stat: `Successful lookup of ${user}`, repos: body });
  });
});

app.get('/repos', function (req, res) {
  // TODO - your code here!
  // This route should send back the top 25 repos
});

let port = 1128;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

