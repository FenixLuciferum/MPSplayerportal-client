import "./LoginRegister.css";
import axios from 'axios';
import React, { useState } from 'react'
import AuthProvider, { useAuth } from "../AuthProvider";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const LoginRegister = () => {

    const [action, setAction] = useState('');
    const [usernameRegister, setUsernameRegister] = useState('');
    const [passwordRegister, setPasswordRegister] = useState('');
    const [emailRegister, setEmailRegister] = useState('');
    const [usernameLogin, setUsernameLogin] = useState('');
    const [passwordLogin, setPasswordLogin] = useState('');
    var playerID = String;

    const auth = useAuth();

    window.onload = function () {
        //debugger;
        console.log(auth.token);
        axios.get('http://mpsplayerportal-server.vercel.app/user/remember', {
            params: {
                remembertoken: auth.token
            }
        })
            .then(
                function (response) {
                    console.log(response);
                    if (response.data.data._id === auth.token) {
                        window.location.replace(`http://mpsplayerportal-client.vercel.app/CharacterSelection/:${response.data.data.userID}`)
                    }
                })
            .catch(function (error) {
                console.log(error);
            });
    };

    //cambia stato da login a signup
    const registerLink = () => {
        setAction(' active');
    };

    const loginLink = () => {
        setAction('');
    };

    const termsconditions = () => {
        window.open('http://mpsplayerportal-client.vercel.app/terms&conditions')
    };

    const forgotpassword = () => {
        window.open('http://mpsplayerportal-client.vercel.app/forgot')
    };

    //signup
    const handleRegister = (event) => {
        event.preventDefault();
        axios.post('http://mpsplayerportal-server.vercel.app/user/signup', {
            username: usernameRegister,
            email: emailRegister,
            password: passwordRegister
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    //login
    const handleLogin = (event) => {
        event.preventDefault();
        axios.get('http://mpsplayerportal-server.vercel.app/user/signin', {
            params: {
                username: usernameLogin,
                password: passwordLogin
            }
        })
            .then(function (response) {
                console.log(response);
                //console.log(response.data.data[0]._id)
                playerID = response.data.data[0]._id

                auth.loginAction({ usernameLogin, playerID });
                return;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div className={`wrapper${action}`}>
            <div className="form-box login">
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" value={usernameLogin}
                            onChange={(e) => setUsernameLogin(e.target.value)}
                            placeholder='Username' required />
                        <FaUser className='icon' />
                    </div>

                    <div className="input-box">
                        <input type="password" value={passwordLogin}
                            onChange={(e) => setPasswordLogin(e.target.value)}
                            placeholder='Password' required />
                        <FaLock className='icon' />
                    </div>

                    <div className="remember-forgot">
                        <a href='#' onClick={forgotpassword}>Forgot Password?</a>
                    </div>

                    <button type='submit'>Login</button>

                    <div className="register-link">
                        <p>Don't have an account?
                            <a href='#' onClick={registerLink}> Sign Up</a></p>
                    </div>

                </form>
            </div>

            <div className="form-box register">
                <form onSubmit={handleRegister}>
                    <h1>Sign Up</h1>
                    <div className="input-box">
                        <input type="text" value={usernameRegister}
                            onChange={(e) => setUsernameRegister(e.target.value)}
                            placeholder='Username' required />
                        <FaUser className='icon' />
                    </div>

                    <div className="input-box">
                        <input type="email" value={emailRegister}
                            onChange={(e) => setEmailRegister(e.target.value)}
                            placeholder='Email' required />
                        <MdEmail className='icon' />
                    </div>

                    <div className="input-box">
                        <input type="password" value={passwordRegister}
                            onChange={(e) => setPasswordRegister(e.target.value)}
                            placeholder='Password' required />
                        <FaLock className='icon' />
                    </div>

                    <div className="terms">
                        <label><input type="checkbox" required />I agree to the</label>
                        <p><a href='#' onClick={termsconditions}> Terms & Conditions</a></p>
                    </div>

                    <button type='submit'>Sign Up</button>

                    <div className="register-link">
                        <p>Already have an account?
                            <a href='#' onClick={loginLink}> Login</a></p>
                    </div>

                </form>
            </div>

        </div>
    );
};

export default LoginRegister;