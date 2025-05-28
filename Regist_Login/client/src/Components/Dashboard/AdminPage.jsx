import React, { useState } from 'react'

import '../../App.css'
import SideBar from './DB_Components/SideBar/SideBar'
import Body from './DB_Components/Body/Body'
import TopBar from './DB_Components/TopBar/TopBar'

import List from './DB_Components/ForUser/List'
import Update from './DB_Components/ForUser/Update'
import Chart from './DB_Components/ForUser/Chart'


const AdminPage = () => {
  const [activePage, setActivePage] = useState('employee')

  const renderPage = () => {
    switch (activePage) {
      case 'employee':
        return <List />;
      case 'statistics':
        return <Chart />;
      case 'edit':
        return <Update />;
      default:
        return null;
    }
  }

  return (
    <div className='dashboard flex'>
      <div className="dashboardcontainer flex">
        <div className="side flex">
          <SideBar />       
        </div>
        <div className="content flex">
          <TopBar />
          <div className="body">
            <div className="container">
              <div className="top">
                <h1>Admin Page</h1>
                <button type="button" onClick={() => setActivePage('employee')}>Danh Sách Nhân Viên</button>
                <button type="button" onClick={() => setActivePage('statistics')}>Thống Kê</button>
                <button type="button" onClick={() => setActivePage('edit')}>Chỉnh Sửa</button>
              </div>
              <div className="mid">
                {renderPage()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage;
