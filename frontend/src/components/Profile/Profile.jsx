import React, { useEffect, useState } from 'react'
import './profile.css'
import Sidebar from '../Sidebar/Sidebar';
import Feed from '../Feed/Feed';
import Navbar from '../Navbar/Navbar';
import Rightbar from '../Rightbar/Rightbar';
import axios from 'axios';
import { useParams } from 'react-router-dom';


export default function Profile() {

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [user, setUser] = useState({});
   // const parmas = useParams();
   // let user3z = localStorage.getItem("user")
    const College_id = useParams().College_id;
 
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/tmp?College_id=${College_id}`)
            setUser(res.data);
           
        };
        fetchUser();
    }, []);

    return (
        <div>
            <Navbar />
            <div className='profile'>
                <Sidebar />
                <div className='profileRight'>
                    <div className='profileRightTop'>
                        <div className='profileCover'>
                            <img className='profileCoverImg' src={PF + "post/coverimg.jpg"} alt="cover Image" />
                            <img className='profileUserImg' src={user.pic} alt="userimg" />
                        </div>
                    </div>
                    <div className='profileInfo'>
                        <h4 className='profileInfoName'>{user.name}</h4>
                        <span className='profileInfoDesc'>{user.desc}</span>
                    </div>
                    <div className='profileRightBottom'>

                        <Feed College_id={College_id} />
                        <Rightbar user={user} />
                    </div>

                </div>

            </div>
        </div>
    )
}
