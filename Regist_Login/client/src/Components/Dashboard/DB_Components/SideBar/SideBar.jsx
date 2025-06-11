import React from 'react'

import icon from './../../Assets/logo.png'
import './../../../../App.css'
import './../SideBar/SideBar.css'

import { Link, useNavigate } from 'react-router-dom'

// Icons
import { MdSpaceDashboard } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { IoCloseCircle } from "react-icons/io5";

const SideBar = () => {
  return (
    <div className='sidebar flex'>
        <div className="SBContainer flex">
            <div className="header">
                <img src={icon} alt="Logo Image" />
            </div>

            <div className="body">
                <div className="section">
                    <p>Menu</p>
                    <ul className='setting'>
                        <li className='listItem'>
                            <MdSpaceDashboard className='icon' />
                            <a href="./">Trang chủ</a>
                        </li>
                        <li className='listItem'>
                            <MdSpaceDashboard className='icon' />
                            <a href="./">Thông tin</a>
                        </li>
                        <li className='listItem'>
                            <MdSpaceDashboard className='icon' />
                            <a href="./">Sự kiện</a>
                        </li>
                    </ul>
                </div>
                <div className="section">
                    <p>Setting</p>
                    <ul className='setting'>
                        <li className='listItem'>
                            <MdSpaceDashboard className='icon' />
                            <a href="./">Thông báo</a>
                        </li>
                        <li className='listItem'>
                            <MdSpaceDashboard className='icon' />
                            <a href="./">Cài đặt chung</a>
                        </li>
                        
                    </ul>
                </div>
                <Link to= '/' >
                    <button className='btn flex' >
                        <span>Logout</span>
                        <CiLogout className='icon'/>
                    </button>
                </Link> 
                <div className="helpcenter flex">
                    <IoMdHelpCircleOutline className='icon'/>
                    <span>Help Center</span>
                    <br />
                    If you have any question, please contact us at <br />
                    <a className='abc' href="/">Trung Tam Cham Soc Khach Hang</a>
                </div>
                
            </div>
            
        </div>
        <IoCloseCircle className='closeIcon'/>
    </div>
  )
}

export default SideBar