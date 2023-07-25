/*
    Source code description: This source code contains functionalities involved in resetting 
    the password of a user
*/
import React, { useEffect, useState, useRef } from 'react';
import Footer from '../components/Footer';
import UPLB from '../../images/uplb.png';
import Logo from '../../images/asteris-logo.webp'
import { ToastContainer } from 'react-toastify';
import { notifySuccess } from '../components/Popups/toastNotifUtil';
import { notifyError } from '../components/Popups/toastNotifUtil';
import '../../css/forgotpassword.css'
import { Icon } from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () =>{
    const {REACT_APP_HOST_IP} = process.env;
    const [otpClicked, setOTPClicked] = useState(false);
    const navigate = useNavigate();
    const [newPass, setNewPass] = useState("");
    const [newConfPass, setConfPass] = useState("");
    const [otp, setOTP] = useState("");

    const [type, setType0] = useState('password')
    const [icon, setIcon] = useState(eyeOff)
    const [type1, setType1] = useState('password')
    const [icon1, setIcon1] = useState(eyeOff)

    /*
        A function that is called when the confirm password, password, and otp input fields
        are changed. If all fields are properly inputted, the 'Submit' Button will be clickable.
        If not all fields are propely inputted, the 'Submit' Button will not be clickable 
    */
    useEffect(()=>{
        if(otp && newConfPass && newPass){setOTPClicked(true);}
        else{setOTPClicked(false);}
    },[newConfPass, newPass, otp])

    
    //states to handle the type of the new password input field

    const handleToggle = () => {
        if(type === 'text'){
            setIcon(eyeOff);
            setType0('password');
        } else {
            setIcon(eye);
            setType0('text');
        }
    }


    //states to handle the type of the confirm password input field
    const handleToggle1 = () => {
        if(type1 === 'text'){
            setIcon1(eyeOff);
            setType1('password'); 
        } else {
            setIcon1(eye);
            setType1('text');
        }
    }
    /*
        A function called upon clicking 'Submit' which will send the required data for resetting
        password to the back-end 
    */
    const submitChange=()=>{
        const password_format = /^(?=.*[-_.!"'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/
        let local_email = document.getElementById('email-field').value;
        let new_pass = document.getElementById('newpassword-field').value
        let conf_pass = document.getElementById('confpassword-field').value
        let local_otp = document.getElementById('otp-field').value

        if(!new_pass || !conf_pass || !local_otp){
            notifyError('Please complete fields')
        }else if(!new_pass.match(password_format)){
            notifyError("password must be at least 8 characters and contains at least 1 upper-case letter, 1 lower-case letter, and a special character");
        }else if(new_pass !== conf_pass){
            notifyError("Passwords do not match!")
        }else{
            fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/user/password/reset',{
                method: 'POST',
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    email: local_email,
                    new_password: new_pass,
                    otp: local_otp
                })
            }).then(response=>{return response.json()})
            .then(json=>{
                if(json.success){
                    notifySuccess(json.message)
                    setTimeout(()=>{
                        navigate("/")
                    }, 3000)
                }else(
                    notifyError(json.message)
                )
            })

        }
        
    }

    // A function that calls on a back-end function that generates an OTP for resetting password 
    const fetchOTP=async()=>{ 
        let local_email = document.getElementById('email-field').value;
        if(local_email === '' || local_email === undefined){
            notifyError("please input your email")
        }else{
            fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/auth/otp',{
                method: 'POST',
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({email: local_email})
                
            }).then(response => {return response.json()})
            .then(json=>{
                if(json.success) notifySuccess(json.message);
                else notifyError(json.message);
            })
        }
    }

    return(
        <div>
            <div className='outer-container'>
                    <div className='header'>
                        <p><img src={Logo} alt="" className='asteris-logo-login'/></p>
                        <img src = {UPLB} id="uplb-logo" alt="UPLB logo"/>
                        <div className='text-header'>
                            <p className="univ-name">UNIVERSITY OF THE PHILIPPINES LOS BAÑOS</p>
                            <p className="college-name">College of Arts and Sciences</p>
                            
                        </div>     
                    </div>

                <div className='reset-box'>
                    <p className='box-header'>Forgot password?</p>
                    <hr/>
                    <div className='email-box'>
                        <p> Please enter your email address to reset your password.</p> 
                        <input type='text' id='email-field' className='email-reset' placeholder='Enter your email address'/>
                        <button className='otp-button' onClick={fetchOTP}>Get OTP</button>
                    </div>
                    <hr/>
                    <div className='reset-pass-box'>
                        <div className='table-row'></div>
                        <div><b>New Password:</b><input type={type} id='newpassword-field' value={newPass} onChange={(e)=>setNewPass(e.target.value)} className='fields-reset1' placeholder='Enter new password'/><br/></div>
                        <i onClick={handleToggle} id = "visBtn" className='eyebtn'><Icon icon = {icon} ></Icon></i>
                        <div><b>Confirm Password:</b><input type={type1} id='confpassword-field' value={newConfPass} onChange={(e)=>setConfPass(e.target.value)} className='fields-reset2' placeholder='Confirm new password'/><br/></div>
                        <i onClick={handleToggle1} id = "visBtn" className='eyebtn'><Icon icon = {icon1} ></Icon></i>      
                        <p className='notice'> Please enter the OTP sent to your email. If you cannot see the email in your inbox, kindly check your spam folder.</p> 
                        <div><b>OTP:</b><input type='text' id='otp-field' value = {otp} onChange={(e)=>setOTP(e.target.value)} className='fields-reset3' placeholder='Enter OTP'/><br/></div>
                    </div>
                    <div className='reset-buttons'>
                        <button className='cancel-button' onClick={()=>{navigate('/')}}>Cancel</button>
                        {otpClicked? (<button className='sub-button' onClick={submitChange}>Reset Password</button>)
                        :((<button className='disabled-sub-button'>Reset Password</button>))
                        }
                    </div>   
                </div>
            </div>
            <ToastContainer className='toast-container'/>
            <Footer/>
        </div>
    )

}

export default ForgotPassword;