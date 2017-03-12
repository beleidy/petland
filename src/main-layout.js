import React, { Component } from 'react';
import './main-layout.css';
import { Link } from 'react-router';
import { Button, Appbar } from 'muicss/react';
import '../node_modules/muicss/dist/css/mui.css';
import * as firebase from "firebase";
import 'firebase/auth';
import * as firebaseui from "firebaseui";
import './firebaseui.css';

class MainLayout extends Component{
constructor(){
    super();
    this.state={
        user: {displayName: "", photoURL: "", signedIn: 0}
    };
}

    componentDidMount(){
        //Initialise the firebase auth app
        var uiConfig = {
            signInSuccessUrl: '#',
            signInOptions: [
                firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            ],
            // Terms of service url.
            tosUrl: '#'
        };     
    
        // Initialize the FirebaseUI Widget using Firebase.
        var ui = new firebaseui.auth.AuthUI(firebase.auth());

        //Set observer on user state
        firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in.
            var currentUser = firebase.auth().currentUser
            this.setState({ user: {signedIn: 1, displayName: currentUser.displayName, photoURL: currentUser.photoURL } });
        } else {

        // No user is signed in.
        this.setState({ user: { signedIn: 0, displayName: "", photoURL: "" } });
        ui.start('#firebaseui-auth-container', uiConfig);
      }
    });

}

userSignOut = () => {
    firebase.auth().signOut();

  }

    render(){
        const navTableStyle = {verticalAlign: 'middle'};
        const navLeft = {justifyContent: "left"};
        const navRight = {justifyContent: "right"};
        
        return(
            <div className="layout-container">
                <div className="nav-bar">
                    <Appbar>
                        <table className="nav-table" width="100%" style={navTableStyle} >
                            <tbody>
                              <tr>
                                <td className="petland-title mui--appbar-height" style={navLeft}>
                                <Link className="logo" to="/">Petland
                                </Link>
                                </td>
                                <td className="mui--appbar-height" style={navRight}>
                                    <div className="nav-right-container">
                                        <div ><Link className="nav-link" activeClassName ="active-navbar-link" to="/add-pet">Add Pet</Link></div>
                                        {this.state.user.signedIn ? 
                                        (<div><span className="nav-user-name">{this.state.user.displayName}</span><a className="nav-sign-out-link" onClick={this.userSignOut}>Sign out</a></div>) 
                                        : ""}
                                        {this.state.user.signedIn ? "" : (<div id="firebaseui-auth-container" className="mui--appbar-height"></div>)}
                                    </div>
                                </td>
                             </tr>
                            </tbody>
                        </table>
                    </Appbar>
                </div>
   
                <div className="view-container">
                    {this.props.children}
                </div>
               <Link to="/add-pet" activeClassName="active-fab"><Button className="add-pet-fab" variant="fab" color="primary">+</Button></Link>
            </div>

        );
    }
    }
export default MainLayout;