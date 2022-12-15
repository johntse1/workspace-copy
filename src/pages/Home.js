
//THIS PAGE WAS MOVED TO DEFAULT PAGE

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Button from '../components/Button'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from 'react-router-dom';

import 'react-tabs/style/react-tabs.css';
import 'react-datepicker/dist/react-datepicker.css'
import Feed from '../components/feed/Feed.js'
import NavBar from '../components/navigation/NavBar';

import './css/Home.css'

function Home() {
  const [items, setItems] = useState([]);
  const [currItems, setCurrItems] = useState([]);
  const [pageNum, setNum] = useState(0);
  const [USER_COORDINATES, setUSER_COORDINATES] = useState([])


  useEffect(() => {
    loadJob();
  }, []);
  const loadJob = () => {
    let cords = []
    let token = localStorage.getItem("JWT_TOKEN") 
    let dist = 50
    if ('geolocation' in navigator) {

      navigator.geolocation.getCurrentPosition((position) => {
        // console.log("Latitude is :", position.coords.latitude);
        // console.log("Longitude is :", position.coords.longitude);
        cords = [parseFloat(position.coords.latitude), parseFloat(position.coords.longitude)]
        setUSER_COORDINATES(cords)
      axios.post('https://workspace.onrender.com/api/jobs/getwithintag', 
      {
        coord:cords,
        distance:dist
      },{ headers: { "Authorization": `Bearer ${token}` } })
      .then(function (response) {
        console.log(response.data)
        console.log("showing all posts with correct tags within 50 miles")
        toast.dark("Loading closest jobs near you.")
        makePages(response.data)

      }).catch(function (error) {
        console.log(error.response.status)
      });
      }, function(error) {
        console.log(error)
        axios.get('https://workspace.onrender.com/api/jobs/mytags', { headers: { "Authorization": `Bearer ${token}` } })
        .then(function (response) {
          console.log(response.data)
          console.log("showing all posts with correct tags")
          toast.dark("Loaded jobs with your selected skills")
          makePages(response.data)
        }).catch(function (error) {
          console.log(error.response.status)
        });
      });
      }
  }

  if (localStorage.getItem('JWT_TOKEN') == null) {
    return <Redirect to="/"></Redirect>
  }
  const makePages = (arr) => {
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
    console.log("This is temp"+ tempArr)
    //console.log('a')
    //console.log(items)
    setCurrItems(tempArr.at(pageNum))
    //console.log(items.at(pageNum))
    //console.log(currItems)
  }
  const nextPage = () => {
    if (pageNum < items.length - 1) {
      setNum(pageNum + 1)
      //loadJob()
      setCurrItems(items.at(pageNum + 1))
    }
  }
  const prevPage = () => {
    if (pageNum > 0) {
      setNum(pageNum - 1)
      //loadJob()
      setCurrItems(items.at(pageNum - 1))
    }
  }

  const setDist = (num) => {
    let token = localStorage.getItem("JWT_TOKEN") 
    console.log(num + ' miles')
    axios.post('https://workspace.onrender.com/api/jobs/getwithintag', 
      {
        coord:USER_COORDINATES,
        distance:num
      },{ headers: { "Authorization": `Bearer ${token}` } })
      .then(function (response) {
        console.log(response.data)
        console.log("showing all posts with correct tags within " + num + " miles")
        toast.dark("Loading closest jobs near you.")
        makePages(response.data)

      }).catch(function (error) {
        console.log(error.response.status)
      });
    
  }
  //console.log('This is curr'+currItems);
  
  return (
    <div className="App">
      <NavBar />
      {USER_COORDINATES.length === 0 ? <div></div> : <div className='coolButton'><Button text='20 miles' onClick={() => setDist(20)}></Button><Button text='30 miles' onClick={() => setDist(30)}></Button><Button text='40 miles' onClick={() => setDist(40)}></Button><Button text='50 miles' onClick={() => setDist(50)}></Button></div>}
      <Feed feed={currItems}></Feed>
      <div className='pageButton'><Button text='Prev Page' onClick={prevPage}></Button>
      {pageNum + 1}
      <Button text='Next Page' onClick={nextPage}></Button></div>
      <div className='coolButton'><Button text='Refresh Feed' onClick={loadJob}></Button></div>
      <div className='bottom'></div>
      <ToastContainer />

    </div>
  );
}

export default Home;

