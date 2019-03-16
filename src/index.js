import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import * as firebase from "firebase";

import "./css/index.css";
import PetPage from "./pet";
import Welcome from "./welcome";
import AddPet from "./add-pet";
import MainLayout from "./main-layout";

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDXSjkM4Jnc9KcU5ERfdTkrHRiy5Xh-EoU",
    authDomain: "petland-dev.firebaseapp.com",
    databaseURL: "https://petland-dev.firebaseio.com",
    projectId: "petland-dev",
    storageBucket: "petland-dev.appspot.com",
    messagingSenderId: "738118892814"
};
firebase.initializeApp(config);

ReactDOM.render(
    <Router>
        <Route component={MainLayout}>
            <Route path="/" component={Welcome} />
            <Route path="/pet/:id" component={PetPage} />
            <Route path="/add-pet" component={AddPet} />
        </Route>
    </Router>,
    document.getElementById("root")
);
