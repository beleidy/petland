import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/database";

import "./css/welcome.css";
import "../node_modules/muicss/dist/css/mui.css";

function PetCard(props) {
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

function HomePage(props) {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    firebase
      .database()
      .ref()
      .child("/pets/")
      .on("child_added", snapshot => {
        setPets(pets =>
          pets.concat({
            key: snapshot.key,
            name: snapshot.val().name,
            imageURL: snapshot.val().imageURL
          })
        );
      });
  }, []);

  return (
    <div className="welcome-container">
      {pets
        .slice()
        .reverse()
        .map(pet => (
          <PetCard
            key={pet.key}
            petId={pet.key}
            petName={name}
            petImageURL={imageURL}
          />
        ))}
    </div>
  );
}

export { HomePage as default };
