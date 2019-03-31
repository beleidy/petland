import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as firebase from "firebase";
import "firebase/auth";
import * as firebaseui from "firebaseui";
import { Button, Appbar } from "muicss/react";

import "./css/main-layout.css";
import "./css/firebaseui.css";
import "../node_modules/muicss/dist/css/mui.css";

function MainLayout(props) {
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
        // We check the provider user information and update their firebase user info used in the rest
        // of the site.
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

  const navTableStyle = { verticalAlign: "middle" };
  const navLeft = { justifyContent: "left" };
  const navRight = { justifyContent: "right" };

  return (
    <div className="layout-container">
      <div className="nav-bar">
        <Appbar>
          <table className="nav-table" width="100%" style={navTableStyle}>
            <tbody>
              <tr>
                <td
                  className="petland-title mui--appbar-height"
                  style={navLeft}
                >
                  <Link className="logo" to="/">
                    Petland
                  </Link>
                </td>
                <td className="mui--appbar-height" style={navRight}>
                  <div className="nav-right-container">
                    <div>
                      <Link
                        className="nav-link"
                        activeClassName="active-navbar-link"
                        to="/add-pet"
                      >
                        Add Pet
                      </Link>
                    </div>
                    {signedIn ? (
                      <div>
                        <span className="nav-user-name">{displayName}</span> -{" "}
                        <Link
                          className="nav-sign-out-link"
                          onClick={userSignOut}
                        >
                          Sign out
                        </Link>
                      </div>
                    ) : (
                      ""
                    )}
                    {signedIn ? (
                      ""
                    ) : (
                      <div
                        id="firebaseui-auth-container"
                        className="mui--appbar-height"
                      />
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Appbar>
      </div>
      <div className="view-container">{props.children}</div>
      <Link to="/add-pet" activeClassName="active-fab">
        <Button className="add-pet-fab" variant="fab" color="primary">
          +
        </Button>
      </Link>
    </div>
  );
}

export default MainLayout;
