const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { create, retrieve, save, saveCollab } = require('../database/index2.js');
const { getReposByUsername, getColloborators, repoFilter } = require('../helpers/github');
const port = process.env.PORT || 1128;


app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.urlencoded({extended: true}));

app.post('/repos', function (req, res) {
  create();
  let {user} = req.body;
  let list = [];
  let getReposPromise = new Promise ((resolve, reject) => {
    getReposByUsername(user, (repoRaw) => {
      resolve(repoRaw);
    });
  });
  getReposPromise.then( (repoJSON) => {
    const getCollabsPromise = new Promise ((resolve, reject) => {
      let allPromises = [];
      repoJSON.forEach(val => {
        let url = val.collaborators_url.split('{')[0];
        let indivPromise = new Promise((res, rej) => {
          getColloborators(url, (collaborators) => res(collaborators));
        });
        allPromises.push(indivPromise);
      });
      Promise.all(allPromises)
      .then((data) => {
        resolve(data)
      });
    });
    getCollabsPromise.then((collaborators) => {
      collaborators.forEach(repo => {
        if (typeof repo[0] === 'object' && !Array.isArray(repo[0])) {
          repo.forEach(person => person.login === user ? list.push(person.login) : null );
        }
      });
      list = [...new Set(list)];
      retrieve()
      .then((initialRepos) => {
        save(repoJSON)
        .then((stat) => {
          retrieve()
          .then((recentStorage)=> {
            repoFilter(recentStorage, initialRepos, user)
            .then(({top10, top25, allUsers, updatedRepo, newRepo}) => {
              saveCollab({user, list}, (stat) => {
                res.send({ repos: top25, top10, newRepo, updatedRepo, list, allUsers });
              }).catch((err) => {
                throw(err);
              });
            });
          });
        });
      });
    });
  });
});

app.get('/repos', function (req, res) {
  retrieve()
  .then((recentStorage) => {
    repoFilter(recentStorage)
    .then(({ top25, allUsers }) => {
      res.send({ repos: top25, allUsers });
    }).catch((err) => {
      throw(err);
    });
  });
});


app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

