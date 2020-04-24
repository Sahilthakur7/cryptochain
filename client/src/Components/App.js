import React, { Component } from 'react';
import Blocks from './Blocks';

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
      <div>
        <div>
          Welcome to the chain
        </div>
        <div>Address: {address}</div>
        <div> balance: {balance}</div>
        <br />
        <Blocks />
      </div>
    )
  }
};

export default App;

