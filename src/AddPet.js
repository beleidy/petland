import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
import { v4 as uuidv4 } from "uuid";

function AddPet(props) {
  const [petName, setPetName] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(firebase.auth().currentUser);
  const [isFileUpload, setIsFileUpload] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async event => {
    event.preventDefault();

    if (!isSignedIn) {
      setErrorMessage("Please sign in to add your pet");
      return null;
    }

    let imageBlob;

    if (isFileUpload) {
      if (uploadFile.type.startsWith("image")) {
        imageBlob = uploadFile;
      } else {
        setErrorMessage(
          "The file you selected is not an image. Please select another one."
        );
        return null;
      }
    } else {
      const secureImage = imageURL.replace("http:", "https:");
      const response = await fetch(secureImage);

      if (!response.headers.get("content-type").startsWith("image")) {
        setErrorMessage(
          "Sorry, your link does not point to an image, please check and try again."
        );
        return null;
      }
      imageBlob = await response.blob();
    }

    const fileName = uuidv4();
    const storageRootRef = firebase.storage().ref();
    const ownerId = firebase.auth().currentUser.uid;
    const storageFileRef = storageRootRef.child(`${ownerId}/${fileName}`);

    const uploadTask = storageFileRef.put(imageBlob);

    const cancelUploadListner = uploadTask.on(
      "state_changed",
      snapshot => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      error => {
        console.debug("Upload Error");
        setErrorMessage(
          "There was an error uploading your file. Please try again"
        );
        return null;
      },
      async () => {
        // When upload is done and successful
        console.debug("Upload Success!");

        const downloadURL = await storageFileRef.getDownloadURL();

        const dbNewPet = {
          name: petName,
          imageURL: downloadURL,
          ownerId: ownerId
        };
        //Push new pet information to firebase
        const newKey = firebase
          .database()
          .ref()
          .child("pets")
          .push().key;

        const updates = {};
        updates[`/pets/${newKey}`] = dbNewPet;
        firebase
          .database()
          .ref()
          .update(updates);

        // Reset state
        setPetName("");
        setImageURL("");

        cancelUploadListner();

        // Navigate user back to welcome page
        props.history.push(`/pet/${newKey}`);
      }
    );
  };

  const handleFileChange = file => {
    setUploadFile(file.nativeEvent.target.files[0]);
  };

  const handleRadioClick = event => {
    //Depending on which option is chosed, sets state to tell if image will be a file upload
    if (event.target.value === "link") {
      setIsFileUpload(0);
    } else {
      setIsFileUpload(1);
    }
  };

  return (
    <div className="add-pet-container">
      {isSignedIn ? (
        <form
          className="w-5/6 mx-auto bg-my-blue px-10 py-10 flex flex-wrap text-content text-content-color"
          onSubmit={handleSubmit}
        >
          {errorMessage ? (
            <div className="w-1/3 mx-auto bg-my-blue font-bold my-4 py-4 px-2 text-center">
              {errorMessage}
            </div>
          ) : (
            ""
          )}
          <div className="w-full flex my-4">
            <label className="w-1/3 text-right px-5">Your pet's name</label>
            <input
              className="w-2/3 px-3 py-1"
              name="petName"
              required={true}
              onChange={e => setPetName(e.target.value)}
              value={petName}
            />
          </div>
          <div className="w-full flex">
            <div className="w-1/2 text-right my-2">
              <input
                type="radio"
                className="mx-2"
                name="fileSource"
                id="image-upload-radio"
                value="file"
                defaultChecked={true}
                onClick={handleRadioClick}
              />
              <label htmlFor="image-upload-radio">Upload image</label>
            </div>
            <div className="w-1/2 text-center my-2">
              <input
                type="radio"
                className="mx-2"
                id="image-link-radio"
                name="fileSource"
                value="link"
                onClick={handleRadioClick}
              />
              <label htmlFor="image-link-radio">Link to image</label>
            </div>
          </div>

          {isFileUpload ? (
            <div className="w-full flex my-4 justify-end">
              <label
                htmlFor="imageFile"
                className="w-2/3 py-1 bg-my-green text-center rounded shadow hover:shadow-md focus:bg-my-orange"
              >
                {uploadFile ? uploadFile.name : "Click here to select file"}
              </label>
              <input
                className=""
                name="imageFile"
                id="imageFile"
                required={true}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="w-full flex my-4 justify-end">
              <input
                className="w-2/3 px-3 py-1 text-grey-darker"
                name="imageURL"
                required={true}
                type={"url"}
                placeholder="link to your pet's photo"
                onChange={e => setImageURL(e.target.value)}
                value={imageURL}
              />
            </div>
          )}
          <div className="w-full flex justify-end">
            <div className="w-2/3 my-4 text-center">
              <button className="bg-my-green shadow hover:shadow-md px-3 py-2 rounded-lg">
                Add my pet
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="w-1/3 mx-auto bg-my-blue font-bold my-4 py-4 px-2 text-center">
          Please sign in to add a pet
        </div>
      )}
    </div>
  );
}

export default AddPet;
