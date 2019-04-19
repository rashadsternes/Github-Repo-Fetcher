const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const {TOKEN, USERNAME} = require('../config.js');
const storeOnDb = require('../database/index.js').save;
const getReposByUsername = require('../helpers/github').getReposByUsername;

app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.urlencoded({extended: true}));

app.post('/repos', function (req, res) {
  let {user} = req.body;
    // Retrieve all repos from Github associated to user
    getReposByUsername(user, (repoRaw) => {
      // Upon successful storage either attach the wanted 25 repos to a successful promise
      storeOnDb(repoRaw, (value) =>{
        let top25 = value.sort((a,b) => a.updated_at - b.updated_at ).slice(0, 25);
        res.send({stat: `Successful lookup of ${user}`, repos: top25 });
      });
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

