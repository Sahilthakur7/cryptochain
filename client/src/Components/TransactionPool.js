import React from 'react';
import { Link } from 'react-router-dom';

import Transaction from './Transaction';

class TransactionPool extends React.Component {
  state = {
    transactionPoolMap: {}
  };

  componentDidMount() {
    this.fetchTransactionPoolMap();
  }

  fetchTransactionPoolMap = () => {
    fetch('http://localhost:3000/api/transaction-pool-map')
      .then(response => response.json())
      .then(json => this.setState({
        transactionPoolMap: json
      }));
  }

  render() {
    return (
      <div className="transaction-pool">
        <div>
          <Link to="/">Home</Link>
        </div>
        <h3>TransactionPool</h3>
        {
          Object.values(this.state.transactionPoolMap).map(transaction => {
            return (
              <div key={transaction.id}>
                <hr />
                <Transaction transaction={transaction} />
              </div>
            )
          })
        }
      </div>
    )
  }
};

export default TransactionPool;