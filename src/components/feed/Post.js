import React from 'react'
import Button from '../Button';
import {Link} from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import './post.css';

function Post(props){
    const displayTitle = () =>{
        console.log(props.post._id)
    }
    const acceptJob = () =>{
        console.log('button clicked')
        let token = localStorage.getItem("JWT_TOKEN")
        axios.post('https://workspace.onrender.com/api/jobs/accept/' + props.post._id,
            {
            },{ headers: { "Authorization": `Bearer ${token}` } })   
        .then( function (response){
          console.log(response.data)
          toast.dark("Job Accepted")
        }).catch(function (error){
          console.log(error.response.status)
          toast.dark("Job failed to accept")
        });
      }
    return(
        <div key={props.post._id} className='post'>
            <div className='images'>{props.post.images.map(image => <img src={image} className='postImg'/>)}</div>
            <h2 className='title'>{props.post.title}</h2>
            <span className='user'><Link to={{pathname: '/otherUser', state: props.post.user}}>{props.post.username}</Link></span>
            <br/>
            <div className='description'>{props.post.text}</div>
            <br/>
            <div className='price'>Price: ${props.post.price}</div>
            <Button text='I want this job' onClick={acceptJob}></Button>
            <ToastContainer></ToastContainer>
        </div>

    );
}

export default Post;