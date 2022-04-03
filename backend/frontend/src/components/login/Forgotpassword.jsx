import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
export default function Forgotpassword() {
  const navigate = useNavigate();
  const [new_password, setnew_password] = useState("");
  const [College_id, setCollege_id] = useState("");
  const [confirm_password, setconfirm_password] = useState("");
  const loginuser = async (e) => {
    e.preventDefault();
    // window.alert("login..");
    if (new_password !== confirm_password) {
      window.alert("both passwords are not matching..");
      setnew_password("");
      setCollege_id("");
      setconfirm_password("");
    } else {
      const res = await fetch("/api/user/forgot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          College_id,
          new_password,
          confirm_password,
        }),
      });
      const data = res.json();
      if (res.status === 400 || !data) {
        window.alert("Please enter valid collegeId");
        setnew_password("");
        setCollege_id("");
        setconfirm_password("");
      } else {
        window.alert("password reset successfully");
        navigate("/");
      }
    }
    // console.log(res.json());
  };
  return (
    <div>
      <div className="page-wrapper bg-gra-01 p-t-180 p-b-100 font-poppins">
        <div className="wrapper wrapper--w780">
          <div className="card card-3">
            <div className="card-heading card-bg"></div>
            <div className="card-body">
              <h2 className="title">Change Password</h2>
              <form method="POST">
                <div className="input-group">
                  <input
                    className="input--style-3"
                    type="text"
                    placeholder="College ID"
                    autoComplete="off"
                    name="College_id"
                    value={College_id}
                    onChange={(e) => {
                      setCollege_id(e.target.value);
                    }}
                  />
                </div>
                <div className="input-group">
                  <input
                    className="input--style-3"
                    type="password"
                    placeholder="New Password"
                    name="new_password"
                    value={new_password}
                    onChange={(e) => {
                      setnew_password(e.target.value);
                    }}
                  />
                </div>
                <div className="input-group">
                  <input
                    className="input--style-3 js-datepicker"
                    type="password"
                    placeholder="Confirm Password"
                    name="confirm_password"
                    value={confirm_password}
                    onChange={(e) => {
                      setconfirm_password(e.target.value);
                    }}
                  />
                </div>
                <div className="p-t-10">
                  <button
                    className="btn btn--pill btn--green"
                    type="submit"
                    onClick={loginuser}
                  >
                    Submit
                  </button>
                </div>
                <div className="forgot-password"></div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
