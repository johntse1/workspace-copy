import React, { useContext } from 'react'
import {Link} from 'react-router-dom'
import './nav.css';
import { Redirect, Switch,useHistory } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

import {AuthContext} from '../context/AuthContext';


function NavBar(){
    let history = useHistory()
    const logout =() => {
        const auth = getAuth();
        localStorage.removeItem("JWT_TOKEN")
        history.push('/')
        signOut(auth);
        console.log("firebase sign out occurred");
    }

    const {currentUser} = useContext(AuthContext);
    console.log('This is the current user:'+currentUser);

    return(
        <ul className='uli'>
            <div className='centernav'>
                <li className='lii'><Link to='/home' className='navLink'>Home</Link></li>
                <li className='lii'><Link to='/profile' className='navLink'>My Profile</Link></li>
                <li className='lii'><Link to='/jobs' className='navLink'>Jobs</Link></li>
                <li className='lii'><Link to='/chat' className='navLink'>Chat</Link></li>
            </div>
            <li><Link className='logOut' onClick={logout}>Logout</Link></li>
        </ul>
    );
}
export default NavBar;