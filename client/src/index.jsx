import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Search from './components/Search.jsx';
import RepoList from './components/RepoList.jsx';
import Users from './components/Users.jsx';
import User from './components/User.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: [],
      newRepo: 0,
      updatedRepo: 0,
      stat: false,
      users: [],
      top10: [],
      friends: [],
    }
  }
  componentDidMount () {
    $.get('/repos', (data) => {
      console.log(data);
      this.setState({repos: data.repos, users: data.allUsers});
    })
  }
  search (term) {
    console.log(`${term} was searched`);
    $.post('/repos', { user: term }, (data) => {
      console.log(data);
      this.setState({
        repos: data.repos,
        newRepo: data.newRepo.length,
        updatedRepo: data.updatedRepo.length,
        stat: true,
        users: data.allUsers,
        friends: data.list,
        top10: data.top10,
      });
    });
  }

  render () {
    let msg = `${this.state.newRepo} new repos imported, ${this.state.updatedRepo} repos updated`;
    let showUser = <div className="user"></div>
    if (this.state.stat){ showUser = <User top10={this.state.top10} friends={this.state.friends} />;}
    return (<div>
      <h1>Github Fetcher</h1>
      <Search onSearch={this.search.bind(this)}/>
      <Users users={this.state.users} />
      {showUser}
      <RepoList repos={this.state.repos} stat={this.state.stat} msg={msg} />
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));