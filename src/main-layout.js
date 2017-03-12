import React, { Component } from 'react';
import './main-layout.css';
import { Link } from 'react-router';
import { Button, Appbar } from 'muicss/react';
import '../node_modules/muicss/dist/css/mui.css';

class MainLayout extends Component{

    render(){
        const navTableStyle = {verticalAlign: 'middle'};
        const navLeft = {justifyContent: "left"};
        const navRight = {textAlign: "right"};


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