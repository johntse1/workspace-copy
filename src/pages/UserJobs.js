import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { API_BASE_URL, API_GET_ME } from '../API_ENDPOINTS'
import axios from 'axios'
import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import MyJobs from '../components/feed/MyJobs.js'
import NavBar from '../components/navigation/UserNavBar';


function UserJobs(){
    const [my_profile, setmy_profile] = useState([
        {
          "first_name": "john",
          "last_name": "tse",
          "email": "placeholder@gmail.com",
          "id": "placeholderid"
        }
      ]);
      const [got_profile,setgot_profile] = useState(null)
      const [active_jobs, setActive_Jobs] = useState([])
      const [requestData, setRequestData] = useState(new Date());
      const [previous_jobs, setPrevious_Jobs] = useState([])
      const [incomplete_jobs, setIncomplete_Jobs] = useState([])

      useEffect(() => {
        const fetchData = async () => {
          let token = localStorage.getItem("JWT_TOKEN")
          const response = await axios.get(API_BASE_URL + API_GET_ME, { headers: { "Authorization": `Bearer ${token}` } });
          const jobsList = await axios.get('https://workspace.onrender.com/api/jobs/getcurrent', { headers: { "Authorization": `Bearer ${token}` } })
          setmy_profile(response.data)
          setgot_profile(true)
          setActive_Jobs(jobsList.data)
          const prevjobsList = await axios.get('https://workspace.onrender.com/api/jobs/getpast', { headers: { "Authorization": `Bearer ${token}` } })
          setPrevious_Jobs(prevjobsList.data)
          //console.log(prevjobsList.data)
          const incompletejobList = await axios.get('https://workspace.onrender.com/api/jobs/getincomplete ', { headers: { "Authorization": `Bearer ${token}` } })
          setIncomplete_Jobs(incompletejobList.data)
          //console.log(incompletejobList.data)
          console.log(jobsList.data)
        };
        fetchData();
      }, [requestData]);

      if (localStorage.getItem('JWT_TOKEN') == null) {
        return <Redirect to="/"></Redirect>
      }
      const checkjwt = async () => {
        if (localStorage.getItem("JWT_TOKEN") != null) {
          let token = localStorage.getItem("JWT_TOKEN")
          axios.get(API_BASE_URL + API_GET_ME, { headers: { "Authorization": `Bearer ${token}` } })
            .then((response) => {
              console.log(response)
              setmy_profile(response.data)
              console.log(my_profile)
            })
        }
      }
    return (
        <div className='jobpanel'>
          <NavBar/>
            <Tabs>
                <TabList>
                    <h1 className='head'>Jobs Page</h1>
                    <Tab>Listed Jobs</Tab>
                    <Tab>Ongoing Jobs</Tab>
                    <Tab>Past Jobs</Tab>
                </TabList>

                <TabPanel>
                    <div className='jobs'>
                        {incomplete_jobs.map((jobs) => 
                            <MyJobs post={jobs} key={jobs._id} setRequestData={setRequestData}></MyJobs>
                        )}
                    </div>
                </TabPanel>
                
                <TabPanel>
                    <div className='jobs'>
                        {active_jobs.map((jobs) => 
                            <MyJobs post={jobs} key={jobs._id} setRequestData={setRequestData}></MyJobs>
                        )}
                    </div>
                </TabPanel>

                <TabPanel>
                     <div className='jobs'>
                        {previous_jobs.map((jobs) => 
                            <MyJobs post={jobs} key={jobs._id} setRequestData={setRequestData}></MyJobs>
                        )}
                    </div>
                </TabPanel>
            </Tabs>

        </div>
    );
}

export default UserJobs;