import React from 'react';

const User = (props) => (
  <div className="user">
    <div className="top10">
    <h5>Top 10</h5>
      <ul>
        {props.top10.map((repo, ind) => {
          return <li key={repo.id_repo}>#{ind + 1} <a href={repo.html_url}>{repo.name}</a></li>
        })}
      </ul>
    </div>
    <div className="friendList">
      <h5>Friends</h5>
      <ul>
        {props.friends.map(friend =>
          <li key={friend}><a href={`https://github.com/${friend}`}>{friend}</a></li>
        )}
      </ul>
    </div>
  </div>
)

export default User;