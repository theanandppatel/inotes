import React,{useState} from 'react'

const ForgotPassword = (props) => {
  const [forgotmail, setForgotmail] = useState({ forgotemail: ""})

  const onChange = (e) => {
    setForgotmail({ ...forgotmail, [e.target.name]: e.target.value })
  }

  const handleForgot = async (e) => {
    const host = props.bknd_host
    e.preventDefault();
    //API CALL

    const response = await fetch(`${host}/api/auth/forgotpassword`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: forgotmail.forgotemail }) // body datLink type must match "Content-Type" header
    });

    const json = await response.json()

    if(json.success){
      props.showAlert(json.message,"success")
    }else{
      props.showAlert(json.message,"danger")
    }
  }
  return (
    <div>
    <div className="container">
    <h1 className='text-center ' style={{marginTop:"60px"}}>Forgot Password</h1>
      <form>
        <div className="form-group" style={{marginTop:"30px"}}>
          <label htmlFor="forgotemail" style={{fontWeight:"bold",fontSize:"18px"}}>Email address</label>
          <input type="email" className="form-control my-2" id="forgotemail" aria-describedby="emailHelp" name='forgotemail' placeholder="Enter email" onChange={onChange}/>
        </div>
        <button type="submit" className="btn btn-primary my-3 mt-5 d-flex" style={{margin:"auto"}} onClick={handleForgot}>Send Reset Password Link</button>
      </form>
      </div>
    </div>
  )
}

export default ForgotPassword
