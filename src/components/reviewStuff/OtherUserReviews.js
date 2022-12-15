import React from 'react'
import Button from '../Button';
import ReviewPost from './ReviewPost'

function OtherUserReviews(props){
    const displayTitle = () =>{
        console.log(props)
    }
    return(
        <div>
          {props.feed.reviews.map((item) => 
            <ReviewPost post={item} key={item._id}></ReviewPost>
          )}
        </div>

    );
}

export default OtherUserReviews;