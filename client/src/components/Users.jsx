import React from 'react';

const Users = (props) => (
  <div className="Users">
    <h4> Users </h4>
    <ul>
      {props.users.map(user => {
        return <li key={user}><a href={`https://github.com/${user}`}>{user}</a></li>
      })}
    </ul>
  </div>
)

export default Users;