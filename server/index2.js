const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { create, retrieve } = require('../database/index2.js');
const { getReposByUsername, getColloborators } = require('../helpers/github');
const port = process.env.PORT || 1128;


app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.urlencoded({extended: true}));

app.post('/repos', function (req, res) {
  create();
  let {user} = req.body;
  let repoJson;
  let list = [];
  let initialRepos;
  let getReposPromise = new Promise ((resolve, reject) => {
    getReposByUsername(user, (repoRaw) => {
      resolve(repoRaw);
    });
  });
  getReposPromise.then( (repoRaw) => {
    repoJSON = repoRaw;
  }).then(() => {
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
      .then((data) => resolve(data));
    });
    getCollabsPromise.then((collaborators) => {
      collaborators.forEach(repo => {
        if (typeof repo[0] === 'object' && !Array.isArray(repo[0])) {
          repo.forEach(person => person.login === user ? list.push(person.login) : null );
        }
      });
      list = [...new Set(list)];
    })
  }).then(() => {
     return retrieve()
  }).then((data) => {
      initialRepos = data;
    }).catch((err) => {
      console.log(err);
    })
    // save repos into db
    // save(repoRaw, (recentStorage) => {
    //   let top10 = recentStorage.sort((a,b) => b.updated_at - a.updated_at )
    //       .sort((a,b) => b.stargazers_count - a.stargazers_count )
    //       .slice(0, 10);
    //   let recent = recentStorage.map((r) => r.id_repo);
    //   let orig = initialRepos.map((o) => o.id_repo);
    //   let updatedRepo = recent.filter((r) => orig.includes(r));
    //   let newRepo = recent.filter((r) => !orig.includes(r));
    //   // retrieve repos from db again as additional ones have been added
    //   retrieve( (final) => {
    //     let top25 = final.sort((a,b) => b.updated_at - a.updated_at )
    //     .sort((a,b) => b.stargazers_count - a.stargazers_count )
    //     .slice(0, 25);
    //     let allUsers = [...new Set(final.map(o => o.login))];
    //     // Save users with collab list into Collab repo
    //     saveCollab({user, list}, (recent) => {
    //       // retrieveCollab(user, (everyCollaborator) => {
    //         res.send({ repos: top25, top10, newRepo, updatedRepo, list, allUsers });
    //         res.send({ user });
    //       // });
    //     });
    //   });
    // });
});

app.get('/repos', function (req, res) {
  // retrieve( (data) => {
  //   let top25 = data.sort((a,b) => b.updated_at - a.updated_at )
  //     .sort((a,b) => b.stargazers_count - a.stargazers_count )
  //     .slice(0, 25);
  //     let allUsers = [...new Set(data.map(o => o.login))];
  //   res.send({ repos: top25, allUsers });
  // });
});


app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

