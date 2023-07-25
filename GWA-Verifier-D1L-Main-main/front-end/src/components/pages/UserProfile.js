import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Menu from '../components/Menu'
import useStore from '../hooks/authHook'
import useLoadStore from '../hooks/loaderHook'
import USER from '../../images/dp_default.jpg'
import {HiMail}  from 'react-icons/hi';
import {RiPhoneFill}  from 'react-icons/ri';
import {BiArrowBack} from 'react-icons/bi'
import '../../css/toast_container.css';
import { notifyError } from '../components/Popups/toastNotifUtil';
import { ToastContainer } from 'react-toastify';
import Row_Loader from '../loaders/Row_Loader';
import { Name_Placeholder, User_Detail_Placeholder } from '../loaders/Detail_Loader';
import '../../css/profile.css'

const UserProfile =()=>{

    const {REACT_APP_HOST_IP} = process.env
    const { user, setAuth } = useStore();
    const { isLoading, setIsLoading} = useLoadStore();
    const navigate = useNavigate();     // navigation hook
    const [students, setStudents] = useState([]);
    const [user_profile, setUserProfile] = useState('')
    const [user_logs, setUserLogs] = useState([])
    const [emptyLogs, setEmptyMessage] = useState("Loading logs...");
    const [pageState, setPage] = useState(false)
    const link = window.location.href
    const id = link.slice(link.lastIndexOf('/')+1,link.length)
    
    useEffect(()=>{
        if(user.user_role==="CHAIR/HEAD"){
            setIsLoading(true);
            fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/user/"+ id,
            {
                method: "GET",
                credentials:'include'
            })
            .then(response => {return response.json()})
            .then(json=>{
                setUserProfile(json.result.output)
                if(json.result.session){
                    setAuth(user,json.result.session)
                }            
            })
            fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/student/all",
            {
                method: "GET",
                credentials:'include'
            })
            .then(response => {return response.json()})
            .then(json=>{
                setStudents(json.result.output) 
                setPage(!pageState)  
                setTimeout(() => setIsLoading(false), 3000)
            })
        } else{
            navigate("/home")
            notifyError("Must be an admin to access this page")
        }
    },[user])


    useEffect(()=>{
        setIsLoading(true);
        fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/log/user/"+ id,
            {
                method: "GET",
                credentials:'include'
            })
            .then(response => {return response.json()})
            .then(json=>{
                // if (json.result.session.silentRefresh) {
                //     setAuth(json.result.session.user, json.result.session.silentRefresh)
                // }
                if(json.result.success){
                    formatLogs(json.result.output)    
                }
                else{
                    formatLogs(undefined)
                    setEmptyMessage("No logs to display for this user")    
                }
                 
            })
            setTimeout(() => setIsLoading(false), 3000)
        },[pageState])

    const formatLogs = (logs) => {
        if(logs && students && students.length > 0){
            for (let i = 0; i < logs.length; i++) {
                for (let j = 0; j < students.length; j++) {
                    if(logs[i].subject_entity==="Student" && logs[i].subject_id === students[j].student_id){ 
                        logs[i]['subject_name'] = students[j].first_name +" "+ students[j].last_name
                        break
                    }
                }
            }
            setUserLogs(logs)
        }
        else{
            setUserLogs(undefined)
            setEmptyMessage("Loading logs...")
        }
    }



    return(
        <div>
            <div className='body'>
            <div className='user-header'>
            { !user_profile.isDeleted?
            <i className = "user-back-icon" onClick={()=> navigate('/users')} style={{top:"20px",left:"20%"}}><BiArrowBack size= {35} /></i>
            : <div className='deleted-user-watermark'>DELETED USER ACCOUNT</div>   
            }
                {/* 
                    Note: Used the default photo as the avatar while loading
                    Replace the img src in the else clause with the image photo URL
                */}
                { isLoading ? <img src = {USER} className = "user-photo" /> : user_profile.display_picture? 
                    ( <img src = {require(`../../images/user_dp/${user_profile.display_picture}`)} className = "user-photo" />):	
                    (<img src = {USER} className = "user-photo"/>)}
                <p className='profile-title'>
                    { isLoading ? <Name_Placeholder /> : `${user_profile.first_name} ${user_profile.last_name}` }
                </p>
                <p className='username'>
                    { isLoading ? <User_Detail_Placeholder width='120px' height='26px' /> : user_profile.username}
                </p>
                <p className='user-role'>
                    { isLoading ? <User_Detail_Placeholder width='100%' height='20px' /> : user_profile.user_role}
                </p>
                <ul className='contact-info'>
                    <li><HiMail size={28} className="contact-icon"/><span>
                        { isLoading ? <User_Detail_Placeholder width='200px' height='26px' /> : user_profile.email}
                    </span></li>
                    { isLoading ? <></> : user_profile.phone_number ? <li style = {{paddingTop:'0px'}}><RiPhoneFill size={28} className="contact-icon"/><span>{user_profile.phone_number}</span></li>:""}
                </ul>
                
            </div>
            <br />
            <hr className='profile-line' />
            <p className='user-logs-title'>USER LOGS</p>
            <div className ='view-log-preview' style = {{width: '60%',
                    marginLeft:'20%',
                    height: '40%',}}>
                    {isLoading ? <Row_Loader type='USER_LOGS' /> :
                    user_logs !== undefined ? 
                    <div className='table-wrap'>
                        <table className='view-log-table'>
                        <thead className='view-log-thead'>
                            <tr className='header-row'>
                                <th className='log-header' >DATE TIME</th>
                                <th className='log-header' >ACTIVITY</th>
                                <th className='log-header' >SUBJECT</th>
                                <th className='log-header' >DETAILS</th>
                            </tr>
                        </thead>
                        <tbody className = 'view-log-tbody'>
                                
                                {user_logs.map((log, i)=>{
                                var time_stamp = log.time_stamp.split(" ")
                                return (
                                <tr className='view-log-element' key={i}>
                                <td className='log-cell' >{time_stamp[0]}<br /> {time_stamp[1]}</td>
                                <td className='log-cell' >{log.activity_type}</td>
                                { log.subject_entity === "User"? <td className='subject-cell' onClick ={()=>{navigate('/user/'+log.subject_id)}}>  <span>{log.subject_entity}</span></td>
                                : log.subject_entity === "Student"? <td className='subject-cell' onClick ={()=>{navigate('/student/'+log.subject_id)}}>  <span>{log.subject_name}</span></td>
                                :
                                <td className='subject-cell'>-</td>}
                                <td className='log-cell' > {log.details!==null? log.details:"-"}</td>
                               
                                </tr>)
                                })}
                            </tbody>
                        </table>
                    </div>
                    : <div className='no-logs'>{emptyLogs}</div>}
                    </div> 
            </div>
            <Header/>
            <Menu/>
            <ToastContainer className='toast-container'/>
            <Footer/>
        </div>
    )
}

export default UserProfile;