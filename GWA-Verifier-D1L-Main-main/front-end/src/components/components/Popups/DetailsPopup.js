import React, { useState } from 'react';
import '../../../css/detailspopup.css'

// Pop-up that shows whenever changes are done to a student's details; asks for user to input the reason changes are done

const DetailsPopup=({props})=>{
    const maxchar = 500
    const [details, setDetails] = useState("")
    const [char_count, setCharCount] = useState(0)
    const [char_color, setCharColor] = useState('black')
    const [alert_message, setAlert] = useState('')
    
    document.getElementById("submit-changes-btn").disabled = true;
    document.getElementById("cancel-editing-btn").disabled = true;

    //actively checks the details' character count 
    const handleDetailsChange = (e) =>{
        setDetails(e.target.value)
        setCharCount(e.target.value.length)
         //change color and alert of typed in details based on amount of characters
        if(e.target.value.length > maxchar) setCharColor('red')
        else setCharColor('black')
        if(e.target.value.length==maxchar) setAlert("")
        if(e.target.value.length == 10) setAlert("")
        
    }

    //Button that waits for user choice to finalize edit or not
    const handleButton =async(choice) => {
        //checks if description is at least 10 characters long but not exceeding 500 characters
        if(!choice) await props.confirmEdit(choice,details)
        if(char_count <= maxchar ){
            if(choice && char_count >= 10){
            await props.confirmEdit(choice,details)
            }
            else setAlert("Details must not be less than 10 characters.")
        }
        else setAlert("Details must not exceed 500 characters.")
    }
    
    return(
        <div className="details-popup-box">
           
                <p className='details-text'>Provide a brief description on changes made</p>
                <p className='format-text'>Please use this format for consistency (<b>SUBJECT</b> : [<b>OLD UNIT/GRADE</b>] TO [<b>NEW UNIT/GRADE</b>])</p>
                <textarea className = "details-area" value={details} onChange={(e)=>handleDetailsChange(e)} placeholder = "Enter edit notes" wrap="hard" ></textarea>
                <p className = 'character-count' style={{color: char_color}}>{maxchar - char_count}</p>
                <i className='alert-msg' style={{color: 'red'}}>{alert_message}</i>
                <div className='details-buttons'>
                    <button onClick={() => {handleButton(false)}} className = 'details-cancel-btn'>Cancel</button>
                    <button onClick={() => {handleButton(true)}} className = 'details-confirm-btn'>Confirm</button>
                    
                </div>
        </div>
    )
}
export default DetailsPopup;