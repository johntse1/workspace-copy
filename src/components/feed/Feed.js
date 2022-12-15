import React from 'react'
import Button from '../Button';
import Post from './Post.js'
import './feed.css';

function Feed(props){
    console.log(props);
    return(
        <div className='feed'>
          {typeof props.feed === 'undefined' ? <h1>No jobs found</h1> : props.feed.map((item) => 
            <Post post={item} key={item._id}></Post>
          )}
        </div>

    );
}

export default Feed;