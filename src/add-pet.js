import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { Form, Button, Input, Radio } from "muicss/react";

// import "./css/add-pet.css";
// import "../node_modules/muicss/dist/css/mui.css";

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

    // Prevent default submit event to stop page refreshing and url changing
    event.preventDefault();

    // 1. If there is no user signed in
    if (!isSignedIn) {
      //Tell the user they are not signed in, and abort form submission
      setErrorMessage("Please sign in to add your pet");
      return null;
    }
    // 1. If the user is signed in
    else {
      // Declare variable where we will store the image blob
      var imageBlob = {};

      // 2a. If image is a link
      if (!isFileUpload) {
        //Replace http with https in imageURL
        const secureImage = imageURL.replace("http:", "https:");

        // Use fetch api to check that the url is an image
        fetch(secureImage)
          .then(response => {
            //Check if link is of type image
            var linkIsImage = response.headers
              .get("content-type")
              .startsWith("image");
            if (linkIsImage) {
              console.debug("Link is an image: " + linkIsImage);
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
        console.debug("Image is a file upload");

        const fileIsImage = uploadFile.type.startsWith("image");
        if (fileIsImage) {
          console.debug("Upload file type is an image");

          // Asign the file object to imageBlob variable
          imageBlob = uploadFile;
          startUpload(imageBlob);
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
    const fileName = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function(c) {
        /* eslint-disable */
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        /* eslint-enable */
        return v.toString(16);
      }
    );

    // Create a storage bucket root refrence
    const storageRootRef = firebase.storage().ref();

    // Get user id from firebase
    const ownerId = firebase.auth().currentUser.uid;

    // Create a firebase storage bucket file refrence using user id and file name
    const storageFileRef = storageRootRef.child(ownerId + "/" + fileName);

    // Ask firebase to upload the file
    console.log("Upload about to start");
    var uploadTask = storageFileRef.put(imageBlob);

    // Declare variable where we will store the download link
    var imageDbLink = "";

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
          imageDbLink = downloadURL;

          // 4. Create the db object, push to database and navigate user to new pet page

          // Create object to be passed to firebase
          const dbNewPet = {
            name: petName,
            imageURL: imageDbLink,
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
        <Form className="add-pet-form" onSubmit={handleSubmit}>
          <legend>Add my pet</legend>
          {errorMessage ? (
            <div className="error-message">{errorMessage}</div>
          ) : (
            ""
          )}
          <Input
            name="petName"
            required={true}
            label="Your pet's name"
            floatingLabel={true}
            onChange={e => setPetName(e.target.value)}
            value={petName}
          />
          <div className="radio-container">
            <Radio
              className="add-pet-radio"
              name="fileSource"
              label="Upload image"
              value="file"
              defaultChecked={true}
              onClick={handleRadioClick}
            />
            <Radio
              className="add-pet-radio"
              name="fileSource"
              label="Link to image"
              value="link"
              onClick={handleRadioClick}
            />
          </div>
          {isFileUpload ? (
            <input
              className="file-input appear"
              name="imageFile"
              required={true}
              type="file"
              accept="image/gif, image/jpeg"
              label="Select image to upload"
              onChange={handleFileChange}
            />
          ) : (
            <Input
              className="url-input appear"
              name="imageURL"
              required={true}
              type={"url"}
              label="Link to its image"
              floatingLabel={true}
              onChange={e => setImageURL(e.target.value)}
              value={imageURL}
            />
          )}
          <Button variant="raised" color={"primary"}>
            Add my pet
          </Button>
        </Form>
      ) : (
        <div className="sign-in-request">Please sign in to add a pet</div>
      )}
    </div>
  );
}

export default AddPet;
