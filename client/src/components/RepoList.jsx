import React from 'react';

const RepoList = (props) => (
  <div>
    <h4> Repo List Component </h4>
    There are {props.repos.length} repos.
    <ul>
      {props.repos.map((repo, ind) =>
        <li>#{ind + 1} <a key={repo.id_repo.toString()} href={repo.html_url}
        target="_blank" >{repo.name}</a></li>
      )}
    </ul>
  </div>

)

export default RepoList;