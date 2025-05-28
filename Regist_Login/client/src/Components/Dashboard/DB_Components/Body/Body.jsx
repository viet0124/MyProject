import React from 'react'

//import components
import UP from '../ForUser/UP'
import History from '../ForUser/History'

const 
Body = () => {
  return (
    <div className='body flex'>
        <div className="main">
          <History/>
        </div>
        {/* <div className="profile">
          <UP/>
        </div> */}
    </div>
  )
}

export default Body