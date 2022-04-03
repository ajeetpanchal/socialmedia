
import { React, useEffect, useState } from 'react'
import "./feed.css"
import Post from "../Post/Post"
import Share from '../Share/Share'
import { Posts } from '../../dummyData'
import axios from "axios";
const Feed = (props) => {

  const { College_id } = props;
  const [posts, setPosts] = useState([]);
  let CurrentUser = localStorage.getItem("userInfo");
  let user_object = JSON.parse(CurrentUser);
  //console.log(user_object._id);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = (College_id
        ? await axios.get("/post/profile/" + College_id)
        : await axios.get("/post/timeline/" + user_object._id));
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [College_id, user_object._id]);
  return (
    <div className='feed'>
      <div className='feedWrapper'>
      
        {user_object.College_id === College_id && <Share />}
        
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}

      </div>

    </div>
  )
}
export default Feed;


{/* 
// code is for post 

//   useEffect(() => {
//     let url = "/post/";
//     url += College_id
//         ? "profile/" + College_id
//         : "timeline/61e7f9f472fc88e10483f085";
//       console.log(url);
//     const fetchPosts = () => {
//         fetch(url)
//             .then((res) => res.json())
//             .then((data) => {
//                 setPosts(data);
//             })
//             .catch(console.log);
//     };

//     fetchPosts();
// }, []);
*/}