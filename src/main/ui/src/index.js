import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import List from './list/list';
import Case from './case/case';
import Entity from './entity/entity';
import Home from "./home/home";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/list' component={List} />
      <Route exact path='/case/:id' component={Case} />
      <Route exact path='/:entity(courts|judges|lawyers|parties)/:id' component={Entity} />
      <Route path='*'>
        <Redirect to='/' />
      </Route>
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);
