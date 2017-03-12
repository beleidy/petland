import React from 'react';
import ReactDOM from 'react-dom';
import PetPage from './pet';
import Welcome from './welcome';
import './index.css';
import {Router, Route, browserHistory} from 'react-router';
import MainLayout from './main-layout';



ReactDOM.render(
  <Router history={browserHistory}>
    <Route component={MainLayout}>
      <Route path="/" component={Welcome} />
      <Route path="/pet/:id" component={PetPage} />
    </Route>
  </Router>,
  document.getElementById('root')
);
