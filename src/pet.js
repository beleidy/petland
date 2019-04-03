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

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL } = firebase.auth().currentUser;

        setUser({
          signedIn: 1,
          displayName,
          photoURL
        });
      } else {
        // No user is signed in.

        setUser({ signedIn: 0, displayName: "", photoURL: "" });
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
    firebase
      .database()
      .ref()
      .child("/comments/" + props.match.params.id)
      .on("child_added", snapshot => {
        // Take the comment and key from the db and put them in local consts
        const {
          comment,
          userDisplayName,
          userPhotoURL,
          timestamp
        } = snapshot.val();
        setComments(comments =>
          comments.concat({ comment, userDisplayName, userPhotoURL, timestamp })
        );
      });
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
          <InputBox
            userDisplayName={user.displayName}
            userPhotoURL={user.photoURL}
            petId={props.match.params.id}
          />
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
              <CommentBox {...comment} />
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
      userDisplayName: props.userDisplayName,
      userPhotoURL: props.userPhotoURL,
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
    const user = firebase.auth().currentUser;
    if (!user) {
      alert("You cannot leave a comment if you are not signed in");
      return null;
    } else {
      const currentText = event.target.value.slice();
      setValue(currentText);
    }
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

function CommentBox(props) {
  return (
    <div className="w-5/6 mx-auto flex bg-my-orange rounded-lg my-4 font-content text-content-color">
      <div className="flex-grow px-4 py-8">{props.comment}</div>

      <div className="w-1/5 text-center text-grey-darkest bg-my-blue py-4 px-2 rounded-r-lg">
        <img
          className="rounded-sm"
          src={props.userPhotoURL}
          alt="Comment author"
        />
        <p className="">{props.userDisplayName}</p>
        {props.timestamp ? (
          <div className="text-xs text-grey">
            {Moment(props.timestamp).calendar()}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export { PetPage as default };
