import React, {useState} from "react";

// Turns rows of table of student details as editable input fields; only activates if student details page is set to editable
const Edit_Row = ( { course, term_index,index,bg_color}) => {
    const [course_code, setCourse] = useState(course.course_code);
    const [grade, setGrade] = useState(course.grade);
    const [units, setUnits] = useState(course.units);
    let [weight, setWeight] = useState(course.weight)
    const [cumulated, setCumulated] = useState(course.cumulated)
    const not_counted = ["5","5.0","5.00","4","4.0","4.00","INC","DFG","U"]
    let prevCumulated = 0

    // Check for empty fields
    if (course_code === "" || grade === "" || units === "" ){
        bg_color = 'rgba(141, 20, 54, 0.3)'
    } 

    const computeCumulated =  (curr_weight) => {
        let term_name = document.getElementsByName("term-name"+term_index)[0].innerHTML
        if(isNaN(curr_weight)) curr_weight = 0
        weight = Number(curr_weight)
        setWeight(weight)
        if(index > 0) {
            prevCumulated = document.getElementsByName("cumulated-"+term_index+"-"+(index-1))[0].value
        }
        else if(term_index > 0){
            let c_index = 10;
            let next_course = document.getElementsByName("cumulated-"+(term_index-1)+"-"+(c_index))[0]
            // iterate through the terms and get the last course
            while(next_course === undefined){
                next_course = document.getElementsByName("cumulated-"+(term_index-1)+"-"+(c_index--))[0]
            }
            if(isNaN(next_course.value)) next_course.value = 0
            prevCumulated = next_course.value
        }
        let sum = Number(prevCumulated);
        if(term_name !== "II/19/20") sum= Number(prevCumulated) + Number(curr_weight)
        setCumulated(sum)
        let i = index+1
        let next= document.getElementsByName("weight-"+term_index+"-"+i)[0];
        
        // Update cumulated column of the current term of this course
        while(next !== undefined){
            if(isNaN(next.value)) next.value = 0
            if(term_name !== "II/19/20") sum = sum + Number(next.value)
            document.getElementsByName("cumulated-"+term_index+"-"+(i))[0].value = sum
            i++
            next = document.getElementsByName("weight-"+term_index+"-"+(i))[0]
        }
        // Compute cumulated column of the remaining terms
        computeNextCumulated(sum)
    }

    // Update cumulated column of the remaining terms
    const computeNextCumulated = (sum) =>{
        let t_index = term_index + 1
        let c_index;
        let next;
        let term_name;
        // While there is a valid term
        while(checkTerm(t_index)){
            term_name = document.getElementsByName("term-name"+t_index)[0].innerHTML
            c_index = 0;
            next = document.getElementsByName("weight-"+t_index+"-"+c_index)[0];
            while(next !== undefined){
                if(isNaN(next.value)) next.value = 0
                if(term_name !== "II/19/20") sum = sum + Number(next.value)
                
                document.getElementsByName("cumulated-"+t_index+"-"+c_index)[0].value = sum

                c_index++
                next = document.getElementsByName("weight-"+t_index+"-"+c_index)[0]
            }
            t_index++
        }
        computeTermTotals()
    }

    const checkTerm = (t_index) => {
        if(document.getElementsByName("term"+t_index)[0] !== undefined){
            return true
        }
        else return false
    }

    const computeTermTotals = () =>{
        let t_index = 0;
        let cumulative = 0;
        let total_units = 0;
        let units_included = 0;
        
        while(checkTerm(t_index)){
            let c_index = 0;
            let term_units = 0;
            let temp_units = 0;
            let weights = 0;
            let term_name = document.getElementsByName("term-name"+t_index)[0].innerHTML
            
            let curr_u = document.getElementsByName("units-"+t_index+"-"+c_index)[0];
            let curr_w = document.getElementsByName("weight-"+t_index+"-"+c_index)[0];
            while(curr_u !== undefined && curr_w !== undefined){
                if(isNaN(curr_u.value)) curr_u.value = 0;
                if(isNaN(curr_w.value)) curr_w.value = 0;
                let curr_g = document.getElementsByName("grade-"+t_index+"-"+c_index)[0].value;
                // Failing/ Removal/ Unsatisfied grades/ INC/ DFG -> not counted in units
                if(!not_counted.includes(curr_g)){
                    term_units = term_units + Number(curr_u.value)
                }
                // Included in gwa computation
                if(term_name !== "II/19/20" && !isNaN(Number(curr_g))){
                    units_included = units_included + Number(curr_u.value)
                }
                    
                // Current row
                if(t_index === term_index && c_index === index ){
                    weights = weights + Number(weight)
                    if(weight !== 0)
                        temp_units = temp_units + Number(curr_u.value)
                }
                else{
                    weights = weights + Number(curr_w.value)
                    if(Number(curr_w.value) !== 0)
                        temp_units = temp_units + Number(curr_u.value)
                }
                
                c_index++
                curr_u = document.getElementsByName("units-"+t_index+"-"+c_index)[0]
                curr_w = document.getElementsByName("weight-"+t_index+"-"+c_index)[0];
            }
            let term_gpa = parseFloat((weights/temp_units).toFixed(4))
            if(isNaN(term_gpa)) term_gpa = 0
            document.getElementsByName("weights-term"+t_index)[0].innerHTML = weights
            document.getElementsByName("units-term"+t_index)[0].innerHTML = term_units
            document.getElementsByName("gpa-term"+t_index)[0].innerHTML = term_gpa
            if(term_name != "II/19/20")
                cumulative = cumulative + weights
            total_units = total_units + term_units
            t_index++
        }
        document.getElementsByName("record-cumulative")[0].innerHTML = cumulative
        document.getElementsByName("record-units")[0].innerHTML = total_units
        document.getElementsByName("record-gwa")[0].innerHTML = parseFloat((cumulative/units_included).toFixed(4))
    }
    
    return(
        <tr style = {{backgroundColor: bg_color}} id = {course.row_number}>
            <td>
                <input
                    className="edit-cell"
                    type = "text"
                    required = "required"
                    placeholder= "Enter Course Code"
                    name = {"code-"+term_index+"-"+index}
                    value = {course_code}
                    style = {{backgroundColor: bg_color}}
                    onChange = {(e)=> {setCourse(e.target.value)}}
                ></input>
            </td>
            <td>
                <input
                    className="edit-cell"
                    type = "text"
                    required = "required"
                    placeholder= "Enter Grade"
                    name = {"grade-"+term_index+"-"+index}
                    value = {grade}
                    style = {{backgroundColor: bg_color}}
                    onChange = {(e)=> {setGrade(e.target.value),computeCumulated(Number(e.target.value)*Number(units))}}
                ></input>
            </td>
            <td>
                <input
                    className="edit-cell"
                    type = "text"
                    required = "required"
                    placeholder= "Enter Units"
                    name = {"units-"+term_index+"-"+index}
                    value = {units}
                    style = {{backgroundColor: bg_color}}
                    onChange = {(e)=> {setUnits(e.target.value),computeCumulated(Number(e.target.value)*Number(grade))}}
                ></input>
            </td>
            <td>
                <input
                    className="edit-cell"
                    type = "text"
                    id = {"weight-"+term_index+"-"+index}
                    name = {"weight-"+term_index+"-"+index}
                    value = {weight}
                    style = {{backgroundColor: bg_color}}
                    onChange = {(e)=> {setWeight(e.target.value)}}
                    disabled
                ></input>
            </td>
            <td>
                <input
                    className="edit-cell"
                    type = "text"
                    id={"cumulated-"+term_index+"-"+index}
                    name = {"cumulated-"+term_index+"-"+index}
                    value = {cumulated}
                    style = {{backgroundColor: bg_color}}
                    onChange = {(e)=> {setCumulated(e.target.value)}}
                    disabled
                ></input>
                
            </td>
        </tr>
    )
}

export default Edit_Row