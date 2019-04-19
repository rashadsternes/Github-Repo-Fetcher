const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/fetcher', {useNewUrlParser: true }); //{ useMongoClient: true }

mongoose.set('useCreateIndex', true);
mongoose.connection.on('connected', () => console.log("Mongoose default connection is open to ", 'mongodb://localhost/fetcher'));
mongoose.connection.on('error', (err) => console.log("Mongoose default connection has occured "+err+" error"));
mongoose.connection.on('disconnected', () => console.log("Mongoose default connection is disconnected"));

let repoSchema = new mongoose.Schema({
  id_repo: {
    type: Number,
    index: true,
    unique: true,
  },
  name: String,
  html_url: String,
  description: String,
  created_at: Date,
  updated_at: Date,
  stargazers_count: Number,
  id_Owners: Number,
  login: String,
  avatarUrl: String
});

let Repo = mongoose.model('Repo', repoSchema);

let save = (gitRepoArr, callback) => {
  const repos = gitRepoArr;
  let allRepos = [];
  for (let instance of repos) {
    let queryValues = {
      id_repo: instance.id,
      name: instance.name,
      html_url: instance.html_url,
      description: instance.description,
      created_at: instance.created_at,
      updated_at: instance.updated_at,
      stargazers_count: instance.stargazers_count,
      id_Owners: instance.owner.id,
      login: instance.owner.login,
      avatarUrl: instance.owner.avatarUrl,
    };
    let conditional = {id_repo: instance.id};
    let options = {new: true, upsert: true};
    let repoPromises = new Promise ((resolve, reject) => {
      Repo.findOneAndUpdate(conditional, queryValues, options, (err, data) => {
        if (err) { reject (err); }
        else {
          console.log(`Success ${data.name}`);
          resolve(data);
        }
      });
    });
    allRepos.push(repoPromises);
  }
  Promise.all(allRepos)
    .then((data) => {
      callback(data);
    })
    .catch((err) => {
      throw err;
    });
  // Possibly close connection
  // mongoose.connection.close();
  process.on('SIGINT', function() {
    mongoose.connection.close(function () {
      console.log('Mongoose disconnected on app termination');
      process.exit(0);
    });
  });
}

module.exports.save = save;
