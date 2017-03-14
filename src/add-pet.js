import './add-pet.css';
import React, { Component } from 'react';
import * as firebase from "firebase";
import 'firebase/auth';
import 'firebase/database'
import { Form, Button, Input } from 'muicss/react';
import '../node_modules/muicss/dist/css/mui.css';

class AddPet extends Component{
    constructor(){
        super();
        this.state={
                petName: "",
                imageURL: "",
                isSignedIn: firebase.auth().currentUser
        };

        // Bind the change and submit handler this to component this
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount(){
         //Set observer on user state
        firebase.auth().onAuthStateChanged((user) => {
            //If the user is signed in, set isSigned in to true, otherwise set it false
            if (user){
            this.setState({isSignedIn: true});
            }else{
                this.setState({isSignedIn: false});
            }
        });
    }

    handleSubmit(event){
        //Prevent default submit event to stop page refreshing and url changing
        event.preventDefault();
        
        //If there is no user signed in
        if (!this.state.isSignedIn){
            //Tell the user they are not signed in, and abort form submission 
            alert("You are not signed in");
            return null;
        }
        else{
            //Replace http with https in imageURL
            const secureImage = this.state.imageURL.replace("http", "https");
            
            //Use fetch api to check that the url is an image 
            fetch(secureImage).then((response) => {
                //get link type 
                const linkType = response.headers.get("content-type");
                //Check if type is an image and pass result to .then function
                return linkType.startsWith("image");
            }).then((isImage)=>{
                //If target of the link is an image
                if (isImage){
                    //Get firebase user id
                    const ownerId = firebase.auth().currentUser.uid;
                    //Create object to be passed to firebase 
                    const dbNewPet = {name: this.state.petName, imageURL: secureImage, ownerId: ownerId};
                    //Push new pet information to firebase
                    firebase.database().ref().child('/pets/').push(dbNewPet);
                    //Reset state
                    this.setState({petName: "", imageURL: ""});
                    //Navigate user back to welcome page
                    this.props.router.push("/");
                //If the link is not an image alert user and abort submission to firebase    
                }else{
                    alert("Link is not a link to an image");
                    return null;
                }
                //If the fetch request doesn't work (usually due to no-cors allowed) - show the error in the console
            }).catch((error) => {
                console.log(error);
                alert("Sorry, your link did not work - are you sure it is a direct link to the image?");
                return null;
            });
        } 
    }

    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
    }
    
    render(){
        return(
            <div className="add-pet-container">
            {this.state.isSignedIn ?
                (<Form className="add-pet-form" onSubmit={this.handleSubmit} >
                    <legend>Add my pet</legend>
                    <Input name="petName" required={true} label="Your pet's name" floatingLabel={true} onChange={this.handleChange} value={this.state.petName} />
                    <Input name="imageURL" required={true} type={'url'} label="Link to its image" floatingLabel={true} onChange={this.handleChange} value={this.state.imageURL} />
                    <Button variant="raised">Add my pet</Button>
                </Form>)
            : (<div className="sign-in-request">Please sign in to add a pet</div>)}
            </div>
        );
    }
}

export default AddPet;
