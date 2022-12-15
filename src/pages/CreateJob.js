import React, { useEffect, useState } from 'react';
import Select from 'react-select'
import Button from '../components/Button'
import axios from 'axios'
import { Redirect, useHistory, Route, Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { API_SET_JOB, API_BASE_URL, API_GET_ME, API_GET_ALL_JOBS } from '../API_ENDPOINTS'
import NavBar from '../components/navigation/NavBar';
import UserNavBar from '../components/navigation/UserNavBar';
import './css/CreateJob.css';
import upload from "../components/photo.png";

function CreateJob() {




  // useEffect(() => {
  //   const fetchData = async () => {
  //     let token = localStorage.getItem("JWT_TOKEN")
  //     const response = await axios.get(API_BASE_URL + API_SET_JOB, { headers: { "Authorization": `Bearer ${token}` } });
  //     console.log(response.data)
  //     setgot_profile(true)
  //   };
  //   fetchData();
  // }, []);

  let history = useHistory()

  const [got_profile, setgot_profile] = useState(null)
  const [JWT_TOKEN, setJWT_TOKEN] = useState('')
  const [POST_ID, setPOST_ID] = useState('')
  const [USER_ID, setUSER_ID] = useState('')
  const [USER_TITLE, setUSER_TITLE] = useState('')
  const [USER_PRICE, setUSER_PRICE] = useState('')
  const [USER_POST_DESCRIPTION, setUSER_POST_DESCRIPTION] = useState('')
  const [USER_TAGS, setUSER_TAGS] = useState([])
  const [USER_ADDRESS, setUSER_ADDRESS] = useState('')
  const [USER_IMAGES, setUSER_IMAGES] = useState([])

  if (localStorage.getItem('JWT_TOKEN') == null) {
    return <Redirect to="/"></Redirect>
  }
  let skills =
    [
      { label: "Construction", value: "Construction" },
      { label: "Plumbing", value: "Plumbing" },
      { label: "Electrical", value: "Electrical" },
      { label: "Mechanical", value: "Mechanical" },
      { label: "Home", value: "Home" },
      { label: "Logging", value: "Logging" },
      { label: "Technical", value: "Technical" },
      { label: "Roof", value: "Roof" },
    ]
  let url = 'https://workspace.onrender.com/api/jobs/set'

  // const setJobs = () => {
  //   let token = localStorage.getItem("JWT_TOKEN")
  //   axios.post(url,
  //     {
  //       title: USER_TITLE,
  //       user: USER_ID,
  //       text: USER_POST_DESCRIPTION,
  //       price: USER_PRICE,
  //       tags: USER_TAGS,
  //       address: USER_ADDRESS
  //     }, { headers: { "Authorization": `Bearer ${token}` } })
  //     .then(function (response) {
  //       console.log(response)
  //       history.push('/userjobs')
  //     }).catch(function (error) {
  //       console.log(error.response)
  //       if (error.response.status == 400) {
  //         toast.error("Please enter another address")
  //       }

  //       if (error.response.status == 401) {
  //         toast.error("Please add a text field")
  //       }
  //       if (error.response.status == 402) {
  //         toast.error("Please add a title")
  //       }
  //       if (error.response.status == 403) {
  //         toast.error("Please enter a price field")
  //       }
  //     })
  // }

  const setJobs = async () => {
    let token = localStorage.getItem("JWT_TOKEN")
    const formdata = new FormData()
    // formdata.append("images", USER_IMAGES)
    if(USER_IMAGES.length>=1)
    {
      let files = USER_IMAGES
      for (let i = 0; i < files.length; i++) {
        formdata.append("images", files.item(i))
      }
    }
   

    formdata.append("title", USER_TITLE)
    formdata.append("user", USER_ID)
    formdata.append("text", USER_POST_DESCRIPTION)
    formdata.append("price", USER_PRICE)
    formdata.append("tags", USER_TAGS)
    formdata.append("address", USER_ADDRESS)


    axios({
      method: "post",
      url: "https://workspace.onrender.com/api/jobs/set",
      // url: "http://localhost:3000/api/jobs/set",

      data: formdata,
      headers: { "Content-Type": "multipart/form-data", "Authorization": `Bearer ${token}` }
    }).then(function (response) {
      console.log(response)
      history.push('/userjobs')

    }).catch(function (error) {
      console.log(error)
      if (error.response.status == 400) {
        toast.error("Please enter another address")
      }

      if (error.response.status == 401) {
        toast.error("Failed to upload image to server")
      }
      if (error.response.status == 402) {
        toast.error("Please add a description")
      }
      //this one
      if (error.response.status == 403) {
        toast.error("Please enter a tag")
      }
      if (error.response.status == 404) {
        toast.error("Please enter a Job Name")
      }
      if (error.response.status == 405) {
        toast.error("Please enter a price")
      }
      if (error.response.status == 406) {
        toast.error("Failed to upload images to imgur")
      }
    })


  }

  const handleSelectChange = (e) => {
    let values = []
    e.map((v) => values.push(v.value))
    setUSER_TAGS(values)
    console.log(USER_TAGS)
  }
  const navBar = () => {
    let contBool = localStorage.getItem('contractor')
    if (contBool) {
      return <UserNavBar />
    }
    else {
      return <NavBar />
    }
  }

  const imagechangeHandler = (e) => {
    if (e.target.files.length > 2) {
      alert("Only 1 image is accepted.")
      e.target.value = null
    }
    else {
      setUSER_IMAGES(e.target.files)
    }
    console.log(USER_IMAGES)
  }

  return (
    <div>
      <div>{navBar()}</div>
      <div className='containercreate'>
        <div className='form-control'>
          <label>Job Name</label>
          <input type='text' placeholder='Enter the job name'
            value={USER_TITLE}
            onChange={(e) => setUSER_TITLE(e.target.value)}
          />
        </div>

        <div className='form-control'>
          <label>Payment</label>
          <input type='number' placeholder='Enter payment amount'
            value={USER_PRICE}
            onChange={(e) => setUSER_PRICE(e.target.value)}
          />
        </div>

        <div className='form-control'>
          <label>Enter a location</label>
          <input type='text' placeholder='Enter the location of the job'
            value={USER_ADDRESS}
            onChange={(e) => setUSER_ADDRESS(e.target.value)}
          />
        </div>

        <div className='form-control'>
          <label>Description</label>
          <form>
            <textarea type='text' className='textareajob'
              placeholder='Enter a description about your problem (max 200 words)'
              maxLength="200"
              rows={5}
              value={USER_POST_DESCRIPTION}
              onChange={(e) => setUSER_POST_DESCRIPTION(e.target.value)}
              required
            ></textarea>
          </form>
        </div>

        <div className='form-control'>
          <label>Tags</label>
          <div className='dropDown'>
            <Select
              isMulti
              name="colors"
              options={skills}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={(e) => handleSelectChange(e)}
            />
          </div>
        </div>

        <div className='form-control'>
          <label>Upload Images</label>
          <input type="file" onChange={imagechangeHandler} multiple={true} max={5} maxLength={5} accept=".jpg,.jpeg,.png"
          className='input'
          style={{display:"none"}}
          id="file"
          required
          />
          <label htmlFor='file' className='label'>
            <img src={upload} className="upload"/>
          </label>
        </div>


        <Button text='Submit' onClick={setJobs} ></Button>
        {/* <Button text='Submit2' onClick={setJobs2} ></Button> */}



        <ToastContainer />
      </div>
    </div>
  );
}

export default CreateJob;