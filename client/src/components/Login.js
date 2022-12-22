import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import jwt_decode from "jwt-decode";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import FacebookLogin from 'react-facebook-login';
import { Link } from 'react-router-dom';

const Login = (props) => {

  const [logpassshow, setLogpassshow] = useState("true");
  const [logpassicon, setLogpassicon] = useState("true");
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [alert, setAlert] = useState({ msg: "", visible: "hidden" })
  let navigate = useNavigate();

  useEffect(() => {
    /* global google*/

    const handleCallbackRespnse = async (res) => {
      if (res) {
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
          setTimeout(() => {
            setAlert({ msg: "", visible: "hidden" })
          }, 1500);
        }
      } else {
        props.showAlert("Error occured! Please try again after some time")
      }
    }

    google.accounts.id.initialize({
      client_id: props.client_id,
      callback: handleCallbackRespnse
    });

    google.accounts.id.renderButton(
      document.getElementById("g_id_signin"),
      { theme: "filled_blue", size: "large" }
    )
    // eslint-disable-next-line
  }, [])


  //FACEBOOK SIGN IN START

  const responseFacebook = async (res) => {
    if (res) {
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
    else {
      setAlert({ msg: "Invalid Credentials", visible: "visible" })
      setTimeout(() => {
        setAlert({ msg: "", visible: "hidden" })
      }, 1500);
    }
  }

  //FACEBOOK SIGN IN STOP

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }


  const handleLoginPass = (e) => {
    e.preventDefault();
    setLogpassicon(!logpassicon);
    setLogpassshow(!logpassshow)
  }

  const handleLogin = async (e) => {
    const host = props.bknd_host
    e.preventDefault();
    //API CALL

    const response = await fetch(`${host}/api/auth/login`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: credentials.email, password: credentials.password }) // body datLink type must match "Content-Type" header
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





  return (
    <div style={{ overflowY: "hidden" }}>
      <section className="login-height">
        <h2 className='text-center text-uppercase'>Log In</h2>
        <div className="container-fluid h-custom">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-9 col-lg-6 col-xl-5">
              <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                className="img-fluid" alt="Sample_img" />
            </div>
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1 login-content">
              <form >
                <div className="signin-social flex-row align-items-center justify-content-center justify-content-lg-start mt-4">
                  <FacebookLogin
                    appId={props.fb_appid}
                    autoLoad={false}
                    fields="name,email,picture"
                    // onClick={componentClicked}
                    callback={responseFacebook}
                    cssClass="my-facebook-button-class"
                    icon="fab fa-facebook"
                  />
                  <div id="g_id_signin" className='g_id_signin social-google'> </div>
                </div>

                <div className="divider d-flex align-items-center my-4">
                  <p className="text-center fw-bold mx-3 mb-0 text-uppercase">Or</p>
                </div>

                <div className="error">
                  <h4 className='text-center' style={{ color: "red" }} visible={alert.visible}>{alert.msg}</h4>
                </div>

                <div className="form-outline mb-4">
                  <input type="email" id="email" className="form-control form-control-lg"
                    placeholder="Email address" name="email" onChange={onChange} value={credentials.email} required />
                </div>


                <div className="form-outline mb-3 d-flex pass_show" style={{ justifyContent: "end" }}>
                  <input type={logpassshow ? "password" : "text"} id="password" className="form-control form-control-lg"
                    placeholder="Password" name="password" onChange={onChange} value={credentials.password} required />
                  <FontAwesomeIcon className='my-2' icon={logpassicon ? faEyeSlash : faEye} style={{ position: "absolute", marginRight: "15px", paddingTop: "7px" }} onClick={handleLoginPass} />
                </div>

                <div className="d-flex justify-content-between align-items-center">

                  <div className="form-check mb-0">
                    <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
                    <label className="form-check-label" htmlFor="form2Example3">
                      Remember me
                    </label>
                  </div>
                  <Link to="/forgotpassword" className="text-body" style={{ textDecoration: "none" }}>Forgot password?</Link>
                </div>

                <div className="end-login text-center text-lg-start mt-4 pt-2">
                  <button type="button" className="btn btn-primary text-uppercase btn-md shadow  rounded"
                    style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem", fontWeight: "bold", height: "40px", marginBottom: "20px" }} onClick={handleLogin} >Login</button>
                  <p className="small fw-bold mt-2 pt-1 mb-0">Don't have an account? <Link to="/signup"
                    className="link-danger">Register</Link></p>
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

export default Login