import React, { Component } from 'react';
//import logo from './logo.svg';
import './pet.css';
import './firebaseui.css';
import * as firebase from "firebase";
import 'firebase/auth';
import 'firebase/database'
import * as firebaseui from "firebaseui";
import { Form, Button, Input, Appbar, Panel } from 'muicss/react';
import '../node_modules/muicss/dist/css/mui.css';

// Initialise the Firebase App

// Initialize Firebase
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCy8OwL_E1rrYfutk5vqLygz20RmGW-GBE",
    authDomain: "petland-4b867.firebaseapp.com",
    databaseURL: "https://petland-4b867.firebaseio.com",
    storageBucket: "petland-4b867.appspot.com",
    messagingSenderId: "784140166304"
  };
firebase.initializeApp(config);

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
// The start method will wait until the DOM is loaded.
// ui.start('#firebaseui-auth-container', uiConfig);

//Comment input box
class InputBox extends Component {
  constructor() {
    super();
    this.state = {
      value: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.props.userDisplayName === "") {
      alert("You cannot leave a comment if you are not signed in");
      return null;
    };


    if (this.state.value.slice() === '') {
      alert("You cannot submit an empty comment")
      return null;
    }

    //generate the comments object
    var dbComment = {
      comment: this.state.value.slice(),
      userDisplayName: this.props.userDisplayName,
      userPhotoURL: this.props.userPhotoURL
    };

    // generate a new object in the posts node
    firebase.database().ref().child('/comments/'+this.props.petId).push(dbComment);

    //Reset the text textarea
    this.setState({ value: "" });
  }

  handleChange(event) {
    event.preventDefault();
    const currentText = event.target.value.slice();
    this.setState({ value: currentText });
  }


  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Input className={"input-box"} floatingLabel={true} label={'Write a comment and press Enter'} onChange={this.handleChange} value={this.state.value} />
        <Button variant="raised" >post</Button>
      </Form>
    )
  }
}

// Returns a comment box with props.comment in its text
class CommentBox extends Component {
  render() {
    return (
      <Panel className="comment-box mui--z2">
        <div className="comment-box-text">
          <p className="mui--text-body1">{this.props.comment}</p>
        </div>
        <div className="comment-box-author">
          <img className="comment-box-user-image" src={this.props.userPhotoURL} alt="Comment author"></img>
          <p className="comment-box-name caption">{this.props.userDisplayName}</p>
        </div>
      </Panel>
    );
  }
}

// The main app
class PetPage extends Component {

  //Constructs the app with an empty set of comments
  constructor() {
    super();
    this.state = {
      comments: [],
      user: { signedIn: 0, displayName: "", photoURL: "" },
      pet: {name: "", imageURL: ""}
    }
  }

  userSignOut = () => {
    firebase.auth().signOut();

  }

  // After the app mounts, connects with firebase and retrieves comments, 
  // and puts the react component in state array
  componentDidMount() {

    //Set observer on user state

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        var currentUser = firebase.auth().currentUser
        this.setState({ user: { signedIn: 1, displayName: currentUser.displayName, photoURL: currentUser.photoURL } });
      } else {

        // No user is signed in.
        this.setState({ user: { signedIn: 0, displayName: "", photoURL: "" } });
        ui.start('#firebaseui-auth-container', uiConfig);
      }
    });

    //Get pet information from db
    firebase.database().ref().child('/pets/'+this.props.params.id).once('value', (snapshot) => {
      this.setState({pet: {name: snapshot.val().name, imageURL: snapshot.val().imageURL}});
    })

    //Runs once for each child in posts node
    firebase.database().ref().child('/comments/'+this.props.params.id).on('child_added', (snapshot) => {

      //Take the comment and key from the db and put them in local consts
      const commentText = snapshot.val().comment;
      const userDisplayName = snapshot.val().userDisplayName;
      const userPhotoURL = snapshot.val().userPhotoURL;
      const reactElement = <CommentBox key={snapshot.key} comment={commentText} userDisplayName={userDisplayName} userPhotoURL={userPhotoURL} />;
      
      //Take previous state and concat the new comment to it
      this.setState((prevState, props) => {return {comments: prevState.comments.concat(reactElement)};});

    });
  };

  // Render the app
  render() {
    return (
      <div className="App">
          <h1 className="title">{this.state.pet.name}</h1>
        <div className="image-container">
          <img className="bolt-image mui--z1" src={this.state.pet.imageURL} alt={this.state.pet.name}></img>
        </div>
        {this.state.user.signedIn ? "" : (<div id="firebaseui-auth-container"></div>)}
        {this.state.user.signedIn ?
          (<p> Welcome, {this.state.user.displayName} <span className="sign-out"><a className="sign-out-link" onClick={this.userSignOut}>Sign out</a></span> </p>) : ''}
        <InputBox userDisplayName={this.state.user.displayName} userPhotoURL={this.state.user.photoURL} petId={this.props.params.id} />
        <div className="comment-container">
          {/* Display comments in reverse order without affecting state array*/}
          {this.state.comments.slice().reverse()}
        </div>
      </div>
    );
  }

componentWillUnmount(){

}
}

export { PetPage as default };

