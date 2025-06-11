import React, { useState } from 'react';
import './Register.css';
import '../../App.css';

import { Link } from 'react-router-dom';
import Axios from 'axios';

import { FaUserShield } from "react-icons/fa";
import { AiOutlineSwapRight } from "react-icons/ai";
import { BsFillShieldLockFill } from "react-icons/bs";
import { IoIosMail } from "react-icons/io";

import video from '../../LoginAssets/bgvid.mp4';
import icon from '../../LoginAssets/logo.png';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [id, setId] = useState('');
  const [vectorId, setVectorId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCam, setShowCam] = useState(false);

  const RASPI_STREAM_URL = 'http://<RASPI_IP>:5000/stream'; //Thay bằng IP thật
  const RASPI_CAPTURE_URL = 'http://<RASPI_IP>:5000/capture-and-vectorize';
  const BACKEND_CHECK_ID_URL = `http://localhost:3002/check-id`;
  const BACKEND_REGISTER_URL = 'http://localhost:3002/register';

  // 1. Bước đầu: kiểm tra ID
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id || !email || !username || !password) {
      alert('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    try {
      const res = await Axios.get(`${BACKEND_CHECK_ID_URL}/${id}`);
      if (!res.data.exists) {
        alert('Mã nhân viên không tồn tại trong hệ thống!');
        return;
      }

      // Cho phép bật cam nếu ID hợp lệ
      setShowCam(true);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi kiểm tra mã nhân viên.');
    }
  };

  // 2. Sau khi hiện camera và người dùng nhấn "Chụp và Đăng ký"
  const captureAndRegister = async () => {
    setLoading(true);

    try {
      const res = await Axios.post(RASPI_CAPTURE_URL, { requestId: id });

      if (res.data && res.data.vectorId) {
        const vectorId = res.data.vectorId;

        const registerRes = await Axios.post(BACKEND_REGISTER_URL, {
          ID: id,
          Email: email,
          Username: username,
          Password: password,
          VectorID: vectorId,
        });

        alert(registerRes.data.message);

        // Reset form
        setEmail('');
        setUsername('');
        setPassword('');
        setId('');
        setShowCam(false);
      } else {
        alert('Không nhận được vectorId từ Raspberry Pi.');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi khi chụp ảnh hoặc đăng ký.');
    } finally {
      setLoading(false);
    }
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

          {showCam ? (
            <div className="webcamDiv">
              <img src={RASPI_STREAM_URL} alt="Live Camera" width={320} height={240} />
              <button className="btn" onClick={captureAndRegister} disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Chụp và Đăng ký'}
              </button>
            </div>
          ) : (
            <form className='form grid' onSubmit={handleSubmit}>
              <div className="inputDiv">
                <label htmlFor="ID">ID</label>
                <div className="input flex">
                  <BsFillShieldLockFill className='icon' />
                  <input
                    type="text"
                    placeholder='Nhập ID'
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                  />
                </div>
              </div>

              <div className="inputDiv">
                <label htmlFor="Email">Email</label>
                <div className="input flex">
                  <IoIosMail className='icon' />
                  <input
                    type="email"
                    placeholder='Nhập Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="inputDiv">
                <label htmlFor="Username">Username</label>
                <div className="input flex">
                  <FaUserShield className='icon' />
                  <input
                    type="text"
                    placeholder='Nhập Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="inputDiv">
                <label htmlFor="Password">Password</label>
                <div className="input flex">
                  <BsFillShieldLockFill className='icon' />
                  <input
                    type="password"
                    placeholder='Nhập Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type='submit' className='btn flex'>
                <span>Next</span>
                <AiOutlineSwapRight className='icon' />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
