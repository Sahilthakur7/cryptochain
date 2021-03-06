import React from 'react';
import { render } from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import App from './Components/App';
import Blocks from './Components/Blocks';
import ConductTransaction from './Components/ConductTransaction';
import TransactionPool from './Components/TransactionPool';
import history from './history';
import './index.css';

render(
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/blocks" component={Blocks} />
      <Route path="/conduct-transaction" component={ConductTransaction} />
      <Route path="/transaction-pool" component={TransactionPool} />
    </Switch>
  </Router>,
  document.querySelector("#app"));