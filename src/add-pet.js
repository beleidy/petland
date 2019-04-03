import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { v4 as uuidv4 } from "uuid";

function AddPet(props) {
  const [petName, setPetName] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(firebase.auth().currentUser);
  const [isFileUpload, setIsFileUpload] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    // Set observer on user state
    firebase.auth().onAuthStateChanged(user => {
      //If the user is signed in, set isSigned in to true, otherwise set it false
      if (user) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    });
  }, []);

  const handleSubmit = event => {
    /********************************************************************************************
        This function handles the submission of the form, general logic is as follows:
        1. Check whether there is a user or not
        If not, abort form submission, if there is a user:
            2.Check if image will be a file upload or image link,
                2.a If a url, fetch, if error, abort submission, if not, store image blob
                2.b If a file, check file exists, if error, abort submission, if not, store image blob
            3. Generate random file name, Upload blob, if error, abort submission, if not - get download url
            4. create a new key, db object and push to db, Navigate to new pet page
        Note: steps 3 and 4 are described in a function that is only invoked once the image blob is ready to avoid async issues.
        **********************************************************************************************/

    event.preventDefault();

    // 1. If there is no user signed in
    if (!isSignedIn) {
      //Tell the user they are not signed in, and abort form submission
      setErrorMessage("Please sign in to add your pet");
      return null;
    }
    // 1. If the user is signed in
    else {
      // 2a. If image is a link
      if (!isFileUpload) {
        //Replace http with https in imageURL
        const secureImage = imageURL.replace("http:", "https:");

        // Use fetch api to check that the url is an image
        fetch(secureImage)
          .then(response => {
            // Check if link is of type image
            const linkIsImage = response.headers
              .get("content-type")
              .startsWith("image");
            if (linkIsImage) {
              return response.blob();
            } else {
              setErrorMessage(
                "Sorry, your link does not point to an image, please check and try again."
              );
              return null;
            }
          })
          .then(imageBlob => {
            // If the image blob is null, return null
            if (!imageBlob) return null;
            startUpload(imageBlob);
          })
          .catch(error => {
            setErrorMessage(
              "Sorry, your link did not work - are you sure it points to an image?"
            );
            return null;
          });
      } else {
        // 2b. If Image is a file upload
        const fileIsImage = uploadFile.type.startsWith("image");
        if (fileIsImage) {
          // Asign the file object to imageBlob variable
          startUpload(uploadFile);
        } else {
          // Display error and abort
          setErrorMessage(
            "The file you selected is not an image. Please select another one."
          );
          return null;
        }
      }
    }
  };

  const startUpload = imageBlob => {
    // 3. Now we have an image blob and it is time to upload it

    // Generate a random file name
    const fileName = uuidv4();

    // Create a storage bucket root refrence
    const storageRootRef = firebase.storage().ref();

    // Get user id from firebase
    const ownerId = firebase.auth().currentUser.uid;

    // Create a firebase storage bucket file refrence using user id and file name
    const storageFileRef = storageRootRef.child(ownerId + "/" + fileName);

    // Ask firebase to upload the file
    var uploadTask = storageFileRef.put(imageBlob);

    // Track file upload status in console, can be used later to animate a progress bar
    uploadTask.on(
      "state_changed",
      snapshot => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      error => {
        console.debug("Upload Error");
        setErrorMessage(
          "There was an error uploading your file. Please try again"
        );
        return null;
      },
      () => {
        // When upload is done and successful
        console.debug("Upload Success!");
        storageFileRef.getDownloadURL().then(downloadURL => {
          console.debug(downloadURL);
          // 4. Create the db object, push to database and navigate user to new pet page

          // Create object to be passed to firebase
          const dbNewPet = {
            name: petName,
            imageURL: downloadURL,
            ownerId: ownerId
          };
          //Push new pet information to firebase
          var newKey = firebase
            .database()
            .ref()
            .child("pets")
            .push().key;
          const updates = {};
          updates["/pets/" + newKey] = dbNewPet;
          firebase
            .database()
            .ref()
            .update(updates);
          // Reset state
          setPetName("");
          setImageURL("");
          // Navigate user back to welcome page
          props.history.push("/pet/" + newKey);
        });
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
              <label for="image-upload-radio">Upload image</label>
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
              <label for="image-link-radio">Link to image</label>
            </div>
          </div>

          {isFileUpload ? (
            <div className="w-full flex my-4 justify-end">
              <label
                for="imageFile"
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
