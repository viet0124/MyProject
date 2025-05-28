import './App.css'
import Dashboard from './Components/Dashboard/Dashboard'
import UserPage from './Components/Dashboard/UserPage'
import AdminPage from './Components/Dashboard/AdminPage'
import Register from './Components/Register/Register'
import Login from './Components/Login/Login'

//import React react router dom
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
//create a router
const router = createBrowserRouter([
  {
    path: '/',
    element: <div><Login /></div>
  },
  {
    path: '/Register',
    element: <div><Register /></div>
  },
  {
    path: '/Dashboard',
    element: <div><Dashboard /></div>
    
  },
  {
    path: '/UserPage',
    element: <div><UserPage /></div>
    
  },
  {
    path: '/AdminPage',
    element: <div><AdminPage /></div>
    
  }
]);

function App() {

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
