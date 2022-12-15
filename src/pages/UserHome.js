import React, { useState, useEffect } from 'react'
import Button from '../components/Button'

import 'react-toastify/dist/ReactToastify.css';
import 'react-tabs/style/react-tabs.css';
import 'react-datepicker/dist/react-datepicker.css'

import NavBar from '../components/navigation/UserNavBar';
import axios from 'axios'
import UserFeed from '../components/feed/UserFeed.js'



function UserHome(){
  
  const [items, setItems] = useState([]);
  const [currItems, setCurrItems] = useState([]);
  const [pageNum, setNum] = useState(0);


  useEffect(() =>{
    loadJob();
  }, []);
  const loadJob = () =>{
    console.log('button clicked')
    let token = localStorage.getItem("JWT_TOKEN")
    axios.get('https://workspace.onrender.com/api/users/gettag', { headers: { "Authorization": `Bearer ${token}` } })
    .then( function (response){
      console.log(response.data)
      makePages(response.data)
    }).catch(function (error){
      console.log(error.response.status)
    });
  }

  const makePages = (arr) =>{
    let pageSize = 5
    let tempArr = []
    //console.log(items.length)
    console.log(arr)
    for (let i = 0; i < arr.length; i += pageSize) {
      let page = arr.slice(i, i + pageSize);
      //console.log(page)
      tempArr.push(page)
    }
    setItems(tempArr)
    //console.log(tempArr)
    //console.log('a')
    //console.log(items)
    setCurrItems(tempArr.at(pageNum))
    //console.log(items.at(pageNum))
    //console.log(currItems)
  }
  const nextPage = () =>{
    if(pageNum < items.length - 1){
      setNum(pageNum + 1)
      //loadJob()
      setCurrItems(items.at(pageNum+1))
    }
  }
  const prevPage = () =>{
    if(pageNum > 0){
      setNum(pageNum - 1)
      //loadJob()
      setCurrItems(items.at(pageNum-1))
    }
  }

  return (
       <div className="App">
        <NavBar/>
        
        <UserFeed feed={currItems}></UserFeed>
        
        <div className='pageButton'><Button text='Prev Page' onClick={prevPage}></Button>
        {pageNum + 1}
        <Button text='Next Page' onClick={nextPage}></Button></div>
        <div className='coolButton'>
        <Button text='Refresh Feed' onClick={loadJob}></Button></div>
      </div>
  );
}

export default UserHome;