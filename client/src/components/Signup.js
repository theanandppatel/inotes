import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import jwt_decode from "jwt-decode";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FacebookLogin from 'react-facebook-login';

const Signup = (props) => {

  const [passwordshow, setPasswordshow] = useState("true");
  const [cpasswordshow, setCPasswordshow] = useState("true");
  const [spasswordicon, setSPasswordicon] = useState("true");
  const [cspasswordicon, setCSPasswordicon] = useState("true");
  const [signcred, setSigncred] = useState({ fname: "", lname: "", signemail: "", signpassword: "", confirmpass: "" })
  const [alert, setAlert] = useState({ msg: "", visible: "hidden" })

  let navigate = useNavigate();

  const handleSigninPass = (e) => {
    e.preventDefault();
    setSPasswordicon(!spasswordicon);
    setPasswordshow(!passwordshow)
}
const handleCSigninPass = (e) => {
    e.preventDefault();
    setCSPasswordicon(!cspasswordicon);
    setCPasswordshow(!cpasswordshow)
}

  //GOOGLE SIGN IN START
  useEffect(() => {
    /* global google*/

    const handleCallbackRespnse = async (res) => {
      var decoded_res = jwt_decode(res.credential)
      const gpassword =
        Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
      const host = props.bknd_host;
      //API CALL

      const response = await fetch(`${host}/api/auth/googlesignin`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: decoded_res.name, email: decoded_res.email, password: gpassword }) // body datLink type must match "Content-Type" header
      });
      const json = await response.json()

      if (json.success) {
        localStorage.setItem('token', json.authToken)
        props.showAlert("You are successfully logged in", "success")
        navigate("/")
      } else {
        setAlert({ msg: "Invalid Credentials", visible: "visible" })
      }
    }

    google.accounts.id.initialize({
      client_id: props.client_id,
      callback: handleCallbackRespnse
    });

    google.accounts.id.renderButton(
      document.getElementById("g_id_signup"),
      { theme: "filled_blue", size: "large", text: "signup_with" }
    )
    // eslint-disable-next-line
  }, [])

  //GOOGLE SIGN IN STOP

  //FACEBOOK SIGN IN START

  const responseFacebook = async (res) => {
    const fbpassword =
      Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    const host = props.bknd_host;
    //API CALL

    const response = await fetch(`${host}/api/auth/facebooksignin`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: res.name, email: res.email, password: fbpassword }) // body datLink type must match "Content-Type" header
    });
    const json = await response.json()

    if (json.success) {
      localStorage.setItem('token', json.authToken)
      props.showAlert("You are successfully logged in", "success")
      navigate("/")
    } else {
      setAlert({ msg: "Invalid Credentials", visible: "visible" })
      setTimeout(() => {
        setAlert({ msg: "", visible: "hidden" })
      }, 1500);
    }
  }

  //FACEBOOK SIGN IN STOP

  const onChange = (e) => {
    setSigncred({ ...signcred, [e.target.name]: e.target.value })
  }

  const handleSignin = async (e) => {
    const host = props.bknd_host
    e.preventDefault();
    //API CALL

    const fullname = signcred.fname + " " + signcred.lname;

    if (signcred.signpassword === signcred.confirmpass && signcred.signpassword.length > 4 && signcred.confirmpass.length > 4) {

      const response = await fetch(`${host}/api/auth/createuser`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: fullname, email: signcred.signemail, password: signcred.confirmpass }) // body datLink type must match "Content-Type" header
      });
      const json = await response.json()

      if (json.success) {
        navigate("/login")
        props.showAlert("Account Created Successfully", "success")
      }

    }
    else if (signcred.signpassword.length < 5 || signcred.confirmpass.length < 5) {
      setAlert({ msg: "Password should be atleast 5 character", visible: "visible" })
      setTimeout(() => {
        setAlert({msg:"",visible:"hidden"})
      }, 1500);
    }
    else {
      setAlert({ msg: "Both Password shold be same", visible: "visible" })
    }

  }
  return (
    <div>
      <section className="main-signup">
        <div className="container h-100">
          <div className="row d-flex align-items-center justify-content-center h-100">
            <div className="col-md-8 col-lg-7 col-xl-6">
              <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                className="img-fluid" alt="Phone_img" />
            </div>
            <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">

              <div className="mb-3 signup-heading">
                <h2 className='text-center text-uppercase'>Sign Up</h2>
              </div>
              <form>
                <div className="start-point row d-flex mb-4">
                  <div className="form-outline col">
                    <input type="text" id="fname" className="form-control form-control-lg" name='fname' placeholder='First Name' onChange={onChange} value={signcred.fname} required />
                  </div>
                  <div className="form-outline col">
                    <input type="text" id="lname" className="form-control form-control-lg" name='lname' placeholder='Last Name' onChange={onChange} value={signcred.lname} />
                  </div>
                </div>
                <div className="form-outline mb-4">
                  <input type="email" id="signemail" className="form-control form-control-lg" name='signemail' placeholder='Email address' onChange={onChange} value={signcred.signemail} />
                </div>


                <div className="form-outline mb-4 d-flex pass_show" style={{justifyContent:"end"}}>
                  <input type={passwordshow ? "password" : "text"} id="signpassword" className="form-control form-control-lg" name='signpassword' placeholder='Password' onChange={onChange} value={signcred.signpassword} />
                  <FontAwesomeIcon className='my-2' icon={spasswordicon ? faEyeSlash : faEye} style={{ position: "absolute", marginRight: "15px", paddingTop: "7px" }} onClick={handleSigninPass} />
                </div>

                <div className="form-outline mb-2 d-flex pass_show" style={{justifyContent:"end"}}>
                  <input type={cpasswordshow ? "password" : "text"} id="confirmpass" className="form-control form-control-lg" name='confirmpass' placeholder='Confirm Password' onChange={onChange} value={signcred.confirmpass} />
                  <FontAwesomeIcon className='my-2' icon={cspasswordicon ? faEyeSlash : faEye} style={{ position: "absolute", marginRight: "15px", paddingTop: "7px" }} onClick={handleCSigninPass} />
                </div>
                 <p className='mx-2 sign-alert' style={{color: "red", fontWeight: "bold", visibility: alert.visible}} >{alert.msg}</p>

                <button type="submit" className="btn btn-primary d-flex text-uppercase shadow p-3 mb-2 rounded" style={{ justifyContent: "center", width: "100%", fontSize: "17px", height: "46px", alignItems: "center",marginTop:"40px"}} onClick={handleSignin}>Sign up</button>

                <div className="divider d-flex align-items-center my-4">
                  <p className="text-center fw-bold mx-3 mb-0 text-muted">OR</p>
                </div>

                <div className="signup-social flex-row align-items-center justify-content-center justify-content-lg-start">
                <FacebookLogin
                    appId={props.fb_appid}
                    autoLoad={false}
                    fields="name,email,picture"
                    // onClick={componentClicked}
                    callback={responseFacebook}
                    cssClass="my-facebook-button-class"
                    icon="fab fa-facebook"
                  />
                  <div id="g_id_signup" className='g_id_signup col social-google' style={{marginLeft:"20px"}}> </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div
          className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-dark" style={{ marginTop: "0px" }}>
          <div className="text-white mb-3 mb-md-0">
            Copyright © 2022. All rights reserved.
          </div>
          <div className="text-white mb-3 mb-md-0">
            FSD PROJECT
          </div>

          {/* <div>
            <a href="https://www.facebook.com/theanandppatel" rel="noreferrer" target="_blank" className="text-white me-4">
              <i to="google.com" className="fab fa-facebook-f" target="_blank"></i>
            </a>
            <a href="https://twitter.com/AnandPatel95374" rel="noreferrer" target="_blank" className="text-white me-4">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="mailto:anandpatel95374@gmail.com" rel="noreferrer" target="_blank" className="text-white me-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-fill" viewBox="0 0 16 16">
                <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/theanandppatel/" rel="noreferrer" target="_blank" className="text-white">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div> */}
        </div>
      </section>
    </div>
  )
}

export default Signup