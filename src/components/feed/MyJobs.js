import axios from 'axios';
import React from 'react'
import Button from '../Button';
import { Redirect } from 'react-router-dom';
import {Link} from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';

function MyJobs(props){
    const displayTitle = () =>{
        console.log("Current props are: " + props)
    }
    const removeJob = () =>{
        let url = 'https://workspace.onrender.com/api/jobs/delete/' + props.post._id
        let token = localStorage.getItem("JWT_TOKEN")
        axios.delete(url, { headers: { "Authorization": `Bearer ${token}` } }).then(function (response) {
            console.log(response)
            props.setRequestData(new Date());
            toast.dark("Job Removed")
          }).catch(function (error) {
            console.log(error)
            toast.error("Job removal failed")
        })
        return <Redirect to='/'></Redirect>

    }
    const completeJob = () =>{
        let token = localStorage.getItem("JWT_TOKEN")
        axios.post('https://workspace.onrender.com/api/jobs/complete/' + props.post._id,
            {
            },{ headers: { "Authorization": `Bearer ${token}` } })   
        .then( function (response){
          console.log(response.data)
          toast.dark("Job Completed")
        }).catch(function (error){
          console.log(error.response.status)
          toast.error("Job failed to complete")
        });
      }
    let contBool = localStorage.getItem('contractor')
    if(contBool){
      //complete jobs for contractor
      if(props.post.status == 'Complete')
        return(
          <div className='feed'>
          <div key={props.post._id} className='post'>
            <h1>{props.post.title}</h1>
            <Link to={{pathname: '/otherUser', state: props.post.user}} className='stuff'>{props.post.username}</Link>
            <div>{props.post.text}</div>
            <div>{props.post.price}</div>
            <div>{props.post.status}</div>
            <Link to={{pathname: '/review', state: props.post._id}}><Button text='Review' onClick={displayTitle}></Button></Link>
          </div>
          </div>)
      //jobs that were accepted and in progress
      if(props.post.status == 'in progress')
        return(
          <div className='feed'>
          <div key={props.post._id} className='post'>
            <h1>{props.post.title}</h1>
            <Link to={{pathname: '/otherUser', state: props.post.user}} className='stuff'>{props.post.username}</Link>
            <div>{props.post.text}</div>
            <div>{props.post.price}</div>
            <div>{props.post.status}</div>
            <Button text='Mark as Complete' onClick={completeJob}></Button>
            <ToastContainer/>
          </div>
          </div>)
      else
      {
        return(
          <div className='feed'>
        <div key={props.post._id} className='post'>
            <h1>{props.post.title}</h1>
            <Link to={{pathname: '/otherUser', state: props.post.user}} className='stuff'>{props.post.username}</Link>
            <div>{props.post.text}</div>
            <div>{props.post.price}</div>
            <div>{props.post.status}</div>
            <Button text='Remove Job' onClick={removeJob}></Button>
        </div>
        </div>
        )
      }
    }
}

export default MyJobs;