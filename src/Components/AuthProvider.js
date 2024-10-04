import { useContext, createContext, useState } from "react";
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(localStorage.getItem("userstore") || "");
  const [token, setToken] = useState(localStorage.getItem("tokenstore") || "");

  const loginAction = ({ usernameLogin, playerID }) => {
    axios.post('http://mps-portal.vercel.app:5000/user/logsession', {
      user: usernameLogin,
      userID: playerID,
    })
      .then(function (response) {
        console.log(response);
        console.log(response.data.data._id);
        debugger;
        setUser(response.data.data.userID);
        setToken(response.data.data._id);
        localStorage.setItem("userstore", response.data.data.userID);
        localStorage.setItem("tokenstore", response.data.data._id);

        window.location.replace(`http://mps-portal.vercel.app:3000/CharacterSelection/:${playerID}`);
        return;
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const logOut = (event) => {
    axios.delete('http://mps-portal.vercel.app:5000/user/logout', {
      params: {tokenID: token}
    })
    .then(function (response) {
      console.log(response);

      setUser('')
      setToken('')
      localStorage.removeItem("tokenstore");
      window.location.replace(`http://mps-portal.vercel.app:3000`);

    })
    .catch(function (error) {
      console.log(error);
    });
  }

  return (<AuthContext.Provider value={{ token, user, loginAction, logOut }}>{children}</AuthContext.Provider>);
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};