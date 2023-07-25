/**
    Source code description: This source code contains functions that allows the administrator to 
    search, view, and delete a user
*/

 import React, { useEffect, useState, useRef } from 'react';
 import Menu from '../components/Menu'
 import Header from '../components/Header';
 import Footer from '../components/Footer';
 import useStore from '../hooks/authHook'
 import { useNavigate } from 'react-router-dom';
 import {BsSearch}  from 'react-icons/bs';
 import DeleteConfirmPopup from '../components/Popups/DeleteConfirmPopup';
 import '../../css/view_users.css'
 import { ToastContainer } from 'react-toastify';
 import { notifyError, notifySuccess } from '../components/Popups/toastNotifUtil';
 import '../../css/toast_container.css';
 import useLoadStore from '../hooks/loaderHook';
import Users_Loader from '../loaders/Users_Loader';

 export default function View_Users_Page (){
    const {REACT_APP_HOST_IP} = process.env
    const [users, setUsers] = useState([]);
    const [input,setInput] = useState("")
    const [pageState, setPage] = useState('0');
    const [viewValue, setViewValue] = useState("");
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [toDelete, setToDelete] = useState("")

    const { user, setAuth } = useStore();
    const { isLoading, setIsLoading } = useLoadStore();

    const navigate = useNavigate();     // navigation hook
    const prev_view_state = useRef();

    const viewFilter = [
        {label:'ALL', value:'ALL'}, 
        {label:'OCS REP', value:'OCS REP'}, 
        {label:'ACS', value:'ACS'},
        {label:'UNIT REP', value:'UNIT REP'},
        {label:'MEMBER', value:'MEMBER'},
    ]

    prev_view_state.current = [viewValue];
 
    //checks if the user is an administrator
    useEffect(() =>{
        if(user.user_role==="CHAIR/HEAD"){
            setIsLoading(true);
            fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/user",
            {
                method: "GET",
                credentials:'include'
            })
            .then(response => {return response.json()})
            .then(json=>{
                setUsers(json.result.output)
                if(json.result.session){
                    setAuth(user,json.result.session)
                }            
            })
            setTimeout(() => setIsLoading(false), 3000)
        }else{
            navigate("/home")
            notifyError("Must be an admin to access this page")
        }
     },[pageState]);

     /*
        if viewValue changes, this function is executed to output users who matches the filter value 
        given by the view value dropdown
     */
    useEffect(()=>{
        setIsLoading(true);
        if(prev_view_state.current != [viewValue]){
            prev_view_state.current = [viewValue];
            if (viewValue==="ALL"||viewValue===""){
                fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/user",
                {
                    method: "GET",
                    credentials:'include'
                })
                .then(response => {return response.json()})
                .then(json=>{
                    if (json.result.session.silentRefresh) {
                        setAuth(json.result.session.user, json.result.session.silentRefresh)
                    }
                    if(json.result.success){
                        setUsers(json.result.output)
                    }else{
                        setUsers(undefined)
                    }
                })
            } else {
                fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/user/role/"+ [viewValue],
                {
                    method: "GET",
                    credentials:'include'
                })
                .then(response => {return response.json()})
                .then(json=>{
                    if (json.result.session.silentRefresh) {
                        setAuth(json.result.session.user, json.result.session.silentRefresh)
                    }
                    if(json.result.success){
                        setUsers(json.result.output)
                    
                    }else{
                        setUsers(undefined)
                    }
                })
            }
        }
        setTimeout(() => setIsLoading(false), 3000)
    },[viewValue]);
 
    //handles the search bar input
     const handleUserInput = (e) => {
         const value = e.target.value;
         setInput(value);
            if (viewValue!=="ALL" || viewValue!==""){
            setViewValue("ALL")
        }
     }
 
    //called upon when the admin searches for a specific user 
    const handleSubmit = (e) => {
        e.preventDefault();
    
        let url = 'http:'+REACT_APP_HOST_IP+':3001/api/0.1/user/search?name=';

        setIsLoading(true);
        //if a specific role is selected, url changes to view users by role
        if(viewValue === "OCS REP" || viewValue === "ACS" || viewValue === "UNIT REP" || viewValue === "MEMBER"){
            url = 'http://'+REACT_APP_HOST_IP+':3001/api/0.1/user/role/' + viewValue + '/search?name='
        }else{ //default search
            url = 'http://'+REACT_APP_HOST_IP+':3001/api/0.1/user/search?name='
        }

        //if search input is empty, check if a user role is selected, else do the default search
        if(input === "" || input === undefined){
            let url_role;

            if( viewValue === "OCS REP" || viewValue === "ACS" || viewValue === "UNIT REP" || viewValue === "MEMBER"){
                url_role = 'http://'+REACT_APP_HOST_IP+':3001/api/0.1/user/role/' + viewValue
            }else{
                url_role = 'http://'+REACT_APP_HOST_IP+':3001/api/0.1/user'
            }
    
            fetch(url_role,{
                method: "GET",
                credentials:'include'
            })
            .then(response => {return response.json()})
            .then(json=>{
                if(json.result.success){
                    setUsers(json.result.output)
                }else{
                    notifyError(json.result.message)
                }
            })
        } else {
            fetch(url + [input],{
                credentials:'include'
            })
            .then((response) => {return response.json()})
            .then(json => {
                if(json.result.success){
                    // Contains the list of match users
                    setUsers(json.result.output);
                }
                else{
                    notifyError(json.result.message) // Message: No results found
                }
            })
        }
        setTimeout(() => setIsLoading(false), 3000)
    }

    //handles changes in viewby dropdown
    const viewChange=(e)=>{
        setViewValue(e.target.value);
    }

    // called when the admin chooses to delete a user
    const onDelete=(todeluser)=>{
        setShowDeleteConfirmation(true);
        setToDelete(todeluser);
    }

    /*
        a function that is called upon when the admin wants to delete a user. This function accepts a 
        boolean function containing the decision of a user to proceed with deletion , and the details of
        deletion if a user proceeds to deleting the user
    */
    const confirmDelete = async(decision,details) => {
        setIsLoading(true);
        setShowDeleteConfirmation(false)
        if(decision){
            let delete_id = toDelete.user.user_id
            fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/user/'+ delete_id+'/'+user.user_id,{
                method: "DELETE",
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    details
                })
            }).then(response =>{ return response.json()})
            .then(json=>{
   
               if(json.result.success){
                    notifySuccess(json.result.message)
                    setPage(!pageState)            
               }
            })
        }
        setTimeout(() => setIsLoading(false), 3000)
     }
 
    /*
        a dropdown creator that accepts a string value it contains, an array of strings which are the options
        to chooes from, and the function that handles the changing of values upon user selection
    */
    const DropDown =({value,options,onChange})=>{
        return(
            <label>
                <select className='view-user-dropdown' value={value} onChange={onChange}>
                    {<option className='option' value = "" disabled hidden>VIEW BY</option>}
                    {options.map((option,i)=>(
                        <option key={i} value = {option.value}>{option.label}</option>
                    ))}
                </select>
            </label>
        );
    }

        return(
            <div>
                <div className="view-users-body">
                    <div className='top-header'>
                        <p className="title"> Accounts{users?<span> {users.length}</span>:""}</p>  
                        <hr className='users-line'/>
                        <ul className='view-user-header'>
                            <li><DropDown options={viewFilter} value = {viewValue} onChange={viewChange}/></li>
                        </ul>
                        
                        
                        <div className="users-search-field">
                            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                            <input type = "text" name = "input" placeholder = "&#xf002;  Search by name"
                            value = {input} onChange = {handleUserInput} className = "user-search" required></input>
                            <button onClick={handleSubmit} className = "users-search-button"><i className = "search-icon"><BsSearch /></i></button>
                        </div>
                    </div>
               
                    <div className='tile-page'>
                        {
                            // Display Loader
                            isLoading ? <Users_Loader /> : users != undefined? users.map((user, i) => {
                                if (i % 2 === 0) {
                                    return <span key={i}>
                                        <div className="user-tile" >
                                        {!user.display_picture?
                                            (<img src = {require(`../../images/user_dp/dp_default.jpg`)} className='user-dp' onClick={()=> navigate('/user/'+user.user_id)}/>):
                                            (<img src = {require(`../../images/user_dp/${user.display_picture}`)} className='user-dp' onClick={()=> navigate('/user/'+user.user_id)}/>)
                                        }
                                        <div className='user-name' onClick={()=> navigate('/user/'+user.user_id)}>
                                            {user.first_name} {user.last_name} <br />
                                            <span onClick={()=> navigate('/user/'+user.user_id)}>{user.user_role}</span>
                                        </div>
                                            <button onClick={()=>{onDelete({user})}} className = "delete-button">Remove</button></div>
                                    </span>
                                } else {
                                    return <span key={i}>
                                        <div className="user-odd-tile" >
                                        {!user.display_picture?
                                            (<img src = {require(`../../images/user_dp/dp_default.jpg`)} className='user-dp' onClick={()=> navigate('/user/'+user.user_id)}/>):
                                            (<img src = {require(`../../images/user_dp/${user.display_picture}`)} className='user-dp' onClick={()=> navigate('/user/'+user.user_id)}/>)
                                        }
                                        <div className='user-name' onClick={()=> navigate('/user/'+user.user_id)}>
                                            {user.first_name} {user.last_name} <br />
                                            <span onClick={()=> navigate('/user/'+user.user_id)}>{user.user_role}</span >
                                        </div>
                                        <button onClick={()=>{onDelete({user})}} className = "delete-button">Remove</button>
                                        </div>
                                    </span>
                                }
                        }): <div className="no-users">
                        <p>No users found.</p>
                        <button onClick={()=> navigate('/users/new')}> Add User Account</button>
                    </div>}
                </div>
                {showDeleteConfirmation===true? <DeleteConfirmPopup props={{confirmDelete: confirmDelete.bind()}} />:""}</div>
            <Header />
            <Menu/>
            <ToastContainer className='toast-container'/>
            <Footer/>
        </div> 
    )
 }