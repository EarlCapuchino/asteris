/*
    This is the source folder for the path '/' or the default page
*/ 

import '../css/default.css';
import Login from './Login.js';
import React from 'react';

class Default extends React.Component{

    render(){
        return(
        <div className="App">
            <Login/>
        </div>);
    }
}




export default Default;
