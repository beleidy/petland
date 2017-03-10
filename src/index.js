import React from 'react';
import ReactDOM from 'react-dom';
import PetPage from './pet-page';
import Welcome from './welcome';
import './index.css';
import {Router, Route, browserHistory} from 'react-router';



ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={Welcome} />
    <Route path="/pet/:id" component={PetPage} />
  </Router>,
  document.getElementById('root')
);
