import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { API_BASE_URL, API_GET_ME } from '../API_ENDPOINTS'
import axios from 'axios'
import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import NavBar from '../components/navigation/NavBar';
import UserNavBar from '../components/navigation/UserNavBar';
import ReviewFeed from '../components/reviewStuff/ReviewFeed'
import './css/Profile.css';

//const prof = ['John Tse', '4.5', ['Fixing', 'Cleaning', 'Making'], 'A cool guy', ['Good worker', 'Quick Worker']]


function Profile() {
  const [my_profile, setmy_profile] = useState([
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

  const url = 'https://workspace.onrender.com/api/reviews/get'

  useEffect(() => {
    const fetchData = async () => {
      let token = localStorage.getItem("JWT_TOKEN")
      const response = await axios.get(API_BASE_URL + API_GET_ME, { headers: { "Authorization": `Bearer ${token}` } });
      const reviewResponse = await axios.get(url, { headers: { "Authorization": `Bearer ${token}` } });
      setmy_profile(response.data)
      setReviews(reviewResponse.data)
      //console.log(response.data)
      console.log(reviewResponse.data)
      console.log(response.data.contractor);
      setgot_profile(true)
    };
    fetchData();
  }, []);

  if (localStorage.getItem('JWT_TOKEN') == null) {
    return <Redirect to="/"></Redirect>
  }
  /*
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
  }*/
  //console.log(my_profile["contractor"])

   const navBar = () =>{
    let contBool = localStorage.getItem('contractor')
    console.log(contBool)
    if(contBool){
      return <NavBar/>
    }
    else{
      return <UserNavBar/>
    }
  }
  return (
    <div className='App'>
      <div>{navBar()}</div>
      <div className='container1'>
        <Tabs>
          <div className='bigboy'>
          {/* <h1>{prof[0]}({prof[1]})</h1> */}
            <div>
              <img src={my_profile['image']} className='picture' alt=""/>
            </div>
            <div>
              <h1 className="profileusername">{my_profile["first_name"] + " " + my_profile["last_name"]}</h1>
              <h2 className="profileemail">email: {my_profile["email"]}</h2>
              <h2> {got_profile? my_profile["description"]: ""}</h2>
            </div>
          </div>

          <TabList >
            <Tab>Skills</Tab>
            <Tab>Reviews</Tab>
          </TabList>

          <TabPanel className="tab">
            {/* <h2>{prof[2].map((item, i) => <div key={i}>{item}</div>)}</h2> */}
            {got_profile?  
            <div>
              {my_profile["skills"].map((skill) => <h2 key={skill}>{skill}</h2>)}
            </div>: ""}
          
          </TabPanel>
          <TabPanel className="tab">
            <ReviewFeed feed={reviews}></ReviewFeed>
            

          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}

export default Profile;