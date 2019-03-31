import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/database";

import "./css/welcome.css";
import "../node_modules/muicss/dist/css/mui.css";

function PetPreview(props) {
    let s = { backgroundImage: "url(" + props.petImageURL + ")" };

    return (
        <Link className="pet-card-link" to={"/pet/" + props.petId}>
            <div className="pet-card mui--z3" style={s}>
                <div className="pet-caption">
                    <span>{props.petName}</span>
                </div>
            </div>
        </Link>
    );
}

function Welcome(props) {
    const [pets, setPets] = useState([]);

    useEffect(() => {
        firebase
            .database()
            .ref()
            .child("/pets/")
            .on("child_added", snapshot => {
                // Store the pet details in local consts
                const petName = snapshot.val().name;
                const petImageURL = snapshot.val().imageURL;
                // Generate the react element holding the pet
                var reactElement = (
                    <PetPreview
                        key={snapshot.key}
                        petId={snapshot.key}
                        petName={petName}
                        petImageURL={petImageURL}
                    />
                );
                // Add it to the previous state
                setPets(pets => pets.concat(reactElement));
            });
    }, []);

    return <div className="welcome-container">{pets.slice().reverse()}</div>;
}

export { Welcome as default };
