import React from 'react';

// Takes in the course data of a student from student details and lays it out per row
// This only activates if the student details page is not editable
const Read_Row = ({course, bg_color, border}) => {
    
    return (
            
            <tr  style = {{lineHeight:2, backgroundColor: bg_color, border: border}} id = {course.row_number}>
                <td style = {{paddingLeft:'45px'}}>{course.course_code}</td>
                <td style = {{paddingLeft:'45px'}}>{course.grade}</td>
                <td style = {{paddingLeft:'55px'}}>{course.units}</td>
                <td style = {{paddingLeft:'50px'}}>{course.weight}</td>
                <td style = {{paddingLeft:'50px'}}>{course.cumulated}</td>
            </tr>
    )
}

export default Read_Row