/*
  Source code description: This source code contains the functions used in adding student records (in CSV format) 
  in the application.
 */

 import { useNavigate } from 'react-router-dom'
 import React, { useRef, useState } from 'react';
 import useStore from '../hooks/authHook'
 import Header from '../components/Header';
 import Footer from '../components/Footer';
 import Menu from '../components/Menu'
 import Prompts from '../components/Popups/addStudentPopup'
 import {IoMdRemoveCircle} from 'react-icons/io'
 import '../../css/addstudent.css'
 
 const Add_Student_Page=()=>{
    const {REACT_APP_HOST_IP} = process.env
    const [files, setFiles] = useState([]);
    const [results, setResults] = useState([]);
    const [prompts, setPrompts] = useState([]);
    const [ fullName, setFullName] = useState("");
    const [showPrompts, setShowPrompts] = useState(false);
    const semester= useRef();
    const acad_year = useRef();
    const num_of_units = useRef();

    const { user, setAuth } = useStore();
    const navigate = useNavigate();     // navigation hook
    const programs = ["BACA", "BAPHLO", "BASOC", "BSAGCHEM", "BSAMAT", "BSAPHY", "BSBIO", "BSCHEM", "BSCS", "BSMATH","BSMST", "BSSTAT"]
 
    const setCSVFile = (e) => {
        // Convert the FileList into an array and iterate
        let selected_files = []
        Array.from(e.target.files).map(file => {
            selected_files.push(file)
        });
        setFiles(selected_files)
     }

     const getResults =async() => {
        // Convert the FileList into an array and iterate
        let result = files.map(file => {
            // Define a new file reader
            let reader = new FileReader();
            // Create a new promise
            return new Promise(resolve => {
                // Resolve the promise after reading file
                reader.onload = () => resolve(reader.result);
                // Read the file as a text
                reader.readAsText(file);
            });
        });
        
        // At this point you'll have an array of results
        let res = await Promise.all(result);
        return res
    }

     const closePrompts =async(value) => {
        setShowPrompts(value);
        if(showPrompts===true){
            //clears prompts upon closing
            setPrompts([])
        }
     }

    /*
        A function used to check if a given dictionary containing the necessary
        student details has a student number, a first name, a last name, a degree program 
        that exists in the list of CAS Degree Programs, and a student number that follows the 
        correct format if the student has one. If the following conditions are satisfied, the 
        function returns true, else it returns the error
     */
    const checkStudentDetails = (student_data) => {
        const studno_format = /^[0-9]{4}-[0-9]{5}$/;   
        if (!student_data.first_name || student_data.first_name === "") 
            return ("Student not added: Missing first name");
        if (!student_data.last_name || student_data.last_name === "") 
                return ("Student not added: Missing last name");
        if (!student_data.degree_program || student_data.degree_program === "")
                return ("Student not added: Missing degree program");
        if(!programs.includes(student_data.degree_program))
            return ("Student not added: Invalid degree program");
        if (!studno_format.test(student_data.student_number)) {
            return ("Student not added: Wrong student number format");
        }
        return true;
    };
      
    /**
        A function that accepts a dictionary of record data which checks if the student record data
        has a GWA, total units, and cumulated sum. If the following conditions are satisfied, it returns true.
        Else, it returns the errors. 
     */
    const checkRecordDetails = (record_data) => {
        if (!record_data.gwa || record_data.gwa === "") return ("Student not added: Missing value of GWA"); // Gwa cannot be null
        if (!record_data.total_units || record_data.total_units === "") return("Student not added: Missing value of Total Units");   // Total units cannot be null   
        if (!record_data.cumulative_sum || record_data.cumulative_sum === "") return("Student not added: Missing value of Cumulative Sum"); // Cumulative sum cannot be null     
        return true
    };

     /**
        A function that processes an array of strings which contains the content of an uploaded csv file.
        This will categorize data into their respective headers. Doing so, the function will return a dictionary 
        containing a dictionary of student details and record details to be passed to the back-end
      */
     const getRecords = async(array) =>{
         let headers = [];
         let courses = [];
         let term_data=[];
         let term = {};
         let weightPerTerm = 0;
         let cumulative_sum = 0;
         let course_row = 0
 
         for(var i = 1; i < array[10].length; i++){
             if (array[10][i] != ''){
                 headers.push(array[10][i])
             }
         }
         for(var j = 11; j < array.length; j++){
 
             if(array[j][1] != ''){
                 
                 let sem = array[j][7].slice(0,array[j][7].indexOf('/'));
                 let year = array[j][7].slice(array[j][7].indexOf('/')+1, array[j][7].length)
                 let no_of_units = Number(array[j][6]);
                 
                 //if course is found at the beginning of the record
                 if(courses.length <=0 && array[j][7] != ''){
                     courses.push({course_code: array[j][1], grade: array[j][2], units: array[j][3], 
                     weight: Number(array[j][4]), cumulated: Number(array[j][5]), row_number: course_row++})
                     weightPerTerm = weightPerTerm + (Number(array[j][4]))
                        
                     semester.current = sem;
                     acad_year.current = year;
                     num_of_units.current = no_of_units; 
                     
                 }

                 // indicates that the course is included in a new term
                 else if (array[j][7] != ''){
                     // if a new term is found, push the previous states and courses first before renewing
                     if(courses[0] != ''){
                         term={acad_year: acad_year.current, semester: semester.current, no_of_units: num_of_units.current, 
                             total_weights: weightPerTerm, course_data: courses}
                         term_data.push(term);
                     }

                     semester.current = sem;
                     acad_year.current = year;
                     num_of_units.current = no_of_units;
                     weightPerTerm = 0;
                 
                     courses = [];
                     term = {};

                     courses.push({course_code: array[j][1], grade: array[j][2], units: array[j][3], 
                     weight: Number(array[j][4]), cumulated: Number(array[j][5]), row_number: course_row++})
                     weightPerTerm = weightPerTerm + (Number(array[j][4]))
                 // all courses under the current term will be appended until a new term is found
                 }else{
                     courses.push({course_code: array[j][1], grade: array[j][2], units: array[j][3], 
                         weight: Number(array[j][4]), cumulated: Number(array[j][5]), row_number: course_row++})
 
                     weightPerTerm = weightPerTerm + (Number(array[j][4]))
                 }
 
             }else{break;}
            
            cumulative_sum = Number(array[j][5])
         }
         // Push the last term
         term={acad_year: acad_year.current, semester: semester.current, no_of_units: num_of_units.current, 
            total_weights: weightPerTerm, course_data: courses}
        term_data.push(term);

         let data ={
             student_data: {
                 student_number:array[1][4], 
                 last_name:array[2][4], 
                 first_name:array[3][4], 
                 middle_name:array[4][4],
                 suffix:array[5][4], 
                 degree_program:array[6][4], 
                 
             },
             record_data:{
                 total_units:Number(array[7][4]), 
                 gwa:Number(array[8][4]),
                 cumulative_sum,
                 term_data
             }
         }
        setFullName(data.first_name+" "+data.last_name+ " " + data.degree_program)
        return data
     }
 
     //parses data taken from the text area
     const parseData = async(content,i)=>{
         //separates file content by new line
         if(!content) {
            prompts.push({success: false, message: files[i].name +": Invalid file type/format" })
            return}
         let rows = content.slice(content.indexOf('\n')+1).split('\n');
         if(!rows || rows[0].split(",")[1] !== "STUDENT INFORMATION"){
            prompts.push({success: false, message: files[i].name +": Invalid file type/format" })
            return;
         }
         //returns filecontent in an array of strings splited by ','
         let array = rows.map(row =>{
             //separate each line content by a comma
             return row.split(',');
         })
         return getRecords(array);
     }
 
     ///function to read the read csv file as text
     const submitButton=async(e)=>{
        e.preventDefault();
        const results = await getResults();
        if(results.length > 0){
            results.map(async(result, i) => {
                let data = await parseData(result,i);
                if(data){
                    let stud_mess =  (files[i].name+": "+checkStudentDetails(data.student_data));
                    let rec_mess = (files[i].name+": "+checkRecordDetails(data.record_data));
                    if(checkStudentDetails(data.student_data) !== true){
                        prompts.push({success: false, message: stud_mess}) 
                    }else if (checkRecordDetails(data.record_data) !==true){
                        prompts.push({success: false, message: rec_mess}) 
                    }else(await sendData(data))
                };
            });
        }    
        setShowPrompts(true);
        setFiles([]);
        
     }
 
     //A function call that calls upon a POST API, creating a student. 
     const sendData = async(data)=>{
        fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/student',{
            method:'POST',
            credentials:'include',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                student_data: data.student_data,
                record_data: data.record_data,
                user_id: user.user_id
            })
        }).then((response) => {return response.json()})
        .then(json => {
            if (json.result.session.silentRefresh) {
                setAuth(json.result.session.user, json.result.session.silentRefresh)
            }
            
            const student = data.student_data
            let full_name="";
            {student.suffix!==""? (full_name = student.first_name+" "+ student.middle_name+ " " +student.last_name+ " " + student.suffix + ", "+ student.degree_program+":\n"): (full_name = student.first_name+" " + student.middle_name+ " " +student.last_name+", "+ student.degree_program+":\n")}

            let message =  full_name+json.result.message
            prompts.push({message,success:json.result.success})
         })
     }

     // A function that allows users to remove a file uploaded by a user by mistake
     const removeFile = (index)=>{
        let reducedFile = files.filter((file, fileIndex )=>{
            return fileIndex !==index;
        })

        //sets the state of an array of files to be processed
        setFiles(reducedFile);
     }
 
     return(
     <div>         
         <div className='body'>
             <form>
                 <p className="title">Add Student Records</p>
                 <hr className='add-line'></hr>
                 
                 <label htmlFor="file-acceptor" className='file-accept'> Click here to add students
                 </label>
                 <label htmlFor="file-acceptor" className='plus-sign'> + </label>
                 <input type='file' accept='.csv' id='file-acceptor' multiple="multiple" onChange={setCSVFile}/>
                 <div className='chosen-files'>
                     {files != []? 
                     files.map((file,index) => {
                         return <span key={index} className='file'>
                         <p>{<i className='remove-stud' onClick={()=>removeFile(index)}><IoMdRemoveCircle color='red'/></i>} {file.name}</p>
                         </span>
                     }): ""}
                 </div>
                 <br/><br/>
                 {files.length > 0? <button onClick={submitButton} className="submit-button">Submit</button>:
                 <button disabled={true} className="submit-disabled-button">Submit</button> }
                 <br/><br/>          
             </form>
         </div>
         {showPrompts? <Prompts props={{closePrompts:closePrompts.bind(this), prompts:prompts}}/>: ""}
         <Header/>
         <Menu />
         <Footer/>
     </div>
     );
 }
 
 
 export default Add_Student_Page;