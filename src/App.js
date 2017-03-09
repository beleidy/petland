import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase";
import 'firebase/auth';
import 'firebase/database'
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
      
      // generate a new object in the posts node
      var newPostKey = firebase.database().ref().child('posts').push().key;

      // Define a new object dbComment that will be passed to db
      var dbComment = {};
      dbComment['/posts/' + newPostKey] = {comment: currentText.substring(0, currentText.length - 1)};
      //Submit to db  
      firebase.database().ref().update(dbComment);
      
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
    <p>{this.props.comment}</p>
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
     comments: []
   }
 }

// After the app mounts, connects with firebase and retrieves comments, 
// and puts the react component in state array
componentDidMount(){

//Runs once for each child in posts node
firebase.database().ref().child('/posts/').on('child_added', (snapshot) => {

  //Take the comment and key from the db and put them in local consts
  const commentText = snapshot.val().comment;
  const reactElement = <CommentBox key={snapshot.key} comment={commentText} />;

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
      <InputBox />
      <div className="comment-container">
      {/* Display comments in reverse order without affecting state array*/}
      {this.state.comments.slice().reverse()}
      </div> 
      </div>
    );
  }
}

export {App as default};

