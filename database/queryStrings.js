module.exports.createRepoTable = `CREATE TABLE IF NOT EXISTS Repo (
  id_repo VARCHAR(10) UNIQUE,
  name VARCHAR(50),
  html_url VARCHAR(150),
  description VARCHAR(150),
  updated_at VARCHAR(20),
  stargazers_count VARCHAR(5),
  id_Owners VARCHAR(20),
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
module.exports.allCollabByName = `SELECT collabName FROM collab WHERE name = ?`;
module.exports.insertRepo = `INSERT INTO repo(
  id_repo, name, html_url, description, updated_at,
  stargazers_count, id_Owners, login, avatarUrl)
  values(?,?,?,?,?,?,?,?,?)
  ON DUPLICATE KEY UPDATE
  updated_at = VALUES(updated_at),
  stargazers_count = VALUES(stargazers_count)`;
module.exports.insertCollab = `INSERT IGNORE INTO collab(
  combo, user, collabName)
  values(?,?,?)`;
