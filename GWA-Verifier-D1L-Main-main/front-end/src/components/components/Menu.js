import React, { useState, useRef } from 'react';
import { FaBars } from 'react-icons/fa';
import  { AiOutlineClose, AiFillHome } from 'react-icons/ai'
import { IconContext } from 'react-icons/lib';
import { Link, useNavigate } from 'react-router-dom';
import { SidebarDataUser, SidebarDataStudent } from './menu_components/SidebarData';
import useStore from '../hooks/authHook'
import OutsideClick from '../hooks/outsideClick'
import '../../css/menu.css'

class Menu extends React.Component{
    render(){
        
        return(
            <div>
                <Home />
                <Menubar />
            </div>
            
        );
    }
}

function Home(){
    const navigate = useNavigate();
    const navHome=()=>{
        navigate("/home");
    }
    return(
        <div className="home-bar">
            <i className='home-icon' onClick={navHome}><AiFillHome/></i>
            <div className='home-name'>Home</div>
        </div>
        
    )
}
function Menubar(){
    const [ sidebar, setSidebar ] = useState(false)
    const { user } = useStore();
    const user_title = user.user_role

    const showSidebar = () => setSidebar(!sidebar);
    const boxRef = useRef(null);
    OutsideClick(boxRef,() => {
        {sidebar? showSidebar():""};
    });
 

    return(
        <IconContext.Provider value={{ color: 'black' }}>
            <div className='menu-navbar'>
                <Link to='#' className='menu-bars'>
                    <FaBars className='menu-icon' onClick={showSidebar}/>
                </Link>
                <div className="menu-name">Menu</div>
            </div>
            <nav className={sidebar ? 'menu-side active' : 'menu-side'} ref={boxRef}>
                <ul key = {1}>
                    <li className={'menu-navbar-toggle'}>
                        <Link to='#' className={'menu-bars'}>
                            <AiOutlineClose className={'menu-icon'} onClick={showSidebar}/>
                        </Link>
                    </li>
                    <br />
                    <div className='entity-title'>Student</div>
                    { SidebarDataStudent.map((item, index) => {
                        return(
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span className={'menu-span'}>{item.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                    <br /> <br />
                    {user && user.user_role == "CHAIR/HEAD"? 
                    (<div><div className='entity-title'>User</div>
                    {SidebarDataUser.map((item, index) => {
                        return(
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span className={'menu-span'}>{item.title}</span>
                                </Link>
                            </li>
                        );
                    })}</div>) : ""}              
                </ul>
            </nav>
        </IconContext.Provider>
    );
}
export default Menu;