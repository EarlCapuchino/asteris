import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Dp from '../../images/dp_default.jpg';
import Logo from '../../images/asteris-logo.webp';
import useStore from '../hooks/authHook';
import '../../css/header.css'
import OutsideClick from '../hooks/outsideClick'

const Header =()=>{

    const[userType, setType]=useState();
    const navigate = useNavigate();     // hook for navigation
    const {user, host, setAuth} = useStore();
    const [open, setOpen] = useState(false);
    const boxRef = useRef(null);

    // function for closing the drop down menu when the parts of the page is clicked   
    OutsideClick(boxRef,() => {
        {open? setOpen(false):""};
    });

    // function for logging out the current user
    const userLogout=()=>{ 
        
        // finds the information of the currently logged in user 
        fetch('http://'+host+':3001/api/0.1/auth' ,{
            method:'GET',
            credentials:'include'
        })
        .then(response => response.json())
        .then(body => {
            // if there is an error in logging out, the user will be prompted of the error
            if(!body.success) alert(body.message);
            // if log out is success, the user will be prompted and will be redirected to the login page
            else{
                navigate('/');
                setTimeout(() => {
                    setAuth(null, false);
                }, 500);
            }
        })
    }

    // function for the drop down menu
    function Dropdown(props){
        return(
            <span>
                {/*drop down menu will open on click of the drop down arrow */}
                <a onClick={() => setOpen(!open)}>
                    <svg width="24" height="19" className={'header-caret'}>
                        <path d = "M 6 2 L 14 2 M 10 8 L 14 2 L 6 2"></path>
                    </svg>
                </a>
                {open && props.children}
            </span>
        );
    }

    // sets the first name of the user as the userType to be displayed in the header
    useEffect(()=>{
        setType(user.first_name)
    },[userType])
    

    return(
        // header elements
        <div className='header-main'>
        <div className='green-shape'></div>
        <div className='yellow-shape'></div>
        {/* clicking the logo in the header will redirect the user to the home page */}
        <h1 className='header-name' onClick={()=> window.location.href='/home'}><img src={Logo} alt="" className='asteris-logo'/></h1>
        <div className='header-right'>
            {/* displays the name of the current user */}
            <span className='header-user'>{ userType }</span>
            {/* displays the user icon */}
            {user.display_picture? (<img src = {require(`../../images/user_dp/${user.display_picture}`)} className={'header-dp'}/>):
            ( <img src = {Dp} className={'header-dp'}/>)
            }
            {/* dropdown menu */}
            <Dropdown>
                <div className={'header-dropdown'} ref={boxRef}>
                    <Link to = '/profile' className={'header-dropitem'}>    {/* links to the profile page of the user */}
                        Profile
                    </Link>
                    <div onClick= {userLogout} className={'header-dropitem'}>   {/* logs out the current user and redirects to the log in page */}
                        Logout
                    </div>
                </div>
            </Dropdown>
        </div>
        
    </div>
    )

}
    

export default Header;
