import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RequireAuth from './components/components/RequireAuth';
import Login  from './components/pages/Login';
import Home from './components/pages/Home';
import Add_Student from './components/pages/Add_Student_Page'
import View_Students from './components/pages/View_Students'
import View_Student_Details from './components/pages/View_Student_Details'
import Add_User from './components/pages/Add_User_Page'
import View_User from './components/pages/View_Users_Page'
import View_Logs from './components/pages/View_Logs'
import View_Summary from './components/pages/View_Summary'
import User_Profile from './components/pages/UserProfile'
import My_Profile from './components/pages/MyProfile'
import ForgotPassword from './components/pages/ForgotPassword';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Login />} />
        <Route exact path='/home' element={ <RequireAuth children={ <Home /> } /> } />
        <Route exact path='/student/new' element={<RequireAuth children={<Add_Student/>}/>}/>
        <Route exact path='/students' element={<RequireAuth children={<View_Students/>}/>}/>
        <Route exact path='/student/:id' element={<RequireAuth children={<View_Student_Details/>}/>}/>
        <Route path='/summary' element={<RequireAuth children={<View_Summary/>}/>}/>
        <Route path='/users/new' element={<RequireAuth children={<Add_User/>}/>}/>
        <Route path='/users' element={<RequireAuth children={<View_User/>}/>}/>
        <Route path='/logs' element={<RequireAuth children={<View_Logs/>}/>}/>
        <Route path='/user/:id' element={<RequireAuth children={<User_Profile/>}/>}/>
        <Route path='/profile' element={<RequireAuth children={<My_Profile/>}/>}/>
        <Route path='/user/identify' element={<ForgotPassword/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
