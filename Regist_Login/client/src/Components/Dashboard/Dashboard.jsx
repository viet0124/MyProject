import React from 'react'

import '../../App.css'
import SideBar from './DB_Components/SideBar/SideBar'
import Body from './DB_Components/Body/Body'
import TopBar from './DB_Components/TopBar/TopBar'

import { Link } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className='dashboard flex'>
      <div className="dashboardcontainer flex">
        <div className="side flex">
          <SideBar />       
        </div>
        <div className="content flex">
          
          <TopBar />
          
          <Body />
        </div>
      </div>
      
    </div>
  )
}

export default Dashboard