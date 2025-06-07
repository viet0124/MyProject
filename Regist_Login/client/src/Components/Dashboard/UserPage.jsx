import React from 'react'

import '../../App.css'
import SideBar from './DB_Components/SideBar/SideBar'
import History from './DB_Components/ForUser/History'
import TopBar from './DB_Components/TopBar/TopBar'

import { Link } from 'react-router-dom'

const UserPage = () => {
  return (
    <div className='userpage flex'>
      <div className="usercontainer flex">
        <div className="side flex">
          <SideBar />       
        </div>
        <div className="content flex">
          <TopBar />
          <History />
        </div>
      </div>
      
    </div>
  )
}

export default UserPage