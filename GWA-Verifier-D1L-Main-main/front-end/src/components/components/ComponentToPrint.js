import React from "react";
import '../../css/print-page.css'
import UPLB from '../../images/uplb.png';
import CAS from '../../images/CAS.png'
const {REACT_APP_HOST_IP} = process.env
class ComponentToPrint extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            user: this.props.user,
            acad_year1: "",
            acad_year2:"",
            semester:""
        }
    }

    componentDidMount(){
        fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/student/term",
        {
            method: "GET",
            credentials:'include'
        })
        .then(response => {return response.json()})
        .then(json=>{
            if(json.result.success){
                const acad_year = json.result.output.acad_year.split("/")
                const sem = json.result.output.semester
                this.setState({
                    acad_year1: "20"+acad_year[0],
                    acad_year2: "20"+acad_year[1],
                })
                if(sem === "I") this.setState({semester: "First Semester"})
                else if(sem === "II") this.setState({semester: "Second Semester"})
                else this.setState({semester: "Midyear"})
            }          
        })
    }
   
    render(){
        console.log(this.props.record)
        return(
            <div className='view-print-preview'>
                <img src = {UPLB} className = "univ-logo" />
                <img src = {CAS} className = "college-logo" />
                <h2 className="summary-title">Prospective Candidates for Graduation </h2>
                <p  className="term-details">{this.state.semester} A.Y. {this.state.acad_year1}-{this.state.acad_year2}</p>
                <span className="system-watermark">ASTERIS CAS - UPLB &nbsp;&nbsp;&nbsp;&nbsp;{new Date().toLocaleString()}&nbsp;&nbsp;&nbsp;&nbsp;
                {this.state.user.first_name} {this.state.user.last_name} ({this.state.user.user_role})</span> 
                <p className="filter">{this.props.view != "ALL" && this.props.view !=""? <span>{this.props.view}</span> :"All CAS Students"} 
                &nbsp;&nbsp;-&nbsp;&nbsp;{this.props.order == "gwa"? <span>GWA (ascending)</span>:"Alphabetical"}</p> 
                <span className="watermark-textt">ASTERIS</span>
                 <span className="watermark-text">ASTERIS</span>
                <div className="watermark"></div>
                <br />
            {this.props.record != undefined ? 
                <table className='view-print-table'>
                    
                    
                    <thead className='view-print-thead'>
                        <tr>
                            <th className='view-print-cell-header'>NO.</th>
                            <th className='view-print-cell-header'>NAME</th>
                            <th className='view-print-cell-header'>DEGREE PROGRAM</th>
                            <th className='view-print-cell-header'>GWA</th>
                            <th className='view-print-cell-header'>LATIN HONOR</th>
                        </tr>
                    </thead>
                    <tbody className = 'view-print-tbody'>
                        
                        {this.props.record.map((rec, i) => {
                            return (
                                <tr className='view-print-element' key = {i}>
                                    <td className='gwa-cell' >{i+1}</td>
                                    <td className='name-cell' >{rec.last_name}, {rec.first_name}{rec.middle_name? ', '+rec.middle_name:""}
                                    {rec.suffix ? ', ' + rec.suffix : ''}</td>
                                    <td className='degree-cell'>{rec.degree_program}</td>
                                    <td className='gwa-cell'>{rec.gwa}</td>
                                    <td className='latin-cell'>{rec.latin_honor}</td>
                                </tr>                              
                            );
                        })}
                    </tbody>
                </table>:
                <div>{this.props.message}</div>}
            </div>
        )
    }
}
export default ComponentToPrint;