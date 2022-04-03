import React, { useEffect, useState } from 'react'
import "./Rightbar.css";
import { Users } from '../../dummyData';
import Online from '../Online/Online';
import axios from "axios";
import { Add, Remove } from "@material-ui/icons";
import { Link } from 'react-router-dom';
export default function Rightbar({ user }) {

  const collage = require('../../Image/collage.png');
  const ad = require('../../Image//ad.jpg');
  const [friends, setFriends] = useState([]);
  let currentUser = localStorage.getItem("userInfo");
  currentUser = JSON.parse(currentUser);

  //for follow the user 

  const [followed, setFollowed] = useState(false);




  const HomeRightBar = () => {

    return (
      <div>
        <div className='birthdayContainer'>
          <img className='birthdayImg' src={collage} alt="img" />
          <span className='birthdayText' >
            <b>Paid </b>  <b> Partnership</b>
          </span>
        </div>
        <img className='rightbarAd' src={ad} alt="ad" />


      </div>
    )
  }

  const ProfileRightbar = () => {

    
    //friend list
    useEffect(() => {
      const getFriends = async () => {
        try {
         const userid = user._id;
          const friendList = await axios.get("/tmp/friends/" + userid)
          setFriends(friendList.data);
        } catch (err) {
          console.log(err)
        }
      };
      getFriends();

    }, []);


    //follow and unfollow user

    useEffect(() => {
      setFollowed(currentUser.followings.includes(user?.id));
    }, [currentUser,user.id])
    //currentUser, user.id
    const handleClick = async () => {
      try {
        if (followed) {
          await axios.put("/tmp/" + user._id + "/follow", { College_id: currentUser._id, });
        } else {
          await axios.put("/tmp/" + user._id + "/unfollow", { College_id: currentUser._id, });
        }
      } catch (err) {
        console.log(err)
      }
      setFollowed(!followed)
    };

    return (
      <div>
       {/*
      {user.College_id !== currentUser.College_id && (
          <button className="rightbarFollowButton" onClick={handleClick} >
         {followed ? "Unfollow" : "Follow"} 
            {followed ? <Remove /> : <Add />}
          </button>
        )}
      */}  
         

        <h4 className='rightbarTitle'>User Information </h4>
        <div className='rightbarInfo'>
          <div className='rightbarInfoItem'>
            <span className='rightbarInfokey'>College:</span>
            <span className='rightbarInfoValue'>{user.College_name}</span>
          </div>
         
          <div className='rightbarInfoItem'>
            <span className='rightbarInfokey'>Email:</span>
            <span className='rightbarInfoValue'>{user.email}</span>
          </div>
      


          <div className='rightbarInfoItem'>
            <span className='rightbarInfokey'>Sem:</span>
            <span className='rightbarInfoValue'>6</span>
          </div>
        </div>



        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link to={"/profile/" + friend.College_id}>
              <div className="rightbarFollowing">
                <img
                  src={friend.pic}
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.name}</span>
              </div>
              
            </Link>
          ))}
        </div>

      </div>
    );
  }


  return (
    <div className='rightbar'>
      <div className='rightbarWrapper'>
        {user ? <ProfileRightbar /> : <HomeRightBar />}

      </div>
    </div>
  )
}