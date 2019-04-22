const mysql = require('promise-mysql');
const { createCollabTable, createRepoTable, selectAllRepos, insertRepo, insertCollab, allRepoByName } = require('./queryStrings');
const { convertToArr, convertToCollab } = require('../helpers/github');

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

const save = (repoJSON) => {
  return new Promise((res, rej) => {
    let values = [];
    let allSaves = [];
    repoJSON.forEach(val => {
      values.push(convertToArr(val));
    })
    for (let value of values) {
      let oneInstance =  new Promise ((resolve, reject) => {
        mysql.createConnection(details).then((db) => {
          return db.query(insertRepo, value)
          .then((rows) => {
            resolve(rows);
          }).catch((error) => {
            reject(error)
          });
        });
      });
      allSaves.push(oneInstance);
    }
    Promise.all(allSaves)
    .then((status) => {
      res(status)
    }).catch((err) => {
      rej(err);
    });
  });
};

const saveCollab = ({ user, list }) => {
  return new Promise((res, rej) => {
    let values = [];
    let allSaves = [];
    list.forEach(collab => {
      values.push(convertToCollab(user, collab));
    })
    for (let value of values) {
      let oneInstance =  new Promise ((resolve, reject) => {
        mysql.createConnection(details).then((db) => {
          return db.query(insertCollab, value)
          .then((rows) => {
            resolve(rows);
          }).catch((error) => {
            reject(error)
          });
        });
      });
      allSaves.push(oneInstance);
    }
    Promise.all(allSaves)
    .then((status) => {
      res(status)
    }).catch((err) => {
      rej(err);
    });
  });
};

module.exports.retrieve = retrieve;
module.exports.create = create;
module.exports.save = save;
module.exports.saveCollab = saveCollab;

