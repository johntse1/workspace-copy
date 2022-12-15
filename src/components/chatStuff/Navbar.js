import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  const {currentUser} = useContext(AuthContext)
  console.log(currentUser);
  
  return (
    <div className='navbar'>
      <div className="user">
        <span>{currentUser.displayName}</span>
      </div>
    </div>
  )
}

export default Navbar