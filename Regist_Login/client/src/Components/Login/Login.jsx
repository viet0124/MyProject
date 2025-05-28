import React from 'react'
import Axios from 'axios'
import { useState } from 'react';
import './Login.css'
import '../../App.css'

import { Link, useNavigate } from 'react-router-dom'

// Icons
import { FaUserShield } from "react-icons/fa";
import { AiOutlineSwapRight } from "react-icons/ai";
import { BsFillShieldLockFill } from "react-icons/bs";
import { CiLogin } from "react-icons/ci";


import video from '../../LoginAssets/bgvid.mp4'
import icon from '../../LoginAssets/logo.png'
const Login = () => {
  // State variables to hold form data
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  // Function to handle form submission
  const handleLogin = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    Axios.post('http://localhost:3002/login', {
      LoginUsername: username,
      LoginPassword: password
    }).then((response) => {
      console.log()
      if (response.data.message) {
        alert(response.data.message);
        navigate('/'); // Redirect to the login page
      } else {
        alert('Login successful!');
        const user = response.data.user;

        localStorage.setItem('ten_dang_nhap', user.ten_dang_nhap);
        localStorage.setItem('vai_tro', user.vai_tro);

        if (user.vai_tro === 'admin') {
          navigate('/adminpage') // chuyển đến trang dành cho admin
        } else {
          navigate('/userpage') // chuyển đến trang dành cho user
        }
      }
    })
  }  
  return (
    <div className='loginpage flex'>
      <div className='container flex'>
        <div className="videoDiv">
          <video src={video} autoPlay muted loop></video>
          <div className="textDiv">
            <h2 className='title'>PBL 5</h2>
            <p>7th group</p>
          </div>
          <div className="footerDiv flex">
            <span className="text">Don't have account?</span>
            <Link to='/register'>
              <button className='btn'>Sign Up</button>
            </Link>
          </div>
        </div>

        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={icon} alt="Logo Image" />
            <h3>Welcome Back!</h3>
          </div>
          <form action="" className='form grid'>
            <span className='showMessage'>Login status will go here</span>
            <div className="inputDiv">
              <label htmlFor="username">Username</label>
              <div className="input flex">
                <FaUserShield className='icon' />
                <input type="text" id='username' placeholder='Enter Username' 
                onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div className="inputDiv">
              <label htmlFor="password">Password</label>
              <div className="input flex">
                <BsFillShieldLockFill className='icon' />
                <input type="password" id='password' placeholder='Enter Password' 
                onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <button type='submit' className='btn flex' onClick={handleLogin}>
              <span>Login</span>
              <CiLogin className='icon'/>
            </button>
            <a href="/dashboard">dash</a>
            <span className='forgotPassword'>
              Forgot Password?  
              <a href=""> Click Here!</a>
            </span>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Login