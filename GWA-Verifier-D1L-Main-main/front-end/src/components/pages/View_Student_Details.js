/**
    Source code description: This source code contains functions that allows and aids a user in editing a student
    record
*/
import React, {useState, Fragment, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../hooks/authHook'
import useLoadStore from '../hooks/loaderHook'
import Menu from '../components/Menu'
import Header from '../components/Header';
import Footer from '../components/Footer';
import Read_Row from '../components/Read_Row';
import Edit_Row from '../components/Edit_Row';
import DeletePopup from '../components/Popups/DeletePopup';
import DetailsPopup from '../components/Popups/DetailsPopup';
import {BiEdit, BiTrash, BiArrowBack}  from 'react-icons/bi';
import {RiAlertLine}  from 'react-icons/ri';
import '../../css/studentdetails.css'
import { ToastContainer } from 'react-toastify';
import { notifyDelete, notifyError, notifySuccess } from '../components/Popups/toastNotifUtil';
import '../../css/toast_container.css';
import { Name_Placeholder, Record_Field_Placeholder, Table_Placeholder } from '../loaders/Detail_Loader'

const View_Student_Details =()=>{

    const {REACT_APP_HOST_IP} = process.env
    const [pageState, setPage] = useState(false)
    const [editable, setEditable] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState("")
    const [showCancelConfirmation, setShowCancelConfirmation] = useState("")
    const [showEditConfirmation, setShowEditConfirmation] = useState("")
    const [showWarnings, setShowWarnings] = useState(false)
    const [highlightedRow, setHighlightedRow] = useState(-1)
    const [warningsScrollPos, setWarningsScrollPos] = useState(0)
    const [new_courses, setNewCourses] = useState([])
    const [new_degree, setDegree] = useState("")
    const [new_studno, setStudno] = useState("")
    const [new_fullname, setNewName] = useState({
        last_name:"",
        first_name:"",
        middle_name:"",
        suffix:""
    })
    
    const [state, setState]= useState({
        student_details:[],
        record_details:[],
        term_details:[],        
    })

    const programs = ["BACA", "BAPHLO", "BASOC", "BSAGCHEM", "BSAMAT", "BSAPHY", "BSBIO", "BSCHEM", "BSCS", "BSMATH","BSMST", "BSSTAT"]
    const { user, setAuth } = useStore();
    const { isLoading, setIsLoading } = useLoadStore();
    const navigate = useNavigate();     // navigation hook

    /*
        this function is initially called upon arrival on the page. if the pageState changes, this function
        will be called again to immediately reflect changes made on a student record
    */
    useEffect(()=>{
        const link = window.location.href
        //gets the id of a student from the url
        const id = link.slice(link.lastIndexOf('/')+1,link.length)

        setIsLoading(true)

        fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/student/'+id,{
            method:'GET',
            credentials:'include'
        }).then(response=> {return response.json()})
        .then(json=>{
            if (json.result.session.silentRefresh) {
                setAuth(json.result.session.user, json.result.session.silentRefresh)
            }
            setState(
                {student_details:json.result.output.record,
                record_details:json.result.output.record.record_data,
                term_details:json.result.output.record.record_data.term_data,
                course_details:json.result.output.record.record_data.term_data.course_data,
                warnings:json.result.output.warnings })   
        })
        setTimeout(() => setIsLoading(false), 3000)      
    },[pageState])
    
    /*
        upon editing, once the user cancels the editing process, this function will set the respective 
        information back to their initial values before the editing process was done 
    */  
    useEffect(()=>{
        setDegree(state.student_details.degree_program);
        setStudno(state.student_details.student_number);
        setNewName({
            last_name: state.student_details.last_name,
            first_name: state.student_details.first_name,
            middle_name: state.student_details.middle_name,
            suffix: state.student_details.suffix
        })
        if(!isLoading){
            if(document.getElementsByName("record-cumulative")[0] && state.record_details.cumulative_sum) document.getElementsByName("record-cumulative")[0].innerHTML = state.record_details.cumulative_sum
            if(document.getElementsByName("record-units")[0] && state.record_details.total_units) document.getElementsByName("record-units")[0].innerHTML = state.record_details.total_units
            if(document.getElementsByName("record-gwa")[0] && state.record_details.gwa) document.getElementsByName("record-gwa")[0].innerHTML = state.record_details.gwa
            let terms_count = state.term_details.length
            for (let i = 0; i < terms_count; i++) {
                if(document.getElementsByName("weights-term"+i)[0]) document.getElementsByName("weights-term"+i)[0].innerHTML = state.term_details[i].total_weights
                if(document.getElementsByName("units-term"+i)[0]) document.getElementsByName("units-term"+i)[0].innerHTML = state.term_details[i].no_of_units
                if(document.getElementsByName("gpa-term"+i)[0]) document.getElementsByName("gpa-term"+i)[0].innerHTML = state.term_details[i].gpa
        }
    }
        
    },[state])
    
    const handleDelete=(event)=>{
        event.preventDefault();
        setShowDeleteConfirmation(true)
    }

    /*
        a function called that handles the confirmation of a user in proceeding with the deletion of 
        a student record 
    */
    const confirmDelete = async(decision)=>{
        setShowDeleteConfirmation(false)
        if(decision){
            setIsLoading(true)
            const student = state.student_details.student_id
            await fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/student/'+student+'/'+user.user_id,{
                method: "DELETE",
                credentials:'include'
            }).then(response =>{ return response.json()})
            .then(json=>{
                if (json.result.session.silentRefresh) {
                    setAuth(json.result.session.user, json.result.session.silentRefresh)
                }
                if(json.result.success){
                    notifyDelete(json.result.message)                     
                }
            })
        setTimeout(() => setIsLoading(false), 3000)
        }
    }

    //a function that handles warnings of a student record
    const handleWarnings = (event) => {
        event.preventDefault();
        setShowWarnings(!showWarnings)
        setHighlightedRow(-1)
    }

    //a function that changes the interface of a student record to an editable student record
    const handleEdit=(event)=>{
        event.preventDefault();
        if(editable === true){
            setShowCancelConfirmation(true)
        }
        else{
            setEditable(true)
        }
    }

    const handleCancel=(event)=>{
        event.preventDefault();
        setShowCancelConfirmation(true)  
    }
    
    /*
        a function called upon pressing the 'save changes' button wherein it validates if the following
        changes done by the user follows the following conditions found in the code block. Once satisfied, 
        a confirmation popup will be called to ensure the user is final with the changes.
     
    */
    const handleUpdate=()=>{
        const studno_format = /^[0-9]{4,}-[0-9]{5,}$/

        if (!isCompleteFields()){
            notifyError("Please complete missing fields")
        }
        else if(!checkChanges()){
            notifyError("Please apply changes first")

        }else if(new_studno && !new_studno.match(studno_format)){
            notifyError("Invalid student number format")
            setStudno(state.student_details.student_number)
        }
        else if(!programs.includes(new_degree)){
            notifyError("Invalid degree program")
        }
        else {
            setNewCourses(getCourses())
            setShowEditConfirmation(true)
        }
    }

    /*
        upon confirmation on the editing process, this function is called to pass the necessary changes to
        be reflected to the back-end by calling a PATCH API 
    */
    const confirmEdit = async(decision,details)=>{

        setShowEditConfirmation(false)
        document.getElementById("submit-changes-btn").disabled = false;
        document.getElementById("cancel-editing-btn").disabled = false;
        if(decision){
            const edited = getEdits();
            const new_terms = edited.terms;
            const new_record = edited.record;
            setEditable(false)
            const updatedStudent = {
                new_courses,
                new_terms,
                new_record,
                new_details: {
                    last_name: new_fullname.last_name,
                    first_name: new_fullname.first_name,
                    middle_name: new_fullname.middle_name,
                    suffix: new_fullname.suffix,
                    student_number: new_studno,
                    degree_program: new_degree
                }
            }
            setIsLoading(true)
            fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/student/"+ state.student_details.student_id, {
                
                method:'PATCH',
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    updatedStudent,
                    details,
                    user_id: user.user_id,
                    
                }) 
            })
            .then((response) => {return response.json()})
            .then(json => {
                if (json.result.session.silentRefresh) {
                    setAuth(json.result.session.user, json.result.session.silentRefresh)
                }
                if(json.result.success){
                    const student = state.student_details
                    const full_name = student.first_name+" "+student.last_name+", "+student.degree_program+":\n"
                    let message =  full_name+json.result.message
                    notifySuccess(message)
                }else{
                    notifyError(json.result.message)}
                setPage(!pageState)
                setHighlightedRow(-1)
            })
        setTimeout(() => setIsLoading(false), 3000)
        }
    }
    
    //This function is called to get the updated values inputted by the user upon editing
    const getEdits = () =>{
        let terms_count = state.term_details.length
        let terms = []
        let temp_term;
        for (let i = 0; i < terms_count; i++) {
            let term_id = state.term_details[i].term_id
            let total_weights = Number(document.getElementsByName("weights-term"+i)[0].innerHTML)
            let no_of_units = document.getElementsByName("units-term"+i)[0].innerHTML
            let gpa = Number(document.getElementsByName("gpa-term"+i)[0].innerHTML)
            temp_term = {term_id,total_weights,no_of_units,gpa}
            terms.push(temp_term)
        }
        let cumulative_sum = document.getElementsByName("record-cumulative")[0].innerHTML;
        let total_units = document.getElementsByName("record-units")[0].innerHTML;
        let gwa = document.getElementsByName("record-gwa")[0].innerHTML
        let record = {record_id:state.record_details.record_id,cumulative_sum, total_units, gwa}
        return {terms,record}
    }

    // a function that checks if all required fields in the editing state are filled up properly
    const isCompleteFields = () =>{
        let temp;
        if(document.getElementsByName('last_name')[0].value == "") return false;
        if(document.getElementsByName('first_name')[0].value == "") return false;
        if(document.getElementsByName('degree_program')[0].value == "") return false;


        const terms = state.term_details
        for (let i = 0; i < terms.length; i++) {
            for (let j = 0; j < terms[i].course_data.length; j++) {
                temp = document.getElementsByName("code-"+i+"-"+j)[0]
                if(!temp) return false
                else if(temp && temp.value === "") return false
                temp = document.getElementsByName("grade-"+i+"-"+j)[0]
                if(!temp) return false
                else if(temp && temp.value === "") return false
                temp = document.getElementsByName("units-"+i+"-"+j)[0]
                if(!temp) return false
                else if(temp && temp.value === "") return false
            }
        }
        return true
    }

    //a function that checks if there are changes done on the record details
    const checkChanges = () =>{
       let temp;

       if(document.getElementsByName("first_name")[0].value!==state.student_details.first_name) return true;
       if(document.getElementsByName("last_name")[0].value!==state.student_details.last_name) return true;
       if(document.getElementsByName("middle_name")[0].value!==state.student_details.middle_name) return true;
       if(document.getElementsByName("suffix")[0].value!==state.student_details.suffix) return true;
       if(document.getElementsByName("student_number")[0].value!==state.student_details.student_number) return true;
       if(document.getElementsByName("degree_program")[0].value!==state.student_details.degree_program) return true;

        const terms = state.term_details
        for (let i = 0; i < terms.length; i++) {
            for (let j = 0; j < terms[i].course_data.length; j++) {
                
                temp = document.getElementsByName("code-"+i+"-"+j)[0]
                if(temp && temp.value !== terms[i].course_data[j].course_code) return true
                temp = document.getElementsByName("grade-"+i+"-"+j)[0]
                if(temp && temp.value !== terms[i].course_data[j].grade) return true
                temp = document.getElementsByName("units-"+i+"-"+j)[0]
                if(temp && temp.value !== terms[i].course_data[j].units) return true
                temp = document.getElementsByName("weight-"+i+"-"+j)[0]
                if(temp && temp.value !== terms[i].course_data[j].weight.toString()) return true
                temp = document.getElementsByName("cumulated-"+i+"-"+j)[0]
                if(temp && temp.value !== terms[i].course_data[j].cumulated.toString()) return true
            }
        }
        return false
    }

    //a function that gets the updated values of a student's subject
    const getCourses = () =>{
        let courses = [];
         const terms = state.term_details
         for (let i = 0; i < terms.length; i++) {
             for (let j = 0; j < terms[i].course_data.length; j++) {
                 courses.push({
                    course_id: terms[i].course_data[j].course_id,
                    term_id: terms[i].course_data[j].term_id,
                    course_code: document.getElementsByName("code-"+i+"-"+j)[0].value,
                    grade: document.getElementsByName("grade-"+i+"-"+j)[0].value,
                    units: document.getElementsByName("units-"+i+"-"+j)[0].value,
                    weight: Number(document.getElementsByName("weight-"+i+"-"+j)[0].value),
                    cumulated: Number(document.getElementsByName("cumulated-"+i+"-"+j)[0].value)
                 })
             }
         }
         return courses
     }

    const CancelPopup=({})=>{
        return(
            <div className="cancel-popup-box">
                <p className='cancel-text'>Are you sure you want to cancel editing?</p>
                
                <div className='cancel-edit-buttons'>
                    <button onClick={() => {setShowCancelConfirmation(false)}} className = 'no-btn'>No</button>
                    <button onClick={() => {setShowCancelConfirmation(false), setEditable(false), setPage(!pageState);}} className = 'yes-btn'>Yes</button>
                </div>
            </div>
        )
    }
    // a function called that sets the initial values of warnings before editing; called upon when edit is cancelled
    useEffect(()=>{
        let id_val;
        if(document.getElementById("warning-div"))
            document.getElementById("warning-div").scrollTop = warningsScrollPos
        if(!highlightedRow || highlightRow === "") id_val = 0
        else id_val = highlightedRow
        const elementToView = document.getElementById(id_val);
        if(elementToView)
            elementToView.scrollIntoView({block: 'center',behavior: 'smooth'});
    },[highlightedRow])
    
    const WarningPopup=({})=>{
        return(
            <div className="warning-popup-box" id = "warning-div" >
                <h3 className='warning-header'>Record Warnings</h3>
                {state.warnings.length > 0? 
                <div className='warnings-body' >
                    {state.warnings.map((warning,i) => {
                        let anchor_value,bg_color,border_value;
                        if(!warning.row_number || warning.row_number === "") anchor_value = 0
                        else anchor_value = warning.row_number
                        if(highlightedRow === warning.row_number){
                            bg_color = "rgba(141, 20, 54, 0.2)"
                            border_value = "solid 1px black"
                        } 
                        else {
                            bg_color = "rgba(141, 20, 54, 0.1)"
                            border_value = "none"
                        }
                        return <div key = {i}   id={"warning"+anchor_value} className = "warning" style = {{backgroundColor: bg_color, border:border_value}} onClick = {() => {highlightRow(warning.row_number)}}>
                        <h5>{warning.course}</h5>
                        <h5>{warning.term}</h5>
                        <p>{warning.details}</p>
                        <span>{warning.warning_type}</span>
                    </div>
                    })}
                </div>
                : <p>No record warnings found</p>}
            </div>  
        )
    }

    const highlightRow = (row_num) => {
        setHighlightedRow(row_num)
        setWarningsScrollPos(document.getElementById("warning-div").scrollTop)
    }
   
    return(
        <div>
            
        <div className='details-body'  id ="top">
            {state.student_details.isDeleted? <div className='deleted-watermark'>DELETED STUDENT RECORD</div>:""}
            <div className = "top-header" >
                {!state.student_details.isDeleted?
                <div className='icons'>
                    <i className = "icon" onClick={handleEdit}><BiEdit size= {25} title="Edit student record"/></i>
                    <i className = "icon" onClick={handleDelete}><BiTrash size= {25} title="Delete student record"/></i>
                    <i className = "icon" onClick={handleWarnings}><RiAlertLine size= {25} title="Warnings"/></i>
                    {state.warnings && state.warnings.length > 0? <span className="warning-badge">{state.warnings.length}</span>
                    : ""}
                </div>:""
                }
    
                {!state.student_details.isDeleted?
                <i className = "back-icon" onClick={()=> navigate('/students')}><BiArrowBack size= {30} /></i>:""}
                {!state.student_details.isDeleted? 
                    editable == true? (
                        <div className='student-edit-name-container'>
                        <input className="student-edit-name" name='last_name'
                            type = "text"
                            required = "required"
                            placeholder= "Enter last name"
                            value = {new_fullname.last_name}
                            onChange = {(e)=>{setNewName({
                                last_name: e.target.value,
                                first_name: new_fullname.first_name,
                                middle_name: new_fullname.middle_name,
                                suffix: new_fullname.suffix
                            })}}
                        ></input>
                        <input className="student-edit-name" name='first_name'
                            type = "text"
                            required = "required"
                            placeholder= "Enter first name"
                            value = {new_fullname.first_name}
                            onChange = {(e)=>{setNewName({
                                last_name: new_fullname.last_name,
                                first_name: e.target.value,
                                middle_name: new_fullname.middle_name,
                                suffix: new_fullname.suffix
                            })}} 
                        ></input>
                        <input className="student-edit-name" name='middle_name'
                            type = "text"
                            required = "required"
                            placeholder= "Enter middle name"
                            value = {new_fullname.middle_name} 
                            onChange = {(e)=>{setNewName({
                                last_name: new_fullname.last_name,
                                first_name: new_fullname.first_name,
                                middle_name: e.target.value,
                                suffix: new_fullname.suffix
                            })}}
                        ></input>
                        <input className="student-edit-name" name='suffix'
                            type = "text"
                            required = "required"
                            placeholder= "Enter suffix name"
                            value = {new_fullname.suffix}
                            onChange = {(e)=>{setNewName({
                                last_name: new_fullname.last_name,
                                first_name: new_fullname.first_name,
                                middle_name: new_fullname.middle_name,
                                suffix: e.target.value
                            })}}
                        ></input></div>
                    )
                    :
                    (<p className="student-name">
                    {
                        isLoading ? <Name_Placeholder /> : `${state.student_details.last_name}, ${state.student_details.first_name} ${state.student_details.middle_name} ${state.student_details.suffix}`
                    }
                    </p>) : <p className="student-name" style={{marginLeft:'16.5%'}}>
                    {isLoading ? <Name_Placeholder /> : `${state.student_details.last_name}, ${state.student_details.first_name} ${state.student_details.middle_name} ${state.student_details.suffix}`}</p>
                }
                {editable === true ? <span className='edit-btns'>
                    <button type = "button" onClick={handleCancel} className="cancel-edit-btn" id="cancel-editing-btn">Cancel Editing</button>
                    <button type = "button" onClick={handleUpdate} className="submit-edit-btn" id="submit-changes-btn">Submit Changes</button>
                    </span>:""}
                <hr className='student-line' ></hr>
            </div>
            
            < div className='student-record' >
                {editable == true? (
                <div className='student-info-edit-left'>
                    <tr><b>Degree Program:</b><input className="edit-top-cell"
                        name = 'degree_program'
                        type = "text"
                        required = "required"
                        placeholder= "Enter degree program"
                        value = {new_degree}
                        onChange={(e)=>{setDegree(e.target.value)}}
                    ></input><br/></tr>
                    <tr><b>Student No.:</b><input className="info-edit-cell"
                        name = "student_number"
                        type = "text"
                        required = "required"
                        placeholder= "Enter student number"
                        value = {new_studno} 
                        onChange={(e)=>{setStudno(e.target.value)}}
                    ></input><br/></tr>
                    <tr>
                    <b>Latin Honor:</b> <input className = "info-edit-cell"
                        type = "text"
                        disabled
                        defaultValue = {state.student_details.latin_honor} 
                    ></input><br/>
                    </tr>
                </div>)
                :(
                <div className='student-info-left'>
                    <div><b>Degree Program:</b><span className='info-l'>	                            
                    {  isLoading ? <Record_Field_Placeholder /> :state.student_details.degree_program }
                        </span>
                    </div><br/>
                    <div><b>Student No.:</b>
                        <span className='info-l'>
                            { isLoading ? <Record_Field_Placeholder /> : state.student_details.student_number !==""? state.student_details.student_number:'-'}
                        </span>
                    </div><br/>
                    <div><b>Latin Honor:</b>
                        <span className='info-l'>
                            { 
                                isLoading ? <Record_Field_Placeholder /> :
                                state.student_details.latin_honor !== "" ? state.student_details.latin_honor
                                : '-'
                            }
                        </span>
                    </div><br/>
                </div>)}
            <div className='student-info-right'>
                <div><b>Total weights:</b> <span name={"record-cumulative"} className='info-r'> 
                { isLoading ? <Record_Field_Placeholder /> : state.record_details.cumulative_sum }
                    </span>
                    </div><br/>
                <div><b>Total Units:</b>
                    <span name={"record-units"} className='info-r'>
                        { isLoading ? <Record_Field_Placeholder /> : state.record_details.total_units }
                    </span>
                </div><br/>
                <div><b>GWA:</b>
                    <span name={"record-gwa"} className='info-r'>
                        { isLoading ? <Record_Field_Placeholder /> : state.record_details.gwa }
                    </span>
                </div><br/>
            </div><br/>
            <hr className='record-line' id ="line"></hr><br/>
            <div className='record'>
            {
                isLoading ? <Table_Placeholder /> :
                state.term_details!=[]? state.term_details.map((term, i)=>{
                    let headStyle = {textAlign:'left'}	
                    let term_gpa = Number(term.gpa)	
                    if(isNaN(term_gpa)) term_gpa = 0	
                    return <span key={i} name = {"term"+i}>	
                    <form>	
                        <table className='record-table'>	
                            <thead className='record-head'>	
                                <tr style={headStyle}>	
                                    <th style = {{paddingLeft:'40px'}}>Course Code</th> 	
                                    <th style = {{paddingLeft:'40px'}}>Grade</th>	
                                    <th style = {{paddingLeft:'40px'}}>Units</th>	
                                    <th style = {{paddingLeft:'40px'}}>Weight</th>	
                                    <th style = {{paddingLeft:'40px'}}>Enrolled</th>   	
                                </tr>	
                            </thead>	
                                
                            <tbody>	
                                <tr style={headStyle}>	
                                    <td colSpan="100%" ><hr /></td>	
                                </tr>	
                                {term.course_data!=[]? term.course_data.map((course,index)=>{	
                                    let bg_color, border_value;	
                                    {index % 2 === 0? bg_color = 'rgba(0, 86, 63, 0.2)':bg_color = 'white'}	
                                    border_value = 'none'	
                                    if (highlightedRow===course.row_number ){	
                                        bg_color = 'rgba(141, 20, 54, 0.3)'	
                                        border_value = "solid 1px black"	
                                    } 	
                                    return <Fragment key={index}>	
                                        {editable === true ? (	
                                        <Edit_Row  term_index = {i} course = {course} index = {index} bg_color = {bg_color}/>	
                                        ) : (	
                                        <Read_Row course = {course} bg_color = {bg_color} border = {border_value}/>	
                                        ) }	
                                    </Fragment>	
                                        
                                        }):""}	
                            </tbody>	
                        </table>	
                    </form>	
                <div className = "term-summary">	
                Term: <u name = {"term-name"+i}>{term.semester}/{term.acad_year}</u> &nbsp;&nbsp;&nbsp;&nbsp;  <span >|</span> &nbsp;&nbsp;&nbsp;&nbsp;	
                Total units: <u name = {"units-term"+i}>{term.no_of_units}</u> &nbsp;&nbsp;&nbsp;&nbsp;  <span >|</span> &nbsp;&nbsp;&nbsp;&nbsp;	
                Total weights: <u name = {"weights-term"+i}>{term.total_weights} </u> &nbsp;&nbsp;&nbsp;&nbsp;<span>|</span> &nbsp;&nbsp;&nbsp;&nbsp;	
                GPA: <u name = {"gpa-term"+i}>{term_gpa} </u>	
                </div><br/>	</span>     
                }):""
            }{}</div></div>

            {showDeleteConfirmation ? <DeletePopup props={{confirmDelete: confirmDelete.bind()}} />:""}
            {showEditConfirmation ? <DetailsPopup props={{confirmEdit: confirmEdit.bind()}} />:""}
            {showCancelConfirmation ? <CancelPopup />:""}
            {showWarnings ? <WarningPopup />:""}
            <div className = "bottom-space">
            </div>
        </div>
        
        <Header/>
        <Menu />
        <ToastContainer className='toast-container'/>
        <Footer/>
        </div>
    )
}


export default View_Student_Details;