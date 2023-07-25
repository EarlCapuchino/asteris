/*
    Source code description: This soure code contains functions that allows the user to view, search, and delete
    a student's file
*/
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {BsSearch}  from 'react-icons/bs';
import {AiFillDelete} from 'react-icons/ai';
import useStore from '../hooks/authHook'
import useLoadStore from '../hooks/loaderHook';
import '../../css/view_students.css'
import Header from '../components/Header';
import Footer from '../components/Footer';
import Menu from '../components/Menu';
import DeletePopup from '../components/Popups/DeletePopup';
import DeletedPrompt from '../components/Popups/MultipleDeletionPopup'
import { ToastContainer } from 'react-toastify';
import { notifyError, notifySuccess } from '../components/Popups/toastNotifUtil';
import { RiAlertLine } from 'react-icons/ri'
import Row_Loader from '../loaders/Row_Loader';
import '../../css/toast_container.css';

const View_Students =()=>{

    const {REACT_APP_HOST_IP} = process.env
    const [record, setRecord] = useState();
    const [state, changeState]= useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [viewValue, setViewValue] = useState("");
    const [checkedState, setCheckedState] = useState([]);
    const [studentsToDel, setStudentsDel] = useState([]); //array of students to be deleted
    const [showConfirmation, setShowConfirmation] = useState("") //confirmation popup for deleting a single student
    const [showConfirmationMany, setShowConfirmationMany] = useState("") //confirmation popup for deleting many students
    const [toDelete, setToDelete] = useState("")
    const [message, setMessage] = useState("Loading students...")
    const [selectedValue, setSelectVal] = useState(false);
    const [deleted_students, setDeletedStudents] = useState([]);
    const [showPrompts, setShowPrompts] = useState(false);
    const prev_view_state = useRef();
    
    let input ;

    const searchFilter = [
        {label: 'NAME', value:'name'},
        {label:'STUDENT NUMBER',value:'student_number'}
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

    prev_view_state.current = [viewValue];

    const { user, setAuth } = useStore();
    const { isLoading, setIsLoading } = useLoadStore();

    const navigate = useNavigate();     // navigation hook


    //if state changes, this function is executed which shows the list of existing students
    useEffect(()=>{
        setRecord([])
        setIsLoading(true)
        fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/student?orderby="+"",
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
        setTimeout(() => setIsLoading(false), 3000)
    },[state]);

    /**
        if student files exist/ are updated, this function is called to create an array of checkboxes 
        with the record length
     */
    useEffect(()=>{
        if(record === undefined){""}
        else setCheckedState(new Array(record.length).fill(false))
    }, [record])

    //handles checking of checkbox
    const handleCheckChange=async(position)=>{
        let updatedCheckedState = [];
        checkedState.map((item, index)=>{
            index === position ? item === true? updatedCheckedState.push(false): updatedCheckedState.push(true): updatedCheckedState.push(item)
        })
        //updates checkboxes if they are checked or not
        setCheckedState(updatedCheckedState);

        //will contain students to be deleted
        let students = []

        updatedCheckedState.map((item,index)=>{
            {
                if(item == true){

                    students.push(record[index].student_id)
                }
            }
        })

        setStudentsDel(students);
    }

    /*
        if viewValue changes, this function is executed wherein students with degree programs matching the
        selected view by value will be shown
    */
    useEffect(()=>{
        setIsLoading(true)
        if(prev_view_state.current != [viewValue]){
            prev_view_state.current = [viewValue];
            if (viewValue==="ALL" || viewValue===""){
                setRecord(undefined)
                fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/student?orderby="+"",
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
                fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/student/degree/"+ [viewValue]+"?orderby="+"",
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
            }
        }
        setTimeout(() => setIsLoading(false), 3000)
    },[viewValue]);


    /**
        function that handles the search functionality upon clicking search button, which also
        checks first if the searchValue and viewValue are not in their default states  
    */
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true)

        let input = document.getElementById('input').value;
        let url;

        if(viewValue === 'ALL' || viewValue === '') url = 'http://'+REACT_APP_HOST_IP+':3001/api/0.1/student/search?name='+input;
        else {
            url = 'http://'+REACT_APP_HOST_IP+':3001/api/0.1/student/degree/'+[viewValue]+'/search?name='+input;
        }

        if(searchValue === "student_number"){
            url = 'http://'+REACT_APP_HOST_IP+':3001/api/0.1/student/search?student_number='+input;
            if(viewValue !== 'ALL' && viewValue !== "") url = 'http://'+REACT_APP_HOST_IP+':3001/api/0.1/student/degree/'+[viewValue]+'/search?student_number='+input;
        }

        if(input === "" || input === undefined){
            setIsLoading(true)
            if (viewValue==="ALL" || viewValue===""){
                setRecord(undefined)
                fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/student?",
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
                fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/student/degree/"+ [viewValue],
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
            }
        } else {
            setRecord(undefined)
            setIsLoading(true)
            fetch(url,{
                credentials:'include'
            })
            .then((response) => {return response.json()})
            .then(json => {
                if (json.result.session.silentRefresh) {
                    setAuth(json.result.session.user, json.result.session.silentRefresh)
                }
                if(json.result.success){
                    // Contains the list of match users
                    if(searchValue === "student_number"){
                        setRecord([json.result.output]);
                    }else{
                        setRecord(json.result.output);
                    }
                }
                else{
                    setMessage(json.result.message)
                }
            })}
        setTimeout(() => setIsLoading(false), 3000)
    }

    const selectChange=async()=>{
        await setSelectVal(!selectedValue)
    }

    //updates the checkbox and students to be deleted whenever the selectedValue changes
    useEffect(()=>{
        let updatedCheckedState = [];

        if(selectedValue===true){
            checkedState.map((item, index)=>{
                updatedCheckedState.push(true)
            })
        }else{
            checkedState.map((item, index)=>{
                updatedCheckedState.push(false)
            })
        }

        setCheckedState(updatedCheckedState);

        let students = []

        updatedCheckedState.map((item,index)=>{
            {
                if(item == true){
                    students.push(record[index].student_id)
                }
            }
        })

        setStudentsDel(students);
    },[selectedValue])

    //monitors the change in viewValue
    const viewChange=(e)=>{
        setViewValue(e.target.value);
    }

    //monitors the value of input field onChange
    const handleUserInput = (e) => {
        input = e.target.value;
    }

    //function that fetches delete API upon confirmation, deleteing only a single student record
    const confirmDelete= async(decision, reason) =>{
        setShowConfirmation(false)
        setIsLoading(true)

        if(decision){
            const student = toDelete.student_id
            setIsLoading(true)
            await fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/student/'+student+'/'+user.user_id,{
                method: "DELETE",
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    details: reason,
                    user_id: user.user_id,
                }) 
            }).then(response =>{ return response.json()})
            .then(json=>{
                if (json.result.session.silentRefresh) {
                    setAuth(json.result.session.user, json.result.session.silentRefresh)
                }
                if(json.result.success){
                    notifySuccess(json.result.message)
                    changeState(!state)
                }
            })
        }
        setTimeout(() => setIsLoading(false), 3000)
    }

    //a function to call on the delete API that handles multiple deletion
    const confirmDeleteMany= async(decision, reason) =>{
        setShowConfirmationMany(false)
        setIsLoading(true)
        if(decision){
            await fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/student/delete/'+user.user_id,{
                method: "DELETE",
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    details: reason,
                    students_to_delete: studentsToDel,
                }) 
            }).then(response =>{ return response.json()})
            .then(json=>{
                if (json.result.session.silentRefresh) {
                    setAuth(json.result.session.user, json.result.session.silentRefresh)
                }
                if(json.result.success){
                    setDeletedStudents(json.result.output)
                }else{
                    notifyError(json.result.message)
                }
                
                changeState(!state)
                setShowPrompts(true);
            })
        }
        if(selectedValue===true){
            setRecord([]);
            changeState(!state)
            setSelectVal(false);
        }
        setTimeout(() => setIsLoading(false), 3000)
    }

    //function to monitor if the showPrompts is true, and closes it if it satisfies the conditions
    const closePrompts =async(value) => {
        setShowPrompts(value);
        if(showPrompts===true){
            setDeletedStudents([]) //clears prompts upon closing
        }
     }

     // calls on the confirmation popup and passes the selected student_id to be deleted
    const onDelete=(student)=>{
        setShowConfirmation(true)
        setToDelete(student);
    }

    //calls on the confirmation popup and passes a list of student_id to be deleted
    const onDeleteMany = ()=>{
        setShowConfirmationMany(true);
        setToDelete(studentsToDel);
    }

    //Dropdown creator
    const DropDown =({value,options,onChange, type})=>{
        return(
            <label>
                <select value={value} onChange={onChange} className='view-student-dropdown'>
                {type === "search"? <option value = "" disabled hidden>SEARCH BY</option>: type==="view"?  <option value = "" disabled hidden>VIEW BY</option>: <option value = "" disabled hidden>ORDER BY</option> }
                {options.map((option,i)=>(
                    <option key={i} value = {option.value} >{option.label}</option>
                ))}
                </select>
            </label>
        );
    }

 
    return(
        <div>
        <div className='view-student-body'>
        
            <p className="title">Student Records {record?<span> {record.length}</span>:""}</p>

            <hr className='add-line'></hr>      

            <div className='view-student-header'>
                <ul className='view-student-list'>
                    <li><DropDown options={searchFilter} className='view-student-dropdown' value = {searchValue} onChange={(e) => setSearchValue(e.target.value)} type ="search"/></li>
                    <li><DropDown options={viewFilter} className='view-student-dropdown' value = {viewValue} onChange={viewChange} type="view"/></li>
                </ul>
            </div>
            <div className='view-student-search'>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                <input type = "text" id = 'input' className = 'view-student-input' placeholder = "&#xf002;  Search a student record" value = {input} onChange = {handleUserInput} required></input>

                <a onClick={handleSubmit} ><BsSearch className='student-search-icon'/></a>      
            </div>
            <div className='view-student-preview'>
                {record != undefined ? 
                    <div className='student-table-wrap'>
                    <table className='view-student-table'>
                        <thead className='view-student-thead'>
                        {
                            //display loader
                            isLoading? <></> :
                                <tr className='header-row'>
                                    <th className='student-header'><input className='general-checkbox'type = 'checkbox' checked = {selectedValue} value = {selectedValue} onChange={selectChange} /><AiFillDelete onClick={()=>{onDeleteMany()}} className='delete-many-icon'/></th>
                                    <th className='student-header' style ={{textAlign:'left', paddingLeft: '20px'}}>NAME</th>
                                    <th className='student-header'>STUDENT NUMBER</th>
                                    <th className='student-header'>DEGREE PROGRAM</th>
                                    <th className='student-header'></th>
                                </tr>
                        }
                        </thead>
                        
                        <tbody className = 'view-student-tbody'>
                        
                            {
                                // Display loader
                                isLoading ? <Row_Loader type='STUDENTS_LIST' /> :
                                // Display data
                                record.map((rec, i) => {
                                    return (
                                        <tr key={i} className='view-student-element' style={{}}>
                                            <td className='student-cell'><input className='student-checkbox'style ={{paddingLeft:'10px'}} type = 'checkbox' checked = {checkedState[i]} value = {checkedState[i]} onChange={()=>handleCheckChange(i)}></input></td>
                                            <td className='student-cell' onClick={()=> navigate('/student/'+rec.student_id)} style ={{textAlign:'left', paddingLeft: '20px'}}><div style={{float:'left'}}>{rec.last_name}, {rec.first_name}{rec.middle_name? ', '+rec.middle_name:""} {rec.suffix ? ', ' + rec.suffix + " ": ''}</div> {rec.warning_count > 0? <div className="student-warning-badge"><RiAlertLine />
                                            <span className='badge-text'>no. of warnings: {rec.warning_count}</span></div> : ""}</td>
                                            <td className='student-cell' onClick={()=> navigate('/student/'+rec.student_id)}>{rec.student_number}</td>
                                            <td className='student-cell' onClick={()=> navigate('/student/'+rec.student_id)}>{rec.degree_program}</td>
                                            <td className='student-cell' style ={{textAlign:'right', paddingRight: '30px'}} onClick={()=>{onDelete(rec)}}><AiFillDelete className='view-student-delete-icon'/></td>
                                        </tr>                                        
                                    );
                                })
                            }
                        </tbody>
                        {showConfirmation===true? <DeletePopup props={{confirmDelete: confirmDelete.bind()}} />:""}
                        {showConfirmationMany===true? <DeletePopup props={{confirmDelete: confirmDeleteMany.bind()}}/>:""}
                    </table></div>
                    :<div>
                        {message==="Loading students..."?"" :message==="Loading results..."?"":<div className='empty-students'>
                        <p>{message}</p> <button onClick={()=> navigate('/student/new')}> Add Student Records</button>
                        </div>}
                    </div>
                }
            </div>
            {showPrompts? <DeletedPrompt props={{closePrompts:closePrompts.bind(this), students:deleted_students}}/>: ""}
        </div>
        <Header />
        <Menu />
        <ToastContainer className='toast-container'/>
        <Footer />
    </div>
    );
}
export default View_Students;