import React, { useState } from 'react';
import '../../../css/deletepopup.css';
import { notifyError } from './toastNotifUtil';

// Pop-up that shows whenever user deletes a student, or admin deletes a user

const DeletePopup=({props})=>{
    const maxchar = 500;
    const [char_count, setCharCount] = useState(0)

    //actively checks the delete details' character count 
    const handleDetailsChange = (e) =>{
        setCharCount(e.target.value.trim().length)
    }

    //Button handler that waits for user choice to finalize deletion
    const handleButton = async(choice) => {
        let reason = document.getElementById('deletion-details').value.trim(); 
        //checks if description is at least 10 characters long, not exceeding 500 characters
        if(!choice) await props.confirmDelete(choice, reason)
        else {
            if (reason === '') notifyError('Please enter a valid reason');
            else{
                if (reason.length < 10) notifyError('Reason must not be less than 10 characters');
                else await props.confirmDelete(choice, reason);
            }
        }
    }
    
    return(
        <div className="popup-box">
           
                <p className='delete-text'>Are you sure you want to delete?</p>
                <p className='format-text'>Please use this format for consistency (<b>REASON</b> : [<b>REASON FOR DELETION</b>])</p>
                <textarea className = 'deletion-details-textarea' id = 'deletion-details' onChange={(e) => handleDetailsChange(e)} maxLength={500} placeholder = "Provide reason for deletion" wrap="hard" ></textarea>
                <p className = 'details-character-count'>{maxchar - char_count}</p>
                
                <div className='buttons'>
                    <button onClick={() => {handleButton(false)}} className = 'cancel-btn'>Cancel</button>
                    <button onClick={() => {handleButton(true)}} className = 'confirm-btn'>Confirm</button>
                    
                </div>
        </div>
    )
}
export default DeletePopup;