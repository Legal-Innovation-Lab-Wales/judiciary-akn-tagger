import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import Home from './home_components/home';
import Case from './case_components/case';
import Link from './link_components/link';

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path='/'>
        <Home />
      </Route>
      <Route path='/case/:id' component={Case} />
      <Route path='/:entity(courts|judges|lawyers|parties)/:id' component={Link} />
      <Route path='*'>
        <Redirect to='/' />
      </Route>
    </Switch>
  </Router>,
  document.getElementById('root')
);
