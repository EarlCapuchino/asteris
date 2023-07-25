import React, { useEffect, useState, useRef } from 'react';
import useStore from '../hooks/authHook';
import { useNavigate } from 'react-router-dom';
import {BsSearch}  from 'react-icons/bs';
import {AiFillPrinter} from 'react-icons/ai';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Menu from '../components/Menu'
import { useReactToPrint } from 'react-to-print';
import ComponentToPrint from '../components/ComponentToPrint'
import '../../css/view_summary.css'
import useLoadStore from '../hooks/loaderHook';	
import Row_Loader from '../loaders/Row_Loader';

const View_Summary =()=>{

const {REACT_APP_HOST_IP} = process.env
const [record, setRecord] = useState();
const navigate = useNavigate();     // hook for navigation
const [state, changeState]= useState('0');
const [orderValue, setOrderValue] = useState("");
const [viewValue, setViewValue] = useState("");
const prev_order_state = useRef();
const prev_view_state = useRef();
const { user,setAuth } = useStore();
const [fileName, setFileName] = useState();
const [message, setMessage] = useState("Loading students...")
const { isLoading, setIsLoading } = useLoadStore();	

const orderFilter = [
    {label: 'NAME', value:'name'},
    {label:'GWA',value:'gwa'}
]

const viewFilter = [
    {label:'ALL', value:'ALL'}, 
    {label:'BACA', value:'BACA'}, 
    {label:'BAPHLO', value:'BAPHLO'},
    {label:'BASOC', value:'BASOC'},
    {label:'BSAGCHEM', value:'BSAGCHEM'},
    {label:'BSAMAT', value:'BSAMAT'},
    {label:'BSAPHY', value:'BSAPHY'},
    {label:'BSBIO', value:'BSBIO'},
    {label:'BSCHEM', value:'BSCHEM'},
    {label:'BSCS', value:'BSCS'},
    {label:'BSMATH', value:'BSMATH'},
    {label:'BSMST', value:'BSMST'},
    {label:'BSSTAT', value:'BSSTAT'},
]

let input ;
prev_order_state.current = [orderValue];
prev_view_state.current = [viewValue];

// for printing
const componentRef = useRef();
const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: fileName,
});

//if state changes, this function is executed
useEffect(()=>{
    getDate();
    setRecord(undefined)
    setIsLoading(true)	
    fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/student/summary?orderby="+[orderValue],
    {
        method: "GET",
        credentials:'include'
    })
    .then(response => {
        return response.json()
    })
    .then(json=>{
        if (json.result.session.silentRefresh) {
            setAuth(json.result.session.user, json.result.session.silentRefresh)
        }
        if(json.result.success){
            setRecord(json.result.output)
        }else{
            setRecord(undefined)
            setTimeout(() => setIsLoading(false), 3000)
            setMessage(json.result.message)
        }
    })
    setTimeout(() => setIsLoading(false), 3000)
},[state]);

//if orderValue changes, this function is executed
useEffect(()=>{
    getDate();
    setRecord(undefined)
    setIsLoading(true)
    if(prev_order_state.current != [orderValue]){
        prev_order_state.current = [orderValue];
        if(viewValue === "ALL" || viewValue===""){
            setRecord(undefined)
            setMessage("Loading students...")
            fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/student/summary?orderby="+[orderValue],
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
                    setRecord(json.result.output)
                }else{
                    setRecord(undefined)
                }
            })
        }else{
            setRecord(undefined)
            setIsLoading(true)
            fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/student/summary/degree/"+ [viewValue]+"?orderby="+[orderValue],
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
                    setRecord(json.result.output)
                }else{
                    setRecord(undefined)
                }
            })
        }
    }
    setTimeout(() => setIsLoading(false), 3000)
},[orderValue]);

//if viewValue changes, this function is executed
useEffect(()=>{
    getDate();
    setIsLoading(true)	
    if(prev_view_state.current != [viewValue]){
        prev_view_state.current = [viewValue];
        if (viewValue==="ALL" || viewValue===""){
            setRecord(undefined)
            setMessage("Loading students...")
            fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/student/summary?orderby="+[orderValue],
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
                    setRecord(json.result.output)
                }else{
                    setRecord(undefined)
                    setMessage(json.result.message)
                }
            })
        } else{
            setRecord(undefined)
            setIsLoading(true)
            fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/student/summary/degree/"+ [viewValue],
            {
                method: "GET",
                credentials:'include'
            })
            .then(response =>{return response.json()})
            .then(json=>{
                if (json.result.session.silentRefresh) {
                    setAuth(json.result.session.user, json.result.session.silentRefresh)
                }
                if(json.result.success){
                    setRecord(json.result.output)
                }else{
                    setRecord(undefined)
                    setMessage(json.result.message)
                }
            })
        setTimeout(() => setIsLoading(false), 3000)}
    }
},[viewValue]);

const handleSubmit = (e) => {
    e.preventDefault();
    getDate();
    setIsLoading(true)	
    if(input === "" || input===undefined){
            setRecord(undefined)
            setMessage("Loading results...")
            fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/student/summary?orderby="+[orderValue],
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
                setRecord(json.result.output)
            }else{
                setRecord(undefined)
                setMessage(json.result.message)
            }
        })
    } else {
        setRecord(undefined)
        setIsLoading(true)
    fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/student/summary/search?name=' +input+'&&orderby='+orderValue,{
        credentials:'include'
    })
    .then((response) => {return response.json()})
    .then(json => {
        if (json.result.session.silentRefresh) {
            setAuth(json.result.session.user, json.result.session.silentRefresh)
        }
        if(json.result.success){
            setRecord(json.result.output);
        }
        else{
            setRecord(undefined)
            setMessage(json.result.message)
        }
    })
    setTimeout(() => setIsLoading(false), 3000)
    }	
}

const getDate=()=>{
    var today = new Date();
    let day = today.getDate();
    let month = today.getMonth();
    let year = today.getFullYear();
    let time =  today.toLocaleString('en-US', {hour: 'numeric', hour12:true, minute: 'numeric'})
    let date = year + "_" + (month+1) + "_" + day + "_" + time 
    setFileName("CAS_graduating_students"+"("+date+")")
}

const orderChange=(e)=>{
    setOrderValue(e.target.value);
}

const viewChange=(e)=>{
    setViewValue(e.target.value);
}

const handleUserInput = (e) => {
    input = e.target.value;
    if (viewValue!=="ALL" || viewValue!==""){
        setViewValue("ALL")
    }        
}

const DropDown =({value,options,onChange, type})=>{
    return(
        <label>
            <select className='summary-dropdown' value={value} onChange={onChange}>
                { type==="view"?  <option value = "" disabled hidden>VIEW BY</option>: <option value = "" disabled hidden>ORDER BY</option> }
                {options.map((option,i)=>(
                    <option key={i} value = {option.value}>{option.label}</option>
                ))}
            </select>
        </label>
    );
}
    return(
    <div>
        <div className='view-summary-body'>
        
        <p className='title'> Summary of Graduating Students {record?<span> {record.length}</span>:""}</p>
        <hr className='view-summary-line'/>
            <div className='view-summary-header'>
                
            <i className="print-button" onClick={handlePrint}><AiFillPrinter/></i>
                <ul className="view-summary-list">
                
                    <li><DropDown options={orderFilter} value = {orderValue} onChange={orderChange} type={"order"}/></li>
                    <li><DropDown options={viewFilter} value = {viewValue} onChange={viewChange} type={"view"}/></li>
                </ul>
                            

            </div>    

            <div className="view-summary-search">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                <input type = "text" className = "view-summary-input" placeholder = "&#xf002;   Search by Name"
                value = {input} onChange = {handleUserInput} required></input>
                <a onClick={handleSubmit}><BsSearch className='view-summary-sicon'/></a>  
            </div>

            <div className='view-summary-preview'>
                {isLoading || record != undefined ? 	
                    <div className='table-wrap'>	
                        <table className='view-summary-table'>	
                            <thead className='view-summary-thead'>	
                                {	
                                    isLoading ? <></> :
                                    <tr className='header-row'>
                                        <th className='summary-header' style={{textAlign:'left', paddingLeft:'20px'}}>NAME</th>
                                        <th className='summary-header'>DEGREE PROGRAM</th>
                                        <th className='summary-header'>GWA</th>
                                        <th className='summary-header'>LATIN HONOR</th>
                                    </tr>
                                }
                        </thead>
                        <tbody className = 'view-summary-tbody'>
                            {
                                // Display Loader	
                                isLoading ? <Row_Loader type='STUDENTS_LIST' /> :	
                                // Display Data
                                record.map((rec, i) => {
                                    return (
                                        <tr className='view-summary-element' key = {i}>
                                            <td className='view-summary-cell' onClick={()=> navigate('/student/'+rec.student_id)} style={{textAlign:'left', paddingLeft:'20px'}}>{rec.last_name}, {rec.first_name}{rec.middle_name? ', '+rec.middle_name:""}
                                            {rec.suffix ? ', ' + rec.suffix : ''}</td>
                                            <td className='view-summary-cell' onClick={()=> navigate('/student/'+rec.student_id)} >{rec.degree_program}</td>
                                            <td className='view-summary-cell' onClick={()=> navigate('/student/'+rec.student_id)} >{rec.gwa}</td>
                                            <td className='view-summary-cell' onClick={()=> navigate('/student/'+rec.student_id)} >{rec.latin_honor}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table></div>: (<div className='empty-students'>
                <p>{message}</p>
                </div>)}
            </div>
            <div style={{display:"none"}}><ComponentToPrint user = {user} record={record} documentTitle={fileName} ref={componentRef} order = {orderValue} view = {viewValue} message = {message}/></div> 
        </div>
        <Header/>
        <Menu/>
        <Footer/>
    </div>
    );
}

export default View_Summary;