import React, { useState } from 'react';
import '../../../css/deletepopup.css' /**delete details from nicole: TO BE EDITED */

const DeleteConfirmPopup=({props})=>{
    const maxchar = 500
    const [delete_confirm, setDeleteConfirm] = useState("")
    const [char_count, setCharCount] = useState(0)
    const [char_color, setCharColor] = useState('black')
    const [alert_message, setAlert] = useState('')
    
    const handleDeletionChange = (e) =>{
        setDeleteConfirm(e.target.value)
        setCharCount(e.target.value.length)
        if(e.target.value.length > maxchar) setCharColor('red')
        else setCharColor('black')
        if(e.target.value.length==maxchar) setAlert("")
        if(e.target.value.length == 10) setAlert("")
    }

    const handleButton =async(choice) => {
        if(!choice) await props.confirmDelete(choice,delete_confirm)
        
        if(char_count <= maxchar ){
            if(choice && char_count >= 10){
                await props.confirmDelete(choice,delete_confirm)
            }
            else setAlert("Details must not be less than 10 characters.")
        }
        else setAlert("Details must not exceed 500 characters.")
    }
    
    return(
        <div className="details-popup-box">

                <p className='details-text'>Reason for Deletion</p>
                <textarea className = "details-area" value={delete_confirm} onChange={(e)=>handleDeletionChange(e)} placeholder = "Reason" wrap="hard" ></textarea>
                <p className = 'character-count' style={{color: char_color}}>{maxchar - char_count}</p>
                <i className='alert-msg' style={{color: 'red'}}>{alert_message}</i>
                <div className='details-buttons'>
                    <button onClick={() => {handleButton(false)}} className = 'details-cancel-btn'>Cancel</button>
                    <button onClick={() => {handleButton(true)}} className = 'details-confirm-btn'>Confirm</button>
                    
                </div>
        </div>
    )
}
export default DeleteConfirmPopup;
