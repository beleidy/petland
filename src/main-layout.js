import React, { Component } from 'react';
import './main-layout.css';
import { Link } from 'react-router';
import './firebaseui.css';
import * as firebase from "firebase";
import 'firebase/auth';
import 'firebase/database'
import * as firebaseui from "firebaseui";
import { Form, Button, Input, Appbar, Panel } from 'muicss/react';
import '../node_modules/muicss/dist/css/mui.css';
import logo from "./img/petland-logo.svg";

class MainLayout extends Component{
    componentDidMount(){
        console.debug(this.props.children);
    }
    
    render(){
const navTableStyle = {verticalAlign: 'middle'};
const navLeft = {justifyContent: "left"};
const navRight = {textAlign: "right"};
const navCenter = {textAlign: "center"};


        return(
            <div className="layout-container">
                <div className="nav-bar">
                    <Appbar>
                        <table className="nav-table" width="100%" style={navTableStyle} >
                            <tbody>
                              <tr>
                                <td className="petland-title mui--appbar-height" style={navLeft}>
                                <Link className="logo" to="/">Petland
                                </Link>
                                </td>
                                <td className="mui--appbar-height" style={navRight}>
                                <Link className="nav-link" to="/add-pet">
                                Add Pet
                                </Link>
                                </td>
                             </tr>
                            </tbody>
                        </table>
                    </Appbar>
                </div>
   
                <div className="view-container">
                    {this.props.children}
                </div>
               <Link to="/add-pet"><Button className="add-pet-fab" variant="fab" color="primary">+</Button></Link>
            </div>

        );
    }
    }
export default MainLayout;