/*
    Source code description: This source code contains functions that allows the administrator user
    to add multiple users within their discretion.
*/

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../hooks/authHook'
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Menu from '../components/Menu'
import '../../css/add_users.css'
import { ToastContainer } from 'react-toastify';
import '../../css/toast_container.css';
import { notifyError, notifySuccess } from '../components/Popups/toastNotifUtil';
import { Icon } from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye';

const Add_User_Page=()=>{

    const {REACT_APP_HOST_IP} = process.env

    const { user, setAuth } = useStore();
    const navigate = useNavigate();     // navigation hook

    const [userRole, setRole] = useState("");
    const [fileName, setfileName] = useState("");
    const [fileData, setFileData] = useState();
    const [fileInputKey, setFileInputKey] = useState(Date.now());

    /*
        a function called upon loading the page to check if the currently logged in 
        user's role is a CHAIR/HEAD
    */
    useEffect(() => {
        if(user.user_role !=="CHAIR/HEAD"){
            navigate("/home")
            notifyError("Must be an admin to access this page")
        }
    },)

    /*
        a function that once called, collects the admin's inputs and sends these inputs to the back-end
        to be processed
    */
    const readInput = async (e) =>{
        e.preventDefault();

        const user_details = new FormData();
        user_details.append("image", fileData);
        user_details.append("first_name", document.getElementById("first_name").value);
        user_details.append("last_name", document.getElementById("last_name").value);
        user_details.append("user_role", document.getElementById("user_role").value);
        user_details.append("username", document.getElementById("username").value);
        user_details.append("password", document.getElementById("password").value);
        user_details.append("email", document.getElementById("email").value);
        user_details.append("phone_number", document.getElementById("phone_number").value);
        user_details.append("display_picture", fileName);
        user_details.append("user_id", user.user_id);
        
        sendData(user_details);
    }

    /*
        a function that handles the file uploaded for display picture
    */
    const fileChangeHandler = (e) => {
        setFileData(e.target.files[0]);
        setfileName(e.target.files[0].name)
    };

    /*
        A function called to send user information inputted by the administrator to back-end. 
        If necessary input fields are not satisfied, the user will not be created.
        Phone numbers and display pictures are optional to add. 
    */
    const sendData=(user_details)=>{
        const password_format = /^(?=.*[-_.!"'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/
        const username_format = /^[A-Za-z]\w*$/
        const mail_format = /^[a-zA-Z0-9]+([.-]?[a-zA-Z0-9]+)*@[a-zA-Z]+([.-]?[a-zA-Z0-9]+)*(.[a-zA-Z]{2,3})+$/
        const phone_format = /^\+639[0-9]{9,}$/
        const confirm_pass = document.getElementById("confirm_password").value

        if(user_details.get('first_name') === ""){
            notifyError("Missing first name")
        }else if(user_details.get('last_name') === "") {
            notifyError("Missing last name")
        } else if(user_details.get('password') === "") {
            notifyError("Missing password")
        } else if(user_details.get('user_role') === "") {
            notifyError("Mlease select a user role")
        } else if(user_details.get('username') === "") {
            notifyError("Missing username")
        } else if(user_details.get('email') === "") {
            notifyError("Missing email")
        } else if(user_details.get('phone_number') !== "" && user_details.phone_number !== undefined) {
            if(!user_detailsget('phone_number').match(phone_format)){notifyError("please follow +639XXXXXXXXX format")};
        } else if(!user_details.get('username').match(username_format)){
            notifyError("Username must start with a letter")
        }else if(!user_details.get('email').match(mail_format)){
            notifyError("Invalid mail")
        }else if(!user_details.get('password').match(password_format)){
            notifyError("Password must be at least 8 characters and contains at least 1 upper-case letter, 1 lower-case letter, and a special character");
        }else if(user_details.get('password') !== confirm_pass){
            notifyError("Passwords don't match!")
        } else{
            fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/user', {
                method: 'POST',
                credentials:'include',
                
                body: user_details
            }).then((response) => {return response.json()})
            .then(json =>{
                if (json.result.session.silentRefresh) {
                    setAuth(json.result.session.user, json.result.session.silentRefresh)
                }
                if(json.result.success){
                   notifySuccess(json.result.message)
                   clearInputs();
               }else{
                   notifyError(json.result.message)
               }}
            )
        }
    }

    // function to clear input fields upon reset / submission
    const clearInputs=()=>{
        document.getElementById("first_name").value = ""
        document.getElementById("last_name").value = ""
        document.getElementById("user_role").value = ""
        document.getElementById("username").value = ""
        document.getElementById("password").value = ""
        document.getElementById("confirm_password").value = ""
        document.getElementById("email").value = ""
        document.getElementById("phone_number").value = ""
        setFileInputKey(Date.now())
    }

    //handles user role value
    const handleChange=()=>{
        setRole(document.getElementById("user_role").value);
    }

    //states to handle the type of the password input field
    const [type, setType] = useState('password')
    const [icon, setIcon] = useState(eyeOff)
    const [type1, setType1] = useState('password')
    const [icon1, setIcon1] = useState(eyeOff)


    // changes the type of an input field upon clicking the related button for password
    const handleToggle = () => {
        if(type === 'text'){
            setIcon(eyeOff);
            setType('password');
        } else {
            setIcon(eye);
            setType('text');
        }
    }

    // changes the type of an input field upon clicking the related button for confirm password
    const handleToggle1 = () => {
        if(type1 === 'text'){
            setIcon1(eyeOff);
            setType1('password'); 
        } else {
            setIcon1(eye);
            setType1('text');
        }
    }

    return(
        <div>
            <div className='add-user-body'>
            <form className='signup-field'>
                <h2> Create Account </h2>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                <input type="text" className = "field" id="first_name" placeholder="&#xf2c1; &nbsp;  First Name" required></input><br />
                <input type="text" className = "field" id="last_name" placeholder="&#xf2c1;  &nbsp; Last Name" ></input><br />
                <select className = "rolefield" id="user_role" value={userRole} onChange={handleChange}>
                    <option value=""disabled defaultValue hidden >&#xf2c1;  &nbsp; User Role</option>
                    <option value="ocs rep">OCS Rep</option>
                    <option value="acs">ACS</option>
                    <option value="unit rep">Unit Rep</option>
                    <option value="member">Member</option>
                </select><br />
                <input type="text" className = "field" id="username" placeholder="&#xf2c1;  &nbsp; Username" required /><br />
                <i onClick={handleToggle}id = "visibilityBtn" className='eyeUsers'><Icon icon = {icon} ></Icon></i>
                <input type={type} className = "field" id="password"placeholder = "&#xf023; &nbsp; Password"/><br />
                <i onClick={handleToggle1}id = "visibilityBtn" className='eyeUsers'><Icon icon = {icon1} ></Icon></i>
                <input type={type1} className = "field" id="confirm_password" placeholder = "&#xf023; &nbsp; Confirm Password" /><br />
                <input type="text" className = "field" id="email"placeholder = "&#xf0e0; &nbsp; Email"/><br />
                <input type="text" className = "field" id="phone_number"placeholder = "&#xf095; &nbsp;  Phone Number [+639XXXXXXXXX]"/><br />
                <p className='prof-pic-text'>Add Profile Picture:</p>
                <input type="file" key = {fileInputKey} className='picfield' onChange={fileChangeHandler} />

                <div className='create-user-buttons'>
                    <input type="reset" value="Reset" className='reset-button' onClick={clearInputs}/>
                    <input type="submit" value="Confirm" className='confirm-button' onClick={readInput}/>
                </div>
            </form>
            </div>
            <Menu/>
            <Header />
            <ToastContainer className='toast-container' />
            <Footer/>
        </div> 
    )
}

export default Add_User_Page;