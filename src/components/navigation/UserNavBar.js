import React from 'react'
import {Link} from 'react-router-dom'
import './nav.css';
import Button from '../Button';
import { Redirect, Switch,useHistory } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

function UserNavBar(){
    let history = useHistory()
    const logout =() => {
        const auth = getAuth();
        localStorage.removeItem("JWT_TOKEN")
        history.push('/')
        signOut(auth);
        console.log("firebase sign out occurred");
    }
    return(
        <ul className='uli'>
            <li className='lii'><Link to='/userHome' className='navLink'>Home</Link></li>
            <li className='lii'><Link to='/userProfile' className='navLink'>My Profile</Link></li>
            <li className='lii'><Link to='/userjobs' className='navLink'>Jobs</Link></li>
            <li className='lii'><Link to ='/create' className='navLink'>Create Job Posting</Link></li>
            <li className='lii'><Link to='/userChat' className='navLink'>Chat</Link></li>
            <li><Link className='logOut' onClick={logout}>Logout</Link></li>
        </ul>
    );
}
export default UserNavBar;