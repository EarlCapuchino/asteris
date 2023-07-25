/*
    This component features a popup that shows the students and their condition if they are
    successfully added or not
*/
import React, { useState } from 'react';
import '../../../css/studentprompts.css'
const addStudentPopup=({props})=>{

    const handleButton = async() => {
        await props.closePrompts(false);
    }
    
    return(
        <div className="popup-box">
            <p className='details-text'>Results:</p>
            <div className="prompts-container">
                 {props.prompts.length > 0? (
                    props.prompts.map((prompt,i)=>{
                     return <div className='prompt-element' key = {i}>
                         { prompt.success? <p className='prompt-cell-success'>{prompt.message}</p>
                         :<p className='prompt-cell-error'>{prompt.message}</p>}
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