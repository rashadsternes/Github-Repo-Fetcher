const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const storeOnDb = require('../database/index.js').save;
const { retrieve } = require('../database/index.js');
const getReposByUsername = require('../helpers/github').getReposByUsername;

app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.urlencoded({extended: true}));

app.post('/repos', function (req, res) {
  let {user} = req.body;
    // Retrieve all repos from Github associated to user
    getReposByUsername(user, (repoRaw) => {
      // Upon successful storage either attach the wanted 25 repos to a successful promise
      storeOnDb(repoRaw, (value) =>{
        // let top25 = value.sort((a,b) => b.updated_at - a.updated_at ).slice(0, 25);
        // res.send({stat: `Successful lookup of ${user}`, repos: top25 });
        retrieve( (data) => {
          let top25 = data.sort((a,b) => b.updated_at - a.updated_at )
            .sort((a,b) => b.stargazers_count - a.stargazers_count )
            .slice(0, 25);
          res.send({ repos: top25 });
        });
      });
    });
  });

app.get('/repos', function (req, res) {
  retrieve( (data) => {
    let top25 = data.sort((a,b) => b.updated_at - a.updated_at )
      .sort((a,b) => b.stargazers_count - a.stargazers_count )
      .slice(0, 25);
    res.send({ repos: top25 });
  });
});

let port = 1128;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

