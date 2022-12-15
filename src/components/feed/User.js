import React from 'react'
import Button from '../Button';
import {Link} from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import './post.css'

function User(props){
    const displayTitle = () =>{
        console.log(props)
        //console.log(props.post.image)
        toast("Noted!");
    }
    return(
        <div className='post'>
            <div className='postImg'><img src={props.post.image} className='postImg'/></div>
            <Link to={{pathname: '/otherUser', state: props.post._id}} className='userpost'><div>{props.post.first_name} {props.post.last_name}</div></Link>
            <div className='descriptionuser'>{props.post.description}</div>
            <div className='descriptionuser'>Skills: {props.post.skills.join(', ')}</div>
            <div className='stuff'><Button text='Not interested' onClick={displayTitle}></Button></div>
            <ToastContainer></ToastContainer>
        </div>
    );
}

export default User;