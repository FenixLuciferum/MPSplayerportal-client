import React from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { FaLock } from "react-icons/fa";
import "./ResetPassword.css";
import axios from 'axios';


const ForgotPassword = () => {

    const [newPassword, setNewPassword] = useState('');
    const [sndPassword, setSndPassword] = useState('');

    const pageparams = useParams();


    const handleChange = () => {
        if (newPassword !== sndPassword) { alert("Password not matching!\nPlease try again.") }
        else if (newPassword === '' || sndPassword === '') { alert("Input field empty") }
        else {
            axios.patch('http://mps-portal.vercel.app:5000/user/passwordupdate', {
                params: {
                    userID: (pageparams.id).substring(1),
                    newpassword: newPassword,
                }
            })
                .then(function (response) {
                    console.log(response);
                    localStorage.setItem("passwordstore", '');
                    window.location.replace('http://mps-portal.vercel.app:3000')
                }
                )
                .catch(function (error) {
                    console.log(error);
                });
        }
    };

    return (
        <div className="newpasswordwrapper">
            <div>
                <input type="password" value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder='New Password' required>
                </input><FaLock className='icon1' />
            </div>
            <div>
                <input type="password" value={sndPassword}
                    onChange={(e) => setSndPassword(e.target.value)}
                    placeholder='Insert new Password again' required>
                </input><FaLock className='icon2' />
            </div>
            <div>
                <button onClick={handleChange}>Submit</button>
            </div>
        </div>
    )
}

export default ForgotPassword;

