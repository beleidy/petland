import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
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
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        // user is signed in.
        const { currentUser } = firebase.auth();
        const { uid } = currentUser;
        const { displayName, photoURL } = currentUser.providerData[0];

        // upload user image to our storage
        const storageFileRef = firebase
          .storage()
          .ref()
          .child(`${uid}/userPhoto`);

        const response = await fetch(photoURL);
        const image = await response.blob();
        await storageFileRef.put(image);
        const localphotoURL = await storageFileRef.getDownloadURL();
        currentUser.updateProfile({ displayName, photoURL: localphotoURL });

        // store user details in our db
        const dbKey = firebase
          .database()
          .ref()
          .child(`/users/${uid}`);
        dbKey.set({ displayName, photoURL: localphotoURL });

        // Set the state for signed in user
        setSignedIn(1);
        setDisplayName(displayName);
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
