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
      retrieve((origStorage) => {
        storeOnDb(repoRaw, (recentStorage) =>{
          let recent = recentStorage.map((r) => r.id_repo);
          let orig = origStorage.map((o) => o.id_repo);
          let updatedRepo = recent.filter((r) => orig.includes(r));
          let newRepo = recent.filter((r) => !orig.includes(r));
          retrieve( (final) => {
            let top25 = final.sort((a,b) => b.updated_at - a.updated_at )
            .sort((a,b) => b.stargazers_count - a.stargazers_count )
            .slice(0, 25);
            res.send({ repos: top25, newRepo, updatedRepo });
          });
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

