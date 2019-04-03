import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import firebase from "firebase/app";

import firebaseConfig from "./firebase-js-config.json";
import "./css/styles.css";
import "./css/global.css";
import PetPage from "./pet";
import HomePage from "./HomePage";
import AddPet from "./add-pet";
import Navigation from "./Navigation";

// Initialize Firebase
var config = firebaseConfig.result;
firebase.initializeApp(config);

ReactDOM.render(
  <Router>
    <div className="container mx-auto">
      <Route path="/" component={Navigation} />
      <Route exact path="/" component={HomePage} />
      <Route path="/pet/:id" component={PetPage} />
      <Route path="/add-pet" component={AddPet} />
    </div>
  </Router>,
  document.getElementById("root")
);
