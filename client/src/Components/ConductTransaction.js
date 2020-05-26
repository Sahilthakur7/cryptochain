import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
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

  conductTransaction = () => {
    const { recipient, amount } = this.state;

    fetch('http://localhost:3000/api/transact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient, amount })
    }).then(response => response.json())
      .then(json => {
        alert(json.message || json.type);
      })
  }

  render() {
    const { amount, recipient } = this.state;
    return (
      <div className="conduct-transaction">
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
        <div>
          <Button bsStyle="danger"
            onClick={this.conductTransaction}
          >
            Submit
            </Button>
        </div>
      </div>
    )
  }
}

export default ConductTransaction;