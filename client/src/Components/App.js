import React, { Component } from 'react';
import Blocks from './Blocks';
import logo from '../assets/logo.png';

class App extends Component {
  state = {
    walletInfo: { address: 'fooxb6', balance: 3000 }
  };

  componentDidMount() {
    fetch("http://localhost:3000/api/wallet-info").then(res => res.json()).then(json => {
      this.setState({
        walletInfo: json
      })
    });
  }

  render() {
    const { address, balance } = this.state.walletInfo;
    return (
      <div className="App">
        <img className="logo" src={logo}></img>
        <br />
        <div>
          Welcome to the chain
        </div>
        <br />
        <div className="walletInfo">
          <div>Address: {address}</div>
          <div> balance: {balance}</div>
        </div>
        <br />
        <Blocks />
      </div>
    )
  }
};

export default App;

