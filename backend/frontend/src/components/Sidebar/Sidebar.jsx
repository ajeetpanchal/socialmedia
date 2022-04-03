import React from 'react'
import { NavLink, Link } from "react-router-dom";
import "./Sidebar.css"
import {
    RssFeed, Chat,
    HelpOutline,
    Event,
    School,
} from "@material-ui/icons";
import { Users } from '../../dummyData';
import CloseFriend from '../CloseFriend/CloseFriend';
export default function sidebar() {

    return (
        <div className='sidebar'>
            <div className='sidebarWrapper'>
                <ul className='sidebarList'>
                    <li className='sidebarListItem'>

                        <NavLink to="/home">
                            <RssFeed className='sidebarIcon' />
                            <span className='sidebarListItemText'>Feed</span>
                        </NavLink>

                    </li>

                    <li className='sidebarListItem'>
                        <NavLink to="/ques">
                            <HelpOutline className='sidebarIcon' />
                            <span className='sidebarListItemText'>Quesiton</span>
                        </NavLink>

                    </li>

                    <li className='sidebarListItem'>
                        <NavLink to="/chats">
                            <Chat className='sidebarIcon' />
                            <span className='sidebarListItemText'>chats</span>
                        </NavLink>

                    </li>

                    <li className='sidebarListItem'>
                        <Event className='sidebarIcon' />
                        <span className='sidebarListItemText'>Coming soon</span>
                    </li>

                </ul>

                <button className='sidebarButton'>Show more</button>
               
               
            </div>



        </div>
    )
}
