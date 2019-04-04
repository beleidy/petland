import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as firebase from "firebase";
import "firebase/auth";
import "firebase/database";
import Moment from "moment";

function PetPage(props) {
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState({
    signedIn: 0,
    displayName: "",
    photoURL: ""
  });
  const [pet, setPet] = useState({ name: "", imageURL: "" });
  const [petExists, setPetExists] = useState(true);

  const db = firebase.database().ref();

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const { uid } = firebase.auth().currentUser;

        setUser({
          signedIn: 1,
          uid
        });
      } else {
        // No user is signed in.

        setUser({ signedIn: 0, displayName: "", uid: null });
      }
    });

    // Get pet information from db
    firebase
      .database()
      .ref()
      .child("/pets/" + props.match.params.id)
      .once("value", snapshot => {
        // Check if a pet at this Id exists
        if (snapshot.exists()) {
          //Set state with pet info

          setPetExists(true);
          const { name, imageURL } = snapshot.val();
          setPet({
            name,
            imageURL
          });
        } else {
          //If pet does not exist
          setPetExists(false);
        }
      });

    // Runs once for each child in posts node
    db.child("/comments/" + props.match.params.id).on(
      "child_added",
      snapshot => {
        // Take the comment and key from the db and put them in local consts
        const { comment, authorId, timestamp } = snapshot.val();

        db.child(`/users/${authorId}`).once("value", snapshot => {
          const { displayName, photoURL } = snapshot.val();

          setComments(comments =>
            comments.concat({ comment, displayName, photoURL, timestamp })
          );
        });
      }
    );
  }, []);

  if (petExists) {
    return (
      <div className="">
        <h1 className="w-full text-center text-headline-color font-headline font-bold my-4">
          {pet.name}
        </h1>

        <img
          className="block w-4/5 max-w-lg mx-auto mb-8 rounded-lg shadow-sm"
          src={pet.imageURL}
          alt={pet.name}
        />

        {user.signedIn ? (
          <InputBox userID={user.uid} petId={props.match.params.id} />
        ) : (
          <div className="w-1/3 mx-auto bg-my-blue font-bold my-4 py-4 px-2 text-center">
            Please sign in to leave a comment
          </div>
        )}
        <div className="">
          {comments
            .slice()
            .reverse()
            .map(comment => (
              <CommentBox key={comment.timestamp} {...comment} />
            ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="no-pet">
        We're sorry but this pet does not exist. Why don't you{" "}
        <Link to="/add-pet">add it to the site?</Link>
      </div>
    );
  }
}

function InputBox(props) {
  const [value, setValue] = useState("");

  const handleSubmit = event => {
    event.preventDefault();

    const user = firebase.auth().currentUser;
    if (!user) {
      alert("You cannot leave a comment if you are not signed in");
      return null;
    }

    // Checks if a comment is empty and alerts
    if (value.slice() === "") {
      alert("You cannot submit an empty comment");
      return null;
    }

    // generate the comments object
    var dbComment = {
      authorId: user.uid,
      comment: value.slice(),
      timestamp: firebase.database.ServerValue.TIMESTAMP
    };

    // generate a new object in the posts node
    firebase
      .database()
      .ref()
      .child("/comments/" + props.petId)
      .push(dbComment);

    // Reset the text textarea
    setValue("");
  };

  const handleChange = event => {
    event.preventDefault();

    const currentText = event.target.value.slice();
    setValue(currentText);
  };

  return (
    <form className="mx-auto w-2/3" onSubmit={handleSubmit}>
      <input
        className="w-full bg-my-blue py-3 px-3 text-content-color font-content"
        placeholder={"Write a comment and press Enter"}
        onChange={handleChange}
        value={value}
      />
      <button className="block mx-auto bg-my-green rounded-lg px-8 py-2 mt-2 mb-8">
        post
      </button>
    </form>
  );
}

function CommentBox({ comment, displayName, photoURL, timestamp }) {
  return (
    <div className="w-5/6 mx-auto flex bg-my-orange rounded-lg my-4 font-content text-content-color">
      <div className="flex-grow px-4 py-8">{comment}</div>

      <div className="w-1/5 text-center text-grey-darkest bg-my-blue py-4 px-2 rounded-r-lg">
        <img className="rounded-sm" src={photoURL} alt="Comment author" />
        <p className="">{displayName}</p>
        {timestamp ? (
          <div className="text-xs text-grey">
            {Moment(timestamp).calendar()}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export { PetPage as default };
