import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as firebase from "firebase";
import "firebase/auth";
import * as firebaseui from "firebaseui";
import "./css/firebaseui.css";
import "./css/firebaseui-override.css";

function Navigation(props) {
  const [displayName, setDisplayName] = useState("");
  const [signedIn, setSignedIn] = useState(0);

  useEffect(() => {
    // Initialise the firebase auth app
    var uiConfig = {
      signInSuccessUrl: "#",
      signInOptions: [firebase.auth.FacebookAuthProvider.PROVIDER_ID],
      // Terms of service url.
      tosUrl: "#"
    };

    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());

    // Set observer on user state
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        var currentUser = firebase.auth().currentUser;
        currentUser.updateProfile({
          displayName: currentUser.providerData[0].displayName,
          photoURL: currentUser.providerData[0].photoURL
        });
        // Set the state for signed in user
        setSignedIn(1);
        setDisplayName(currentUser.displayName);
      } else {
        // No user is signed in.
        setSignedIn(0);
        setDisplayName("");
        ui.start("#firebaseui-auth-container", uiConfig);
      }
    });
  }, []);

  const userSignOut = () => {
    firebase.auth().signOut();
  };

  return (
    <div
      id="navbar"
      className="w-full bg-my-orange flex flex-wrap items-center justify-between px-5 py-4"
    >
      <Link
        to="/"
        className="text-4xl text-header-color font-bold font-header no-underline flex-grow"
      >
        Petland
      </Link>

      <Link
        className="text-md text-header-color font-content no-underline mx-5"
        activeClassName=""
        to="/add-pet"
      >
        <button className="px-4 py-3 bg-my-green rounded-lg shadow hover:shadow-md">
          Add Pet
        </button>
      </Link>

      {signedIn ? (
        <div>
          <button
            className="px-4 py-3 bg-my-purple rounded-lg shadow hover:shadow-md"
            onClick={userSignOut}
          >
            Sign out
          </button>
          <span className="pl-6 pr-2 py-3">{displayName}</span>
        </div>
      ) : (
        ""
      )}
      {signedIn ? "" : <div id="firebaseui-auth-container" className="" />}
    </div>
  );
}

export default Navigation;
