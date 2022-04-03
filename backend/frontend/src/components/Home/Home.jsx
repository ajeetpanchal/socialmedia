import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Post from '../Post/Post';
import AskQuestion from '../AskQuestion/AskQuestion';
import Sidebar from '../Sidebar/Sidebar';
import Feed from '../Feed/Feed';
import "./Home.css";
import Rightbar from '../Rightbar/Rightbar';
import { Users } from '../../dummyData'
import Setting from '../Setting/Settings';
export default class Home extends Component {
    
    render() {
        let user = localStorage.getItem("userInfo");
        user = JSON.parse(user);
        console.log(user.name);
        return (
            <div className='home'>
                <Navbar />
                <div className="homeContainer">
                    <Sidebar />
                    <Feed    />
                    <Rightbar  />
                </div>



            </div>
        )
    }
}

