import React, { useState, useRef } from 'react';
import './Register.css';
import '../../App.css';

import { Link } from 'react-router-dom';
import Axios from 'axios';

import { FaUserShield } from "react-icons/fa";
import { AiOutlineSwapRight } from "react-icons/ai";
import { BsFillShieldLockFill } from "react-icons/bs";
import { IoIosMail } from "react-icons/io";

import Webcam from 'react-webcam';
import video from '../../LoginAssets/bgvid.mp4';
import icon from '../../LoginAssets/logo.png';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showWebcam, setShowWebcam] = useState(false);
  const webcamRef = useRef(null);

  const captureAndRegister = () => {
    const imageSrc = webcamRef.current.getScreenshot();

    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const formData = new FormData();
        formData.append('Email', email);
        formData.append('Username', username);
        formData.append('Password', password);
        formData.append('image', blob, 'face.jpg');

        Axios.post('http://localhost:3002/register', formData)
          .then((response) => {
            alert(response.data.message);
            setShowWebcam(false);
            setEmail('');
            setUsername('');
            setPassword('');
          })
          .catch(err => {
            console.error(err);
            alert("Đăng ký thất bại.");
          });
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !username || !password) {
      alert('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    setShowWebcam(true);
  };

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
            <Link to='/'><button className='btn'>Login</button></Link>
          </div>
        </div>

        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={icon} alt="Logo" />
            <h3>Hello</h3>
          </div>

          {showWebcam ? (
            <div className="webcamDiv">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={320}
                height={240}
              />
              <button className="btn" onClick={captureAndRegister}>Chụp và Đăng ký</button>
            </div>
          ) : (
            <form className='form grid' onSubmit={handleSubmit}>
              <div className="inputDiv">
                <label htmlFor="Email">Email</label>
                <div className="input flex">
                  <IoIosMail className='icon'/>
                  <input type="email" placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="inputDiv">
                <label htmlFor="Username">Username</label>
                <div className="input flex">
                  <FaUserShield className='icon'/>
                  <input type="text" placeholder='Enter Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
              </div>
              <div className="inputDiv">
                <label htmlFor="Password">Password</label>
                <div className="input flex">
                  <BsFillShieldLockFill className='icon'/>
                  <input type="password" placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>
              <button type='submit' className='btn flex'>
                <span>Tiếp tục</span>
                <AiOutlineSwapRight className='icon'/>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
