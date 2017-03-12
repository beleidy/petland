import './add-pet.css';
import React, { Component } from 'react';
import * as firebase from "firebase";
import 'firebase/auth';
import 'firebase/database'
import { Form, Button, Input, Panel } from 'muicss/react';
import '../node_modules/muicss/dist/css/mui.css';

class AddPet extends Component{
    constructor(){
        super();
        this.state={
                petName: "",
                imageURL: ""
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleSubmit(event){
    
        event.preventDefault();
        const ownerId = firebase.auth().currentUser.uid;

        const dbNewPet = {name: this.state.petName, imageURL: this.state.imageURL, ownerId: ownerId};
        // firebase.database().ref().child('/pets/').push(dbNewPet);
        console.debug("Submit");
        this.setState({petName: "", imageURL: ""});
        this.props.router.push("/");

        
        
    }

    handleChange(event){
        event.preventDefault();
        this.setState({[event.target.name]: event.target.value});

    }
    
    render(){
        return(
            <div className="add-pet-container">
                <Form className="add-pet-form" onSubmit={this.handleSubmit}>
                    <legend>Add my pet</legend>
                    <Input name="petName" required={true} label="Your pet's name" floatingLabel={true} onChange={this.handleChange} value={this.state.petName} />
                    <Input name="imageURL" required = {true} type={'url'} label="Link to its image" floatingLabel={true} onChange={this.handleChange} value={this.state.imageURL} />
                    <Button variant="raised" onClick={this.handleSubmit}>Add my pet</Button>
                </Form>
            </div>
        );
    }
}

export default AddPet;
