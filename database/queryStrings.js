module.exports.createRepoTable = `CREATE TABLE IF NOT EXISTS Repo (
  id_repo INT UNIQUE,
  name VARCHAR(50),
  html_url VARCHAR(150),
  description VARCHAR(150),
  updated_at DATETIME,
  stargazers_count INT,
  id_Owners INT,
  login VARCHAR(50),
  avatarUrl VARCHAR(150),
  PRIMARY KEY(id_repo)
);`;

module.exports.createCollabTable = `CREATE TABLE IF NOT EXISTS Collab (
  combo VARCHAR(50) UNIQUE,
  user VARCHAR(50),
  collabName VARCHAR(50)
)`;

module.exports.selectAllRepos = `SELECT * FROM repo`;
module.exports.allRepoByName = `SELECT * FROM repo WHERE name = ?`;
module.exports.allCollabByName = `SELECT collabName FROM collab WHERE name = ?`;
