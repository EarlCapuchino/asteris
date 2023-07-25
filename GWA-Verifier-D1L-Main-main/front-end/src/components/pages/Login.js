import { useNavigate } from 'react-router-dom';
import useStore from '../hooks/authHook';
import UPLB from '../../images/uplb.png';
import Logo from '../../images/asteris-logo.webp'
import Footer from '../components/Footer';
import { ToastContainer } from 'react-toastify';
import { notifyError } from '../components/Popups/toastNotifUtil';
import '../../css/login.css';
import '../../css/toast_container.css';
import { Icon } from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye';
import { useState } from 'react';
import { useEffect } from 'react';


// changed to function to use hooks
const Login = () => {

    const {REACT_APP_HOST_IP} = process.env

    const { user, isAuthenticated, setAuth } = useStore();     // from zustand store
    const navigate = useNavigate();     // hook for navigation

    //checks if user is already logged in
    useEffect(()=>{
        if (!user && !isAuthenticated) {

            fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/auth/refresh',
              { method: 'GET', credentials: 'include' }
            )
            .then(res => res.json() )
            .then(body => {
              if (body.success) {
                setAuth(body.user, body.success)
                navigate('/home')
            }
              else {
                navigate('/');
              }
            })
          }
    },[])

    // handles login action and 
    const login = (e) => {
        e.preventDefault();
        const credentials = {
            username: document.getElementById('login-username').value,
            password: document.getElementById('login-password').value,
        }
       
        const password_format = /^(?=.*[-_.!"'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/
        const username_format = /^[A-Za-z]\w*$/
        if(!credentials.username.match(username_format)){
            notifyError("username must start with a letter")
        }else if(!credentials.password.match(password_format)){
            notifyError("password must be at least 8 characters and contains at least 1 upper-case letter, 1 lower-case letter, and a special character");
        }else{
            fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/auth' ,{
                method:'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( credentials )
            }
        )
        .then(response => response.json())
        .then(body => {
            if(!body.success) notifyError(body.message);
            else{
                setAuth(body.user, body.success);
                navigate('/home');
            }
        })
        }
    }

    const [type, setType] = useState('password')
    const [icon, setIcon] = useState(eyeOff)

    const handleToggle = () => {
        if(type === 'text'){
            setIcon(eyeOff);
            setType('password');
        } else {
            setIcon(eye);
            setType('text');
        }
    }

    return(
        <div>
            <div className='login-body'>
                <div className='header'>
                <p><img src={Logo} alt="" className='asteris-logo-login'/></p>
                    <img src = {UPLB} id="uplb-logo" alt="UPLB logo"/>
                    <div className='text-header'>
                        <p className="univ-name">UNIVERSITY OF THE PHILIPPINES LOS BAÑOS</p>
                        <p className="college-name">College of Arts and Sciences</p>
                        
                    </div>     
                </div>
                <div>
                    <form className='login-form'>
                        <h2>User Login</h2>
                        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                        <input type='text' className= "form-field" id='login-username' placeholder='&#xf007;  Username'/><br/>
                        <input type={type}className= "form-field" id='login-password' placeholder='&#xf023;  Password'/>
                        <i onClick={handleToggle} id = "visibilityBtn" className='eyeLogin'><Icon icon = {icon} ></Icon></i>

                        {/* Submit */}
                        <input type="submit" value="LOG IN" className='submit-btn' onClick={login}/><br/>
                        <div className='forgot-password-cont' ><a className='forgot-password' href={'/user/identify'}>Forgot Password?</a></div>
                    </form><br/>
                </div>
                
            </div>
            <ToastContainer className={'toast-container'}/>
            <Footer />
        </div> 
    )
}

export default Login;