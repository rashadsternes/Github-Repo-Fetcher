const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { retrieve, save, retrieveCollab, saveCollab } = require('../database/index.js');
const { getReposByUsername, getColloborators } = require('../helpers/github');

app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.urlencoded({extended: true}));

app.post('/repos', function (req, res) {
  let {user} = req.body;
  getReposByUsername(user, (repoRaw) => {
    let collabs = { user, list: [] };
    repoRaw.forEach(val => {
      getColloborators(val.collaborators_url.split('{')[0], (collaborators) => {
        collaborators.forEach(person => {
          if (person.login !== user) { collabs.list.push(person.login); }
        });
      });
    });
    // Upon successful storage either attach the wanted 25 repos to a successful promise
    retrieve((origStorage) => {
      save(repoRaw, (recentStorage) => {
        let recent = recentStorage.map((r) => r.id_repo);
        let orig = origStorage.map((o) => o.id_repo);
        let updatedRepo = recent.filter((r) => orig.includes(r));
        let newRepo = recent.filter((r) => !orig.includes(r));
        retrieve( (final) => {
          let top25 = final.sort((a,b) => b.updated_at - a.updated_at )
            .sort((a,b) => b.stargazers_count - a.stargazers_count )
            .slice(0, 25);
          saveCollab(collabs, (recent) => {
            retrieveCollab( (everyCollaborator) => {
              res.send({ repos: top25, newRepo, updatedRepo, everyCollaborator });
            });
          });
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

