import React, { Component } from 'react';
import Upload from './Components/Upload'
import logo from './logo.svg';
import 'antd/dist/antd.css'; 
import './App.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <form encype="multipart/form-data" action="/upload" method="post">
          <input name="uploadFile" type="file"/>
          <button type="submit">upload</button>
        </form>

        <Upload />
      </div>
    );
  }
}

export default App;
