import Header from '../components/Header';
import Menu from '../components/Menu';
import Footer from '../components/Footer'
import '../../css/home.css';
import csvtemplate from '../../template/ASTERIS_TEMPLATE.xlsx';
import UPLB from '../../images/uplb_cas.png';

const Home = () => {

    return(
        <div>
            <div className='home-body'>
                <img className='home-img' src={UPLB} />
                <div className='home-system-name'>
                    <h1 >Automated Student Entry and</h1>
                    <h1 >Record Inspection Software</h1>
                </div>
                {/* ASTERIS description */}
                <p className='web-desc'>
                    ASTERIS is an inhouse technology solution developed to aid in tackling the ever-increasing workload of the <b>UPLB CAS Scholarships, Honors, and Awards Committee</b> [herein defined as the <i>user</i>]—concisely referred to as <b>SHAC</b>.
                    <br /> <br />
                    ASTERIS serves as a digital <b>student general weighted average (GWA) verification interface</b> that provides extensive record inspection features accessible to SHAC members. The software enables collaborative student record processing over a network whilst ensuring that sensitive information security is given utmost priority.
                    
                </p>
                
                 <div className={'card'}>
                    {/* description forthe student record template */}
                    <p className='template-desc'> ASTERIS will only take student record inputs that utilize the template created by the Development Team. Additional information and automation of GWA in the said template allow for a more cohesive recording for each student. You may download the spreadsheet file below and save as a .csv file once done.</p>
                    {/* button for downloading the csv template for student records */}
                    <a href={csvtemplate} className='download-button' download> Download </a>
                </div> 
            </div>
            <Header />  {/* imports the header*/}
            <Menu />    {/* imports the menu*/}
            <Footer/>   {/* imports the footer*/}
        </div>  
    );
}

export default Home;