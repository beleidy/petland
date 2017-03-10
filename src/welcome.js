import React, { Component } from 'react';
import './welcome.css';
import { Link } from 'react-router';
import { Appbar } from 'muicss/react';
import '../node_modules/muicss/dist/css/mui.css';
import * as firebase from "firebase";
// import 'firebase/auth';
import 'firebase/database'

class PetPreview extends Component{
    render(){
        return(
            <div>
            <figure>
            <img src={this.props.petImageURL} alt={this.props.petName} />
            <figcaption>
            <Link to={"/pet/"+this.props.petId}>{this.props.petName}</Link>
            </figcaption>
            </figure>
            </div>
        )
    }
}
class Welcome extends Component{
    constructor(){
        super();
        this.state={
            pets: []
        };
    }
    
    componentDidMount(){
        firebase.database().ref().child('/pets/').on('child_added', (snapshot) => {
            //Store the pet details in local consts
            const petName = snapshot.val().name;
            const petImageURL = snapshot.val().imageURL;
            // Generate the react element holding the pet
            console.debug(snapshot.key);
            var reactElement = <PetPreview key={snapshot.key} petId={snapshot.key} petName={petName} petImageURL={petImageURL} /> 
            
            //Add it to the previous state
            this.setState((prevState, props) => {return {pets: prevState.pets.concat(reactElement)};});
        })
    }

    render(){
        return(
            <div className="welcome">
            <Appbar>
            <h1 className="title">Welcome</h1>
            </Appbar>
            {this.state.pets}
            </div>
        )
    }
}

export {Welcome as default};
