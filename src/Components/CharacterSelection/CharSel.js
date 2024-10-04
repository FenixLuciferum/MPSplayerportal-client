import "./CharSel.css";
import axios from 'axios';
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react'
import { useAuth } from "../AuthProvider"; 

function CharSel() {

  const [CharacterName, setCharacterName] = useState('');
  const [action, setAction] = useState('');
  const [charlist, setCharlist] = useState([]);
  const [selectedChar, setSelectedChar] = useState('');

  const auth = useAuth();

  const hoverInizia = () => {
    setAction(' hover');
  }
  const hoverFinisce = () => {
    setAction('');
  }
  const pageparams = useParams();



  // Code to enhance SPA transitions
  useEffect(() => {
    axios.get('http://mpsplayerportal-server.vercel.app/char/getchar', {
      params: {
        ownerID: pageparams.id,
      }
    })
      .then(function (response) {
        const characters = response.data.data ?? [];
        setCharlist(characters.map((character) => ({
          id: character._id,
          name: character.chaName,
        })));
        console.log(charlist);

      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  //enter character sheet
  const handleClick = (charid) => {
    setSelectedChar(charid);
    console.log(selectedChar);
    window.location.replace(`http://mpsplayerportal-client.vercel.app/CharacterSelection/${pageparams.id}/:${charid}`);

  };


  //nuovo PG
  const newChar = (event) => {
    event.preventDefault();
    axios.post('http://mpsplayerportal-server.vercel.app/char/newchar', {
      ownerID: pageparams.id,
      chaName: CharacterName,
    })
      .then(function (response) {
        event.preventDefault()
        console.log(response);
        window.location.replace(`http://mpsplayerportal-client.vercel.app/CharacterSelection/${pageparams.id}`);

      })
      .catch(function (error) {
        console.log(error);
      });
  };


  return (
    <>
      <div className="logout">
        <button type='button' onClick={() => auth.logOut()}>
          Back to Login Screen
        </button>
      </div>

      <div className={'both'}>
        <div className={`grid`}>
          {
            charlist.map((x) => (
              <div className={`char-box`} key={x.id}>
                <button type='button' onClick={() => handleClick(x.id)}>
                  <h1>{x.name}</h1>
                </button>
              </div>
            ))
          }
        </div>

        <form className={`new-char-box${action}`} onSubmit={newChar} onMouseOver={hoverInizia} onMouseOut={hoverFinisce}>
          <div className={'intbox'} >
            <button className={"buttonboxpg"} type='submit'>
              <h1>+</h1>
            </button>
            <div className="input-box-char">
              <input type="text" value={CharacterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="Insert name" required />
            </div>

          </div>
        </form>
      </div>
    </>
  );
}

export default CharSel;