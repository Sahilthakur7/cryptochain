import React, { Component } from 'react';
import { FormGroup, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class ConductTransaction extends Component {
  state = {
    recipient: '',
    amount: 0
  };

  updateProperty = (e, field) => {
    let { value } = e.target;
    if (field === 'amount') {
      value = Number(value);
    }
    this.setState({
      [field]: value
    })
  }

  render() {
    const { amount, recipient } = this.state;
    return (
      <div className="conduction-transaction">
        <Link to="/">Home</Link>
        <h3>Conduct A Transaction</h3>
        <FormGroup>
          <FormControl
            input="text"
            onChange={(e) => this.updateProperty(e, 'recipient')}
            value={recipient}
          />
        </FormGroup>
        <FormGroup>
          <FormControl
            input="number"
            onChange={(e) => this.updateProperty(e, 'amount')}
            value={amount}
          />
        </FormGroup>
      </div>
    )
  }
}

export default ConductTransaction;