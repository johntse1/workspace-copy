import {Link, Route} from 'react-router-dom'; 
import {Switch,useHistory } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../src/components/context/AuthContext";
//import NavBar from './components/navigation/NavBar';
import Jobs from './pages/Jobs'
import Profile from './pages/Profile'
import ChatRender from "./pages/ChatRender";
import Login from './pages/DefaultPage'
import Home from './pages/Home'

import CreateJob from './pages/CreateJob'
import UserHome from './pages/UserHome'
import UserProfile from './pages/UserProfile'
import UserJobs from './pages/UserJobs'
import OtherUser from './pages/OtherUser'
import Review from './components/reviewStuff/Review'
import ChatRenderUser from './pages/ChatRenderUser';

import './App.css';
import logo from "../src/components/WS.png";
import "../src/style.scss";
function App() {
  let history = useHistory()

  const {currentUser} = useContext(AuthContext);
  console.log(currentUser);
  console.log("Current User"+ currentUser);
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Link to="/login" />;
    }

    return children
  };
  return (
    <div className = "App">
      <div className='logohead'>
        <img src={logo} className="logo"></img>
        <h1 className="header">Workspace</h1>
      </div>


      <Switch>
        <Route exact path="/" component={Login}>
        </Route>
        <Route exact path="/home" component={Home} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/jobs" component={Jobs} />
        <Route exact path="/chat" component={ChatRender}/>
        
        {//Routes used for navbar above
         //Routers below are used for userNavBar
        }

        <Route exact path="/create" component={CreateJob} />
        <Route exact path="/userProfile" component={UserProfile} />
        <Route exact path="/userHome" component={UserHome} />
        <Route exact path="/userJobs" component={UserJobs} />
        <Route exact path="/otherUser" component={OtherUser} />
        <Route exact path="/review" component={Review} />
        <Route exact path="/userChat" component={ChatRenderUser}/>
      </Switch>
    </div>

  );
}


export default App;