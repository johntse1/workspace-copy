import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios'
import { useEffect, useState } from 'react';
import NavBar from '../components/navigation/NavBar';
import UserNavBar from '../components/navigation/UserNavBar';
import OtherUserReviews from '../components/reviewStuff/OtherUserReviews'
import './css/Profile.css';

function OtherUser(props){
    //console.log(props.location.state)
    //const prof = ['John Tse', '4.5', ['Fixing', 'Cleaning', 'Making'], 'A cool guy', ['Good worker', 'Quick Worker']]
    const [profile, set_profile] = useState([
        {
          "first_name": "john",
          "last_name": "tse",
          "email": "placeholder@gmail.com",
          "id": "placeholderid",
          "contractor" : "placeholdertype"
        }
      ]);
      const [got_profile,setgot_profile] = useState(null)
      const [reviews, setReviews] = useState()

      const url = 'https://workspace.onrender.com/api/reviews/get/'
      
      useEffect(() => {
        const fetchData = async () => {
          let token = localStorage.getItem("JWT_TOKEN")
          const response = await axios.get("https://workspace.onrender.com/api/users/get/" + props.location.state, { headers: { "Authorization": `Bearer ${token}` } });
          const reviewResponse = await axios.get(url + props.location.state, { headers: { "Authorization": `Bearer ${token}` } });
          set_profile(response.data)
          setReviews(reviewResponse.data)
          console.log(reviewResponse.data)
          setgot_profile(true)
        };
        fetchData();
      }, []);

    const navBar = () =>{
      let contBool = Boolean(localStorage.getItem('contractor'))
      if(contBool === true){
        return <NavBar/>
      }
      else{
        return <UserNavBar/>
      }
    }
    return(
        <div>
            <div>{navBar()}</div>
            <div className='bigboy'>
              <Tabs>
                  <div className='bigboy'>
                    {/* <h1>{prof[0]}({prof[1]})</h1> */}
                      <div>
                        <img src={profile['image']} className='picture' alt=""/>
                      </div>
                      <div>
                        <h1 className='profileusername'>{profile["first_name"] + " " + profile["last_name"]}'s profile</h1>
                        <h2 className='profileemail'>email: {profile["email"]}</h2>
                        <h2> {got_profile? profile["description"]: ""}</h2>
                      </div>
                  </div>


                  <TabList>
                  <Tab>Skills</Tab>
                  <Tab>Reviews</Tab>
                  </TabList>

                  <TabPanel>
                  {/* <h2>{prof[2].map((item, i) => <div key={i}>{item}</div>)}</h2> */}
                  {got_profile?  
                  <div>
                      {profile["skills"].map((skill) => <h2 key={skill}>{skill}</h2>)}
                  </div>: ""}
                  </TabPanel>

                  <TabPanel>
                    <OtherUserReviews feed={reviews}></OtherUserReviews>
                  
                  </TabPanel>
              </Tabs>
            </div>
        </div>
    );
}

export default OtherUser;