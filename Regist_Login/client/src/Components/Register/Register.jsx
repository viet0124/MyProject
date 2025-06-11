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
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCam, setShowCam] = useState(false);

  // 👉 THAY <RASPI_IP> = IP tĩnh của RasPi
  const RASPI_STREAM_URL = 'http://<RASPI_IP>:5000/stream';
  const RASPI_CAPTURE_URL = 'http://<RASPI_IP>:5000/capture-and-vectorize';
  const RASPI_DELETE_URL = 'http://<RASPI_IP>:5000/delete-vector';
  const BACKEND_CHECK_ID_URL = 'http://localhost:3002/check-id';
  const BACKEND_REGISTER_URL = 'http://localhost:3002/register';

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
      setShowCam(true);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi kiểm tra mã nhân viên.');
    }
  };

  const handleCapture = async () => {
    setLoading(true);
    try {
      const res = await Axios.post(RASPI_CAPTURE_URL, { requestId: id });
      if (res.data && res.data.vectorId && res.data.imageBase64) {
        setVectorId(res.data.vectorId);
        setCapturedImage(`data:image/jpeg;base64,${res.data.imageBase64}`);
      } else {
        alert('Không nhận được dữ liệu từ Raspberry Pi.');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi khi chụp ảnh từ Raspberry Pi.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!vectorId || !capturedImage) {
      alert('Chưa có ảnh để đăng ký!');
      return;
    }

    try {
      const registerRes = await Axios.post(BACKEND_REGISTER_URL, {
        ID: id,
        Email: email,
        Username: username,
        Password: password,
        VectorID: vectorId,
      });

      alert(registerRes.data.message);

      // Reset
      setEmail('');
      setUsername('');
      setPassword('');
      setId('');
      setShowCam(false);
      setCapturedImage(null);
      setVectorId(null);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi đăng ký.');
    }
  };

  const handleCancelOrRetake = async () => {
    if (vectorId) {
      try {
        await Axios.post(RASPI_DELETE_URL, { vectorId });
      } catch (err) {
        console.error('Lỗi khi gửi yêu cầu xoá vector:', err);
      }
    }

    // Reset ảnh và vector
    setCapturedImage(null);
    setVectorId(null);
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
              {!capturedImage ? (
                <>
                  <img src={RASPI_STREAM_URL} alt="Live Camera" width={320} height={240} />
                  <button className="btn" onClick={handleCapture} disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Chụp ảnh'}
                  </button>
                </>
              ) : (
                <>
                  <img src={capturedImage} alt="Ảnh đã chụp" width={320} height={240} />
                  <div className='flex gap'>
                    <button className="btn" onClick={handleRegister}>Đăng ký</button>
                    <button className="btn" onClick={handleCancelOrRetake}>Chụp lại</button>
                    <button className="btn" onClick={() => {
                      handleCancelOrRetake();
                      setShowCam(false);
                    }}>Huỷ</button>
                  </div>
                </>
              )}
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
