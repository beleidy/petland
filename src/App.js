import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import './firebaseui.css';
import * as firebase from "firebase";
import 'firebase/auth';
import 'firebase/database'
import * as firebaseui from "firebaseui";
import bolt from './img/bolt.jpg';

// Initialise the Firebase App

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBrnkI94u4OARVGxfmCbN9ZP-zBByJGUnw",
    authDomain: "bolt-724ba.firebaseapp.com",
    databaseURL: "https://bolt-724ba.firebaseio.com",
    storageBucket: "bolt-724ba.appspot.com",
    messagingSenderId: "723766986371"
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
  ui.start('#firebaseui-auth-container', uiConfig);

//Comment input box
class InputBox extends Component{
  constructor(){
    super();
    this.state = {
      value: ""
    };
    
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event){
    const currentText = event.target.value.slice();
    this.setState({value: currentText});
    const lastChar = currentText.charAt(currentText.length - 1);
    
    if ( lastChar === '\n' && currentText.length !== 1){

      //Alert user if they are not signed in
      if (this.props.userDisplayName === ""){
      alert("You cannot leave a comment if you are not signed in");
      this.setState({value: currentText.substring(0,currentText.length-1)});
      return null;
    };
      
      // generate a new object in the posts node
      var newPostKey = firebase.database().ref().child('posts').push().key;

      //generate the comments object
      var dbComment = {
        comment: currentText.substring(0, currentText.length - 1),
        userDisplayName: this.props.userDisplayName,
        userPhotoURL: this.props.userPhotoURL
      };

      // Define a new object dbComment that will be passed to db
      var dbObject = {};
      dbObject['/posts/' + newPostKey] = dbComment;
      //Submit to db  
      firebase.database().ref().update(dbObject);
      
    //Reset the text textarea
     this.setState({value: ""});
    }

  }  
  render(){
    return(
      <textarea className="input-box" placeholder={"Enter your comment here and press Enter"} value={this.state.value} onChange={this.handleChange} ></textarea>
      
    )
  }
}

// Returns a comment box with props.comment in its text
class CommentBox extends Component{
  render(){
    return(
    <div className="comment-box">
    <div className="comment-box-text">
    <p>{this.props.comment}</p>
    </div>
    <div className="comment-box-author">
    <img className="comment-box-user-image" src={this.props.userPhotoURL} alt="Comment author"></img>
    <p className="comment-box-name"> - {this.props.userDisplayName} </p>
    </div>
    </div>
    );
  }
}

// The main app
class App extends Component {

//Constructs the app with an empty set of comments
 constructor(){
   super();
   this.state = {
     comments: [],
     user: {signedIn: 0, displayName: "", photoURL: ""}      
   }
 }

// After the app mounts, connects with firebase and retrieves comments, 
// and puts the react component in state array
componentDidMount(){

//Set observer on user state

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in.
    var currentUser = firebase.auth().currentUser
     // setTimeout(function(){firebase.auth().signOut();}, 1000);
    this.setState({user: {signedIn: 1, displayName: currentUser.displayName, photoURL: currentUser.photoURL}});
  } else {

    // No user is signed in.
    this.setState({user: {signedIn: 0, displayName: "", photoURL: ""}});
  }
});  

//Runs once for each child in posts node
firebase.database().ref().child('/posts/').on('child_added', (snapshot) => {

  //Take the comment and key from the db and put them in local consts
  const commentText = snapshot.val().comment;
  const userDisplayName = snapshot.val().userDisplayName;
  const userPhotoURL = snapshot.val().userPhotoURL;
  const reactElement = <CommentBox key={snapshot.key} comment={commentText} userDisplayName={userDisplayName} userPhotoURL={userPhotoURL} />;

  // Copy current state of comments
  const currentComments = this.state.comments.slice();
  //Add the current comment to the state comments array
  const newComments = currentComments.concat(reactElement);
  //Set state with new set of comments to persrve immutability
  this.setState({comments: newComments});

  });
};

 // Render the app
  render() {
    return (
      <div className="App">
      <h1 className="title"> Leave a comment for B.O.L.T </h1>
      <div className="image-container">
        <img className="bolt-image" src={bolt} alt="Bolt the cat"></img>
      </div>
      {this.state.user.signedIn? "": (<div id="firebaseui-auth-container"></div>)}
      <p>You're {this.state.user.signedIn? '' : 'not'} signed in</p>
      {this.state.user.signedIn?
      (<p> Welcome {this.state.user.displayName} </p>): ''}
      <InputBox userDisplayName={this.state.user.displayName} userPhotoURL={this.state.user.photoURL} />
      <div className="comment-container">
      {/* Display comments in reverse order without affecting state array*/}
      {this.state.comments.slice().reverse()}
      </div> 
      </div>
    );
  }
}

export {App as default};

