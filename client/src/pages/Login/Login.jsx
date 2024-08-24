import { useContext, useState} from "react";
import "./Login.css"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { ReactContext } from "../../ReactContext/Context";
import { toast } from "react-toastify";
import cookies from "js-cookie"

const Login=()=>{
const navigate = useNavigate()
  const [details, setDetails] = useState({
    email: '',
    password: ''
  });
  const {url,setToken } = useContext(ReactContext)

  const onChangeInput = (e) => {
    const { id, value } = e.target;
    setDetails({
      ...details,
      [id]: value
    });
  };

  const onSubmitSuccess = (token) => {
    cookies.set('token', token, { expires: 30});
    navigate('/');
  };

  const onSubmitDetails = async (e) => {
    e.preventDefault();

    await axios.post(`${url}/auth/login`, details)
      .then((response) => {
        if (response.status === 200) {
          // console.log(response)
          localStorage.setItem('user', JSON.stringify(response.data.data));
          // setToken(response.data.jwtToken);
          toast.success(response.data.message)
          onSubmitSuccess(response.data.token);
          // setUserData(response.data.data.user);
        }
      }).catch((err) => {
        toast.error(err.response.data.message)
        console.log(err)
      });
    setDetails({
      email: '',
      password: ''
    });
  };

  const onClickCreateAccount = () => {
    navigate('/register');
  };
  return(
    <div className='login-container'>
      <h1>Login</h1>
      <form  className='form-container' onSubmit={onSubmitDetails}>
        <div className='input-container'>
          <label htmlFor='email'>Email</label>
          <input type='text' id='email' value={details.email} placeholder='Email' onChange={onChangeInput} />
        </div>
        <div className='input-container'>
          <label htmlFor='password'>Password</label>
          <input type='password' id='password' placeholder='Password' value={details.password} onChange={onChangeInput} />
        </div>
        <div className='btn-container'>
          <button type='submit'>Submit</button>
          <div className='account-link-container'>
            <p>Don't have an Account? </p>
            <p onClick={onClickCreateAccount} className='account-link'>Create An Account</p>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Login