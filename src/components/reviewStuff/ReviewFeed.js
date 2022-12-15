import React from 'react'
import Button from '../Button';
import ReviewPost from './ReviewPost'

function ReviewFeed(props){
    const displayTitle = () =>{
        console.log(props)
    }
    return(
        <div>
          {props.feed.map((item) => 
            <ReviewPost post={item} key={item._id}></ReviewPost>
          )}
        </div>

    );
}

export default ReviewFeed;