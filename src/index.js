import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import firebase from "firebase/app";

import firebaseConfig from "../firebase-js-config.json";
import "./css/index.css";
import PetPage from "./pet";
import Welcome from "./welcome";
import AddPet from "./add-pet";
import MainLayout from "./main-layout";

// Initialize Firebase
var config = firebaseConfig.result;
firebase.initializeApp(config);

ReactDOM.render(
  <Router>
    <MainLayout>
      <Route exact path="/" component={Welcome} />
      <Route path="/pet/:id" component={PetPage} />
      <Route path="/add-pet" component={AddPet} />
    </MainLayout>
  </Router>,
  document.getElementById("root")
);
