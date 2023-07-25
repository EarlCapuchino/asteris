import React from 'react';
import '../../../css/studentprompts.css'
const addStudentPopup=({props})=>{

    const handleButton = async() => {
        await props.closePrompts(false);
    }
    
    return(
        <div className="popup-box">
            <p className='details-text'>The following students have been deleted:</p>
            <div className="prompts-container">
                 {props.students.length > 0? (
                    props.students.map((student,i)=>{
                     return <div className='prompt-element' key = {i}>
                         <p className='prompt-cell-success'><b>{student.degree_program}:</b> {student.last_name}, {student.first_name} {student.middle_name} {student.suffix}</p>
                         </div>
                    })
                ):"" } 
            </div> 
                <div className='close-buttons'>
                    <button onClick={() => {handleButton(false)}} className = 'close-btn'>Close</button>                    
                </div>
        </div>
    )
}
export default addStudentPopup;