import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as firebase from "firebase";
import "firebase/auth";
import "firebase/database";
import Moment from "moment";
import { Form, Button, Input, Panel } from "muicss/react";

import "./css/pet.css";
import "../node_modules/muicss/dist/css/mui.css";

// Comment input box
function InputBox(props) {
    const [value, setValue] = useState("");

    const handleSubmit = event => {
        event.preventDefault();

        // Get firebase current user
        var fuser = firebase.auth().currentUser;

        // Checks if a user is signed in from firebase and alerts
        if (!fuser) {
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
            authorId: fuser.uid,
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
        var fuser = firebase.auth().currentUser;
        if (!fuser) {
            alert("You cannot leave a comment if you are not signed in");
            return null;
        } else {
            event.preventDefault();
            const currentText = event.target.value.slice();
            setValue(currentText);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Input
                className={"input-box"}
                floatingLabel={true}
                label={"Write a comment and press Enter"}
                onChange={handleChange}
                value={value}
            />
            <Button variant="raised">post</Button>
        </Form>
    );
}

// Returns a comment box with props.comment in its text
function CommentBox(props) {
    return (
        <Panel className="comment-box mui--z2">
            <div className="comment-box-text">
                <p className="mui--text-body1">{props.comment}</p>
            </div>
            <div className="comment-box-author">
                <img
                    className="comment-box-user-image"
                    src={props.userPhotoURL}
                    alt="Comment author"
                />
                <p className="comment-box-name caption">
                    {props.userDisplayName}
                </p>
                {props.timestamp ? (
                    <div className="comment-timestamp">
                        {Moment(props.timestamp).calendar()}
                    </div>
                ) : (
                    ""
                )}
            </div>
        </Panel>
    );
}

// The main app
function PetPage(props) {
    // Constructs the app with an empty set of comments

    const [comments, setComments] = useState([]);
    const [user, setUser] = useState({
        signedIn: 0,
        displayName: "",
        photoURL: ""
    });
    const [pet, setPet] = useState({ name: "", imageURL: "" });
    const [petExists, setPetExists] = useState(true);

    // After the app mounts, connects with firebase and retrieves comments,
    // and puts the react component in state array
    useEffect(() => {
        // Set observer on user state
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                // User is signed in.
                var currentUser = firebase.auth().currentUser;

                setUser({
                    signedIn: 1,
                    displayName: currentUser.displayName,
                    photoURL: currentUser.photoURL
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
                    setPet({
                        name: snapshot.val().name,
                        imageURL: snapshot.val().imageURL
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
                const commentText = snapshot.val().comment;
                const userDisplayName = snapshot.val().userDisplayName;
                const userPhotoURL = snapshot.val().userPhotoURL;
                const timestamp = snapshot.val().timestamp;
                const reactElement = (
                    <CommentBox
                        key={snapshot.key}
                        comment={commentText}
                        userDisplayName={userDisplayName}
                        userPhotoURL={userPhotoURL}
                        timestamp={timestamp}
                    />
                );

                // Take previous state and concat the new comment to it

                setComments(comments => comments.concat(reactElement));
            });
    }, []);

    // Render the app

    if (petExists) {
        return (
            <div className="App">
                <h1 className="title">{pet.name}</h1>
                <div className="image-container">
                    <img
                        className="bolt-image mui--z1"
                        src={pet.imageURL}
                        alt={pet.name}
                    />
                </div>
                {user.signedIn ? (
                    <InputBox
                        userDisplayName={user.displayName}
                        userPhotoURL={user.photoURL}
                        petId={props.match.params.id}
                    />
                ) : (
                    <div className="pet-sign-in-request">
                        Please sign in to leave a comment
                    </div>
                )}
                <div className="comment-container">
                    {comments.slice().reverse()}
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

export { PetPage as default };
