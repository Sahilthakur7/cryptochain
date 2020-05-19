import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

class Block extends Component {

  state = {
    displayTransaction: false
  }

  toggleTransaction = () => {
    this.setState({
      displayTransaction: !this.state.displayTransaction
    });
  }

  get displayTransaction() {
    const { data } = this.props.block;
    const stringifiedData = JSON.stringify(data);
    const dataDisplay = stringifiedData.length > 35 ? `${stringifiedData.substring(0, 35)}...` : stringifiedData;

    return (
      <div>
        <div>
          Data: {dataDisplay}
        </div>
        <Button bsSize="small" bsStyle="danger">Show More</Button>
      </div>
    )
  }

  render() {
    const { timestamp, hash } = this.props.block;

    const hashDisplay = `${hash.substring(0, 15)}...`;

    return (
      <div className="block">
        <div>
          Hash: {hashDisplay}
        </div>
        <div>
          Time: {new Date(timestamp).toLocaleString()}
        </div>
        {this.displayTransaction}
      </div>
    )
  }
};

export default Block;