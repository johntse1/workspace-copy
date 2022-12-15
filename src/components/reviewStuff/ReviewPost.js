import React from 'react'
import Button from '../Button';
import {Link} from 'react-router-dom'
import axios from 'axios'
import './ReviewPost.css'

function ReviewPost(props){
    const displayTitle = () =>{
        console.log(props.post._id)
    }

    return(
        <div key={props.post.id} className="postindiv">
            <h3 className='titleP'>{props.post.title}</h3>
            <h2 className='name'><Link to={{pathname: '/otherUser', state: props.post.reviewer}} className='stuff'>{props.post.username}</Link></h2>
            <h3 className='rating'>Overall Rating: {props.post.rating}/5</h3>
            <div className='description1'>{props.post.text}</div>
            <hr/>
        </div>
    );
}

export default ReviewPost;