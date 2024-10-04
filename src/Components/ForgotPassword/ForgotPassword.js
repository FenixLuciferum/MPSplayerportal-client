import "./ForgotPassword.css";
import React, { useState } from 'react'
import { MdEmail } from "react-icons/md";
import axios from 'axios';


const ForgotPassword = () => {

    const [isSent, setSent] = useState('');
    const [emailForgot, setEmailForgot] = useState('')

    const handleForgot = () => {
        axios.get('https://mpsplayerportal-server.vercel.app/user/forgotpassword', {
            params: {
                email: emailForgot
            }
        })
            .then(function (response) {
                console.log(response);
                console.log(response.data.data[0].resettoken)
                localStorage.setItem("passwordstore", response.data.data[0].resettoken);
                setSent(' sent')
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <>
            <div className="aftersent">
                <h1>Email has been sent!</h1>
                Please check your inbox to proceed.
            </div>
            <div className={`forgotpasswordwrapper${isSent}`}>
                <p>Please insert the Email used in your MPS Player Portal account registration.</p>
                <form >
                    <div className="inputforgotmail">
                        <input type="email" value={emailForgot}
                            onChange={(e) => setEmailForgot(e.target.value)}
                            placeholder='Email' required />
                        <MdEmail className='icon' />

                    </div>
                </form>
                <button className="buttonforgot" onClick={handleForgot}>Submit</button>
            </div>
        </>
    );
}

export default ForgotPassword;