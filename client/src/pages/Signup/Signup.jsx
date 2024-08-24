import axios from "axios"
import "./Signup.css"
import { useContext, useState } from "react"
// import { ReactContext } from "../../ReactContext/Context"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { ReactContext } from "../../ReactContext/Context"

const Signup = () => {
  const [details, setDetails] = useState({
    name: "",
    email: "",
    password: "",
    role:""
  })

  const { url } = useContext(ReactContext)
  const navigate = useNavigate()

  const onChangeInput = (e) => {
    const { id, value } = e.target
    setDetails({
      ...details,
      [id]: value
    });
  }


  const onClickLogin = () => {
    navigate("/login")
  }

  const onSubmitDetails = async (e) => {
    e.preventDefault()

    await axios.post(`${url}/auth/register`, details)
      .then(response => {
        // console.log(response)
        if (response.data.status === 200 || 201) {
          navigate("/login")
          toast.success(response.data.message)
        }
      }).catch(err => {
        console.log(err)
        toast.error(err.response.data.message)
      })
    setDetails({
      email: "",
      password: "",
      name: "",
      role:""
    })
  }


  return (
    <div className="signup-container">
      <h1>SignUp</h1>
      <form action="" onSubmit={onSubmitDetails}  className="form-container">
        <div className="input-container">
          <label htmlFor="name">Username</label>
          <input type="text" id="name" value={details.name} placeholder="Username" onChange={onChangeInput} />
        </div>
        <div className="input-container">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={details.email} placeholder="Email" onChange={onChangeInput} />
        </div>
        <div className="input-container">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Password" value={details.password} onChange={onChangeInput} />
        </div>
        <div className="input-container">
          <label htmlFor="role">Role</label>
          <input type="text" id="role" placeholder="Enter your role.." value={details.role} onChange={onChangeInput} />
        </div>
        <div className="btn-container">
          <button type="submit">Submit</button>
          <div className="account-link-container">
            <p>Already have an account?</p>
            <p onClick={onClickLogin} className="account-link">Go to Login</p>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Signup