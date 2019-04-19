import React from 'react';

const RepoList = (props) => (
  <div>
    <h4> Repo List Component </h4>
    There are {props.repos.length} repos.
    <ul>
      {props.repos.map((repo) =>
        <li key={repo.id_repo.toString()}>{repo.name}</li>
      )}
    </ul>
  </div>

)

export default RepoList;