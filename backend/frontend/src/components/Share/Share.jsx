import React, { useRef, useState } from 'react'
import "./share.css"
import { PermMedia, EmojiEmotions } from "@material-ui/icons";
import QuizIcon from '@mui/icons-material/Quiz';
import axios from 'axios';

export default function Share() {

    let user = localStorage.getItem("userInfo")
    user = JSON.parse(user);
    const username = user.name;
    const desc = useRef();
    const [file, setFile] = useState(null)
    const PostPic = require('./pic.jpg');


    const submitHandler = async (e) => {
        console.log(user._id);
        e.preventDefault()
        const newPost = {
            userId: user._id,
            desc: desc.current.value,
        };
        if (file) {
            const data = new FormData();
            const fileName = Date.now() + file.name;
            data.append("file", file);
            data.append("name", fileName);
            newPost.img = file.name;
            //console.log(file);
            try {
                await axios.post("/api/upload", data);

            } catch (err) {
                console.log(err);
            }
        }

        try {
            //console.log(newPost);
            await axios.post("/post", newPost);
            window.location.reload();
        } catch (err) { }


    }
    return (
        <div className="share">
            <div className='shareWrapper'>
                <div className='shareTop'>
                    <img className='shareProfileImg' src={user.pic} alt="" />
                    <input placeholder={`what's in your mind  ${username}`} className="shareInput" ref={desc} />
                    <hr className='shareHr' />
                </div>
                <form className='shareBottom' onSubmit={submitHandler}>
                    <div className='shareOptions'>
                        <label htmlFor="file" className='shareOption'>
                            <PermMedia htmlColor='blue' className='shareIcon' />
                            <span className='shareOptionText'>Photo and video</span>
                            <input style={{ display: "none" }} type="file" id="file" accept='.jpg,.png,.jpeg' onChange={(e) => setFile(e.target.files[0])} />
                        </label>

                        <div className='shareOption'>
                            <EmojiEmotions htmlColor='tomato' className='shareIcon' />
                            <span className='shareOptionText'>share Achievement</span>
                        </div>


                        <div className='shareOption'>
                            <QuizIcon htmlColor='red' className='shareIcon' />
                            <span className='shareOptionText'>Ask Question</span>
                        </div>
                    </div>
                    <button className='shareButton' type='submit'>Share</button>
                </form>
            </div>
        </div>
    )
}
