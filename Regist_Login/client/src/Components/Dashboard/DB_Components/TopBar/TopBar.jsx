import React from 'react'
import './../../../../App.css'
import './TopBar.css'

//icons
import { IoSearchSharp } from "react-icons/io5";
import { IoNotificationsSharp } from "react-icons/io5";
import { FaUserTie } from "react-icons/fa";

const TopBar = () => {
  return (
    <div className='topbar flex'>
        <div className="topbarcontainer flex">
            <div className="search flex">
                {/* <input type="text" id='search' placeholder='Search...' />
                <IoSearchSharp className='icon'/> */}
            </div>
            <div className="user flex">
                <div className='notification'>
                    <IoNotificationsSharp className='icon'/>
                </div>
                <div className="account">
                    <FaUserTie className='icon'/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default TopBar