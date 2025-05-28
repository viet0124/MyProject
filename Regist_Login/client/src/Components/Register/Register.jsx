import React from 'react'
import './Register.css'
import '../../App.css'

import { Link} from 'react-router-dom'
import Axios from 'axios'
import { useState } from 'react';

// Icons
import { FaUserShield } from "react-icons/fa";
import { AiOutlineSwapRight } from "react-icons/ai";
import { BsFillShieldLockFill } from "react-icons/bs";
import { IoIosMail } from "react-icons/io";


import video from '../../LoginAssets/bgvid.mp4'
import icon from '../../LoginAssets/logo.png'
const Register = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Function to handle form submission
  const createUser = (event) => {
    Axios.post('http://localhost:3002/register', {
      Email: email,
      Username: username,
      Password: password
    }).then(() => {
      if (response.data.message) {
        alert(response.data.message);
      } else {
        alert('User registered successfully!');
      }
    })
  }
  return (
    <div className='registerpage flex'>
      <div className='container flex'>
        <div className="videoDiv">
          <video src={video} autoPlay muted loop></video>
          <div className="textDiv">
            <h2 className='title'>PBL 5</h2>
            <p>7th group</p>
          </div>
          <div className="footerDiv flex">
            <span className="text">Have account?</span>
            <Link to='/'>
              <button className='btn'>Login</button>
            </Link>
          </div>
        </div>

        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={icon} alt="Logo Image" />
            <h3>Hello</h3>
          </div>
          <form action="" className='form grid'>
            <div className="inputDiv">
              <label htmlFor="Email">Email</label>
              <div className="input flex">
                <IoIosMail className='icon'/>
                <input type="email" id="email" placeholder='Enter Email' 
                onChange={(event)=>{
                  setEmail(event.target.value)
                }}/>
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="Username">Username</label>
              <div className="input flex">
                <FaUserShield className='icon' />
                <input type="text" id='username' placeholder='Enter Username' 
                onChange={(event)=>{
                  setUsername(event.target.value)
                }}/>
                
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="Password">Password</label>
              <div className="input flex">
                <BsFillShieldLockFill className='icon' />
                <input type="password" id='password' placeholder='Enter Password' 
                onChange={(event)=>{
                  setPassword(event.target.value)
                }}
                />
              </div>
            </div>
            <button type='submit' className='btn flex' onClick={createUser}>
              <span>Register</span>
              <AiOutlineSwapRight className='icon' />
            </button>
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

export default Register