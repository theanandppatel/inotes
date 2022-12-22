import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './components/Home';
import { About } from './components/About';
import NoteState from './context/notes/NoteState';
import Login from './components/Login';
import Signup from './components/Signup';
import Alert from './components/Alert';
import { useState } from 'react';
import ForgotPassword from './components/ForgotPassword';
import PasswordReset from './components/PasswordReset';

function App() {
  const [alert, setAlert] = useState(null);
  const client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID
  const bknd_host = process.env.REACT_APP_BACKEND_HOST
  const fb_appid = process.env.REACT_APP_FB_APP_ID

  const showAlert = (message, type)=>{
      setAlert({
        msg: message,
        type: type
      })
      setTimeout(() => {
          setAlert(null);
      }, 2000);
  }

  return (
    <>
    <NoteState bknd_host={bknd_host}>
      <BrowserRouter>
        <Navbar showAlert={showAlert}/>
        <Alert alert={alert}/>
        
        <Routes>
          <Route exact path="/" element={<Home showAlert={showAlert}/>}></Route>
          <Route exact path="/about" element={<About/>}></Route>
          <Route exact path="/login" element={<Login showAlert={showAlert} client_id={client_id} fb_appid={fb_appid} bknd_host={bknd_host}/>}></Route>
          <Route exact path="/signup" element={<Signup showAlert={showAlert} client_id={client_id} fb_appid={fb_appid} bknd_host={bknd_host}/>}></Route>
          <Route exact path="/forgotpassword" element={<ForgotPassword showAlert={showAlert} bknd_host={bknd_host}/>}></Route>
          <Route exact path="/forgotpassword/:id/:token" element={<PasswordReset showAlert={showAlert} bknd_host={bknd_host}/>}></Route>
        </Routes>
      </BrowserRouter>
      </NoteState>
    </>
  );
}

export default App;
