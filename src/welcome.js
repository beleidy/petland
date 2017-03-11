import React, { Component } from 'react';
import './welcome.css';
import { Link } from 'react-router';
import { Appbar, Panel } from 'muicss/react';
import '../node_modules/muicss/dist/css/mui.css';
import * as firebase from "firebase";
// import 'firebase/auth';
import 'firebase/database'

class PetPreview extends Component{
    render(){
        let s = {backgroundImage: "url("+this.props.petImageURL+")"};

        return(
            <Link className="pet-card-link" to={"/pet/"+this.props.petId}>
                <div className="pet-card mui--z3" style={s}>    
                    <div className="pet-caption"><span>{this.props.petName}</span></div>
                </div>
            </Link>
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
            var reactElement = <PetPreview key={snapshot.key} petId={snapshot.key} petName={petName} petImageURL={petImageURL} /> 
            
            //Add it to the previous state
            this.setState((prevState, props) => {return {pets: prevState.pets.concat(reactElement)};});
        })
    }

    render(){
        return(
            <div className="welcome-container">
            {this.state.pets.slice().reverse()}
            </div>
        )
    }
}

export {Welcome as default};
