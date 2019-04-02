import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/database";

function PetCard(props) {
  return (
    <Link
      className="w-64 h-48 mx-5 my-10 no-underline"
      to={"/pet/" + props.petId}
    >
      <div
        className="w-full h-full flex items-end rounded-lg bg-cover"
        style={{ backgroundImage: `url(${props.petImageURL})` }}
      >
        <div className="w-full text-center text-content-color bg-grey-lighter">
          {props.petName}
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
    <div className="container mx-auto flex flex-wrap justify-around">
      {pets
        .slice()
        .reverse()
        .map(pet => (
          <PetCard
            key={pet.key}
            petId={pet.key}
            petName={pet.name}
            petImageURL={pet.imageURL}
          />
        ))}
    </div>
  );
}

export { HomePage as default };
