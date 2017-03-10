import React, { Component } from 'react';
import './welcome.css';
import { Link } from 'react-router';
import { Appbar } from 'muicss/react';
import '../node_modules/muicss/dist/css/mui.css';


class Welcome extends Component{
    render(){
        return(
            <div className="welcome">
            <Appbar>
            <h1 className="title">Welcome</h1>
            </Appbar>
            <Link to="/pet-page">Take me to bolt</Link>
            </div>
        )
    }
}

export {Welcome as default};
