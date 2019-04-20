import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Search from './components/Search.jsx';
import RepoList from './components/RepoList.jsx';
import Users from './components/Users.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: [],
      newRepo: 0,
      updatedRepo: 0,
      stat: false,
      users: [],
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
      });
    });
  }

  render () {
    let msg = `${this.state.newRepo} new repos imported, ${this.state.updatedRepo} repos updated`;
    return (<div>
      <h1>Github Fetcher</h1>
      <RepoList repos={this.state.repos} stat={this.state.stat} msg={msg} />
      <Users users={this.state.users} />
      <Search onSearch={this.search.bind(this)}/>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));