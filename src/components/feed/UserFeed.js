import React from 'react';
import Button from '../Button';
import User from './User.js';
import './feed.css';

function UserFeed(props){
  console.log(props.feed);
    return(
        <div className='feed'>
          {typeof props.feed === 'undefined' ? <h1>No workers found</h1> : props.feed.map((item) => 
            <User post={item} key={item._id}></User>
          )}
        </div>

    );
}

export default UserFeed;