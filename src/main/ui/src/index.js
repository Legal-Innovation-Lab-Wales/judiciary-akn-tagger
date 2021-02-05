import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import Home from './home';
import Case from './case';

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path='/'>
        <Home />
      </Route>
      <Route path='/case/:id' component={Case} />
      <Route path='*'>
        <Redirect to='/' />
      </Route>
    </Switch>
  </Router>,
  document.getElementById('root')
);
