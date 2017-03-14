import React from 'react';
import ReactDOM from 'react-dom';
import PetPage from './pet';
import Welcome from './welcome';
import AddPet from './add-pet';
import './index.css';
import {Router, Route, browserHistory} from 'react-router';
import MainLayout from './main-layout';
import * as firebase from "firebase";

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCy8OwL_E1rrYfutk5vqLygz20RmGW-GBE",
    authDomain: "petland-4b867.firebaseapp.com",
    databaseURL: "https://petland-4b867.firebaseio.com",
    storageBucket: "gs://petland-4b867.appspot.com/",
    messagingSenderId: "784140166304"
  };
firebase.initializeApp(config);


ReactDOM.render(
  <Router history={browserHistory}>
    <Route component={MainLayout}>
      <Route path="/" component={Welcome} />
      <Route path="/pet/:id" component={PetPage} />
      <Route path="/add-pet" component={AddPet} />
    </Route>
  </Router>,
  document.getElementById('root')
);
