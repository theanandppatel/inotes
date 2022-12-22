import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { useNavigate,useParams } from 'react-router-dom'


const PasswordReset = (props) => {
    const [passwordShown, setPasswordShown] = useState("true");
    const [cpasswordShown, setCPasswordShown] = useState("true");
    const [passwordicon, setPasswordIcon] = useState("true");
    const [cpasswordicon, setCPasswordIcon] = useState("true");
    const [resetcred, setResetcred] = useState({ fpass: "", fcpass: "" })
    const [alert, setAlert] = useState({ msg: "", visible: "hidden" })
    const param = useParams();

    let navigate = useNavigate();

    const handleShowpass = (e) => {
        e.preventDefault();
        setPasswordIcon(!passwordicon);
        setPasswordShown(!passwordShown)
    }
    const handleCShowpass = (e) => {
        e.preventDefault();
        setCPasswordIcon(!cpasswordicon);
        setCPasswordShown(!cpasswordShown)
    }

    const onChange = (e) => {
        setResetcred({ ...resetcred, [e.target.name]: e.target.value })
    }

    const handleResetPass = async (e) => {
        const host = props.bknd_host
        e.preventDefault();
        //API CALL
        console.log(param.id,param.token);
        const response = await fetch(`${host}/api/auth/${param.id}/${param.token}`, {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ password: resetcred.fcpass }) // body datLink type must match "Content-Type" header
        });
        const json = await response.json()
        console.log(json)
    
        if (json.success === true) {
          props.showAlert(json.message,"success")
          navigate("/login")
        }else{
          setAlert({msg:"Invalid Credentials",visible:"visible"})
          setTimeout(() => {
            setAlert({visible:"hidden"})
          }, 3000);
          
        }
      }

    return (
        <div>
            <div className="container">
                <h1 className='text-center'>Reset Your Password</h1>
                <div className="row" style={{ justifyContent: "center", marginTop: "50px" }}>
                    <div className="col-sm-4">

                        <label className='mt-4'>New Password</label>
                        <div className="form-group pass_show d-flex my-2" style={{ justifyContent: "end" }}>
                            <input type={passwordShown ? "password" : "text"} id="fpass" className="form-control" placeholder="New Password" name='fpass' onChange={onChange} value={resetcred.fpass} required />
                            <FontAwesomeIcon className='my-2' icon={passwordicon ? faEyeSlash : faEye} style={{ position: "absolute", marginRight: "10px" }} onClick={handleShowpass} />
                        </div>
                        <label className='mt-4'>Confirm Password</label>
                        <div className="form-group pass_show d-flex my-2" style={{ justifyContent: "end" }}>
                            <input type={cpasswordShown ? "password" : "text"} id="fcpass" className="form-control" placeholder="Confirm Password" name='fcpass' onChange={onChange} value={resetcred.fcpass} required />
                            <FontAwesomeIcon className='my-2' icon={cpasswordicon ? faEyeSlash : faEye} style={{ position: "absolute", marginRight: "10px" }} onClick={handleCShowpass} />
                        </div>
                        <p className='mx-2' style={{ color: "red", fontWeight: "bold", visibility: alert.visible }} >{alert.msg}</p>
                    </div>


                </div>
                <div className="text-center my-5" >
                    <button className="btn btn-primary" onClick={handleResetPass}>Reset Password</button>
                </div>
            </div>
        </div>
    )
}

export default PasswordReset
