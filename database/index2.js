const mysql = require('promise-mysql');
const { createCollabTable, createRepoTable, selectAllRepos} = require('./queryStrings');

const details = {
  host: 'localhost',
  user: 'root',
  database: 'fetcher',
};

const create = () => {
  mysql.createConnection(details).then((db) => {
    return db.query(createRepoTable)
    .then((rows) => {
      return db.query(createCollabTable)
    }).then((rows) => {
      console.log('Success');
    }).catch((error) => {
      console.log(error)
    });
  });
};

const retrieve = () => {
  return new Promise ((resolve, reject) => {
    mysql.createConnection(details).then((db) => {
      return db.query(selectAllRepos)
      .then((rows) => {
        resolve(rows);
      }).catch((error) => {
        reject(error)
      });
    });
  })
};

module.exports.retrieve = retrieve;
module.exports.create = create;

