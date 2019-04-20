import React from 'react';

const Users = (props) => (
  <div className="Users">
    <h4> Users </h4>
    <ul>
      {props.users.map(user => {
        return <li key={user}>{user}</li>
      })}
    </ul>
  </div>
)

export default Users;