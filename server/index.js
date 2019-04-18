const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const {TOKEN, USERNAME} = require('../config.js');

app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.urlencoded({extended: true}));

app.post('/repos', function (req, res) {
  // TODO - your code here!
  // This route should take the github username provided
  // and get the repo information from the github API, then
  // save the repo information in the database
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
    // console.log(response);
    let githubRepoArr = JSON.parse(body);
    console.log(githubRepoArr);
  });
  res.send({data: `Successful lookup of ${req.body.user}`});
});

app.get('/repos', function (req, res) {
  // TODO - your code here!
  // This route should send back the top 25 repos
});

let port = 1128;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

