import "./CharacterSheet.css";
import axios from 'axios';
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react'
import { MdOutlineSettingsBackupRestore } from "react-icons/md";
import { FaExclamationCircle, FaSave } from "react-icons/fa";
import { FaUpload } from "react-icons/fa6";



function CharacterSheet() {

    const pageparams = useParams();

    const [charData, setCharData] = useState(['']);
    const [hasLoaded, setLoaded] = useState(false);
    const [hasWaited, setWaited] = useState(false);

    const [relaName, setRelaName] = useState('')
    const [relaPara, setRelaPara] = useState('')
    const [relaEffects, setRelaEffects] = useState('')

    const [rivaName, setRivaName] = useState('')
    const [rivaPara, setRivaPara] = useState('')
    const [rivaEffects, setRivaEffects] = useState('')

    const [action, setAction] = useState('');

    const hoverInizia = () => {
        setAction(' hover');
    }
    const hoverFinisce = () => {
        setAction('');
    }

    // Code to enhance SPA transitions
    useEffect(() => {
        axios.get('http://mpsplayerportal-server.vercel.app/char/getchar', {
            params: {
                ownerID: pageparams.id,
            }
        })
            .then(function (response) {
                console.log(response);

                const characters = response.data.data ?? [];
                for (let i = 0; i < characters.length; i++) {
                    if (characters[i]._id === (pageparams.character).substring(1)) {
                        setCharData([characters[i]]);
                    }
                }
                setLoaded(true);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);


    //Back to list
    const handleBack = () => {

        axios.put('http://mpsplayerportal-server.vercel.app/char/save', {
            params: {
                data: charData,
                char: pageparams.character,
            }
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });

        window.location.replace(`http://mpsplayerportal-client.vercel.app/CharacterSelection/${pageparams.id}`);
    };

    //Handle Experience
    const handleExp = (e) => {
        let newArr = [...charData];
        newArr[0].exp = e
        if (newArr[0].exp === newArr[0].exp_threshold) {
            newArr[0].exp = 0;
            newArr[0].exp_threshold += 2;
            newArr[0].tokens += 1;
        }
        setCharData(newArr);
    }

    //Handle Experience Cutout due to Ambitions
    const handleAmbition = () => {
        let newArr = [...charData];
        newArr[0].exp_threshold = Math.ceil(newArr[0].exp_threshold / 2)

        if (newArr[0].exp === newArr[0].exp_threshold) {
            newArr[0].exp = 0;
            newArr[0].exp_threshold += 2;
            newArr[0].tokens += 1;
        } else if (newArr[0].exp > newArr[0].exp_threshold) {
            newArr[0].exp -= newArr[0].exp_threshold;
            newArr[0].exp_threshold += 2;
            newArr[0].tokens += 1;
        }
        setCharData(newArr);
    }

    //Handle changes to charData
    const handleChange = (e, parvalue) => {
        let newArr = [...charData];
        newArr[0][`${parvalue}`] = e;

        if ((newArr[0].carried_carrier + newArr[0].carried_weight) > (newArr[0].tier_value) * 1.5) {
            newArr[0].fst_tier = true;
            newArr[0].snd_tier = true;
            newArr[0].trd_tier = true;
        } else if ((newArr[0].carried_carrier + newArr[0].carried_weight) > newArr[0].tier_value) {
            newArr[0].fst_tier = true;
            newArr[0].snd_tier = true;
        } else if (newArr[0].carried_weight > (newArr[0].tier_value) / 2) {
            newArr[0].fst_tier = true;
        } else {
            newArr[0].fst_tier = false;
            newArr[0].snd_tier = false;
            newArr[0].trd_tier = false;
        }

        console.log(newArr[0].mw_reroll)

        setCharData(newArr);
    }

    //Handle changes to charData for rela/riva
    const handleChangeRela = (e, parvalue, i, paraobj) => {
        let newArr = [...charData];
        newArr[0][`${parvalue}`][i][`${paraobj}`] = e
        setCharData(newArr);
    }

    //Handle new Rela
    const handleNewRela = () => {
        let newArr = [...charData];
        let newrela = {
            name: relaName,
            para: relaPara,
            effects: relaEffects,
        }
        setWaited(true);
        (newArr[0].relationships).push(newrela);
        setCharData(newArr);

    };

    //Handle new Riva
    const handleNewRiva = () => {
        let newArr = [...charData];
        let newriva = {
            name: rivaName,
            para: rivaPara,
            effects: rivaEffects,
        }
        setWaited(true);
        (newArr[0].rivalries).push(newriva);
        setCharData(newArr);

    };

    if (hasLoaded === false) {
        return null;
    } else {
        return (
            <div className={'character_sheet'}>

                <div className={`backbutton${action}`} onMouseOver={hoverInizia} onMouseOut={hoverFinisce}>
                    <button type='button' onClick={() => handleBack()} >
                        Save & Back to Character List <FaSave />
                    </button>
                </div>

                <h1>{charData[0].chaName}</h1>

                <div className="sheetwrapper">
                    <div className="left">
                        <h2>IDENTITY</h2>
                        <div className={'identity'}>
                            <div className="culture">
                                Culture: <input type="text" value={charData[0].culture} placeholder={`${charData[0].culture}`} onChange={(e) => handleChange(String(e.target.value), "culture")} />
                                Race: <input type="text" value={charData[0].race} placeholder={`${charData[0].race}`} onChange={(e) => handleChange(String(e.target.value), "race")} />
                                Faith: <input type="text" value={charData[0].faith} placeholder={`${charData[0].faith}`} onChange={(e) => handleChange(String(e.target.value), "faith")} />
                            </div>
                            <div className="carreer">
                                Breakpoint: <input type="text" value={charData[0].breakpoint} placeholder={`${charData[0].breakpoint}`} onChange={(e) => handleChange(String(e.target.value), "breakpoint")} />
                                Carrer: <input type="text" value={charData[0].carrer} placeholder={`${charData[0].carrer}`} onChange={(e) => handleChange(String(e.target.value), "carrer")} />
                            </div>
                            <div className="langfeat">
                                Features: <input type="text" value={charData[0].features} placeholder={`${charData[0].features}`} onChange={(e) => handleChange(String(e.target.value), "features")} />
                            </div>
                            <div className="langfeat">
                                Languages: <input type="text" value={charData[0].languages} placeholder={`${charData[0].languages}`} onChange={(e) => handleChange(String(e.target.value), "languages")} />
                            </div>
                        </div>

                        <h2>VIRTUES</h2>
                        <div className={'virtues'}>
                            <div className={'physical'}>
                                <h3>Physical</h3>
                                <div className="onevir">
                                    MGT: <input type="number" min="1" max="6" value={charData[0].mgt} placeholder={`${charData[0].mgt}`} onChange={(e) => handleChange(Number(e.target.value), "mgt")} />
                                    Stress: <input type="number" min="0" max="6" value={charData[0].mgt_stress} placeholder={`${charData[0].mgt_stress}`} onChange={(e) => handleChange(Number(e.target.value), "mgt_stress")} />
                                </div>
                                <div className="onevir">
                                    FIN: <input type="number" min="1" max="6" value={charData[0].fin} placeholder={`${charData[0].fin}`} onChange={(e) => handleChange(Number(e.target.value), "fin")} />
                                    Stress: <input type="number" min="0" max="6" value={charData[0].fin_stress} placeholder={`${charData[0].fin_stress}`} onChange={(e) => handleChange(Number(e.target.value), "fin_stress")} />
                                </div>
                            </div>
                            <div className={'prowess'}>
                                <h3>Prowess</h3>
                                <div className="onevir">
                                    INS: <input type="number" min="1" max="6" value={charData[0].ins} placeholder={`${charData[0].ins}`} onChange={(e) => handleChange(Number(e.target.value), "ins")} />
                                    Stress: <input type="number" min="0" max="6" value={charData[0].ins_stress} placeholder={`${charData[0].ins_stress}`} onChange={(e) => handleChange(Number(e.target.value), "ins_stress")} />
                                </div>
                                <div className="onevir">
                                    CHA: <input type="number" min="1" max="6" value={charData[0].cha} placeholder={`${charData[0].cha}`} onChange={(e) => handleChange(Number(e.target.value), "cha")} />
                                    Stress: <input type="number" min="0" max="6" value={charData[0].cha_stress} placeholder={`${charData[0].cha_stress}`} onChange={(e) => handleChange(Number(e.target.value), "cha_stress")} />
                                </div>
                            </div>
                            <div className={'mental'}>
                                <h3>Mental</h3>
                                <div className="onevir">
                                    ERU: <input type="number" min="1" max="6" value={charData[0].eru} placeholder={`${charData[0].eru}`} onChange={(e) => handleChange(Number(e.target.value), "eru")} />
                                    Stress: <input type="number" min="0" max="6" value={charData[0].eru_stress} placeholder={`${charData[0].eru_stress}`} onChange={(e) => handleChange(Number(e.target.value), "eru_stress")} />
                                </div>
                                <div className="onevir">
                                    WPW: <input type="number" min="1" max="6" value={charData[0].wpw} placeholder={`${charData[0].wpw}`} onChange={(e) => handleChange(Number(e.target.value), "wpw")} />
                                    Stress: <input type="number" min="0" max="6" value={charData[0].wpw_stress} placeholder={`${charData[0].wpw_stress}`} onChange={(e) => handleChange(Number(e.target.value), "wpw_stress")} />
                                </div>
                            </div>
                        </div>

                        <h2>MASTERIES</h2>
                        <div className={'masteries'}>
                            <div className={'training'}>
                                <h3>Training</h3>
                                Melee Weapons: <input type="number" min="0" max="6" value={charData[0].melee_weapons} placeholder={`${charData[0].melee_weapons}`} onChange={(e) => handleChange(Number(e.target.value), "melee_weapons")} />
                                <div className={'specbox'}>
                                    <textarea value={charData[0].mw_specs} placeholder={`${charData[0].mw_specs}`} onChange={(e) => handleChange(String(e.target.value), "mw_specs")} />
                                    <div>
                                        <input type="checkbox" value={charData[0].mw_reroll} placeholder={`${charData[0].mw_reroll}`} onChange={(e) => handleChange(Boolean(e.target.value), "mw_reroll")} />Reroll <MdOutlineSettingsBackupRestore />
                                        <input type="checkbox" value={charData[0].mw_flaw} placeholder={`${charData[0].mw_flaw}`} onChange={(e) => handleChange(Boolean(e.target.value), "mw_flaw")} />Flaw <FaExclamationCircle />
                                    </div>
                                </div>

                                Ranged Weapons: <input type="number" min="0" max="6" value={charData[0].ranged_weapons} placeholder={`${charData[0].ranged_weapons}`} onChange={(e) => handleChange(Number(e.target.value), "ranged_weapons")} />
                                <div className={'specbox'}>
                                    <textarea value={charData[0].rw_specs} placeholder={`${charData[0].rw_specs}`} onChange={(e) => handleChange(String(e.target.value), "rw_specs")} />
                                    <div>
                                        <input type="checkbox" value={charData[0].rw_reroll} placeholder={`${charData[0].rw_reroll}`} onChange={(e) => handleChange(Boolean(e.target.value), "rw_reroll")} />Reroll <MdOutlineSettingsBackupRestore />
                                        <input type="checkbox" value={charData[0].rw_flaw} placeholder={`${charData[0].rw_flaw}`} onChange={(e) => handleChange(Boolean(e.target.value), "rw_flaw")} />Flaw <FaExclamationCircle />
                                    </div>
                                </div>

                                Catalysts: <input type="number" min="0" max="6" value={charData[0].catalysts} placeholder={`${charData[0].catalysts}`} onChange={(e) => handleChange(Number(e.target.value), "catalysts")} />
                                <div className={'specbox'}>
                                    <textarea value={charData[0].cata_specs} placeholder={`${charData[0].cata_specs}`} onChange={(e) => handleChange(String(e.target.value), "cata_specs")} />
                                    <div>
                                        <input type="checkbox" value={charData[0].cata_reroll} placeholder={`${charData[0].cata_reroll}`} onChange={(e) => handleChange(Boolean(e.target.value), "cata_reroll")} />Reroll <MdOutlineSettingsBackupRestore />
                                        <input type="checkbox" value={charData[0].cata_flaw} placeholder={`${charData[0].cata_flaw}`} onChange={(e) => handleChange(Boolean(e.target.value), "cata_flaw")} />Flaw <FaExclamationCircle />
                                    </div>
                                </div>

                                Talents: <input type="number" min="0" max="6" value={charData[0].talents} placeholder={`${charData[0].talents}`} onChange={(e) => handleChange(Number(e.target.value), "talents")} />
                                <div className={'specbox'}>
                                    <textarea value={charData[0].tale_specs} placeholder={`${charData[0].tale_specs}`} onChange={(e) => handleChange(String(e.target.value), "tale_specs")} />
                                    <div>
                                        <input type="checkbox" value={charData[0].tale_reroll} placeholder={`${charData[0].tale_reroll}`} onChange={(e) => handleChange(Boolean(e.target.value), "tale_reroll")} />Reroll <MdOutlineSettingsBackupRestore />
                                        <input type="checkbox" value={charData[0].tale_flaw} placeholder={`${charData[0].tale_flaw}`} onChange={(e) => handleChange(Boolean(e.target.value), "tale_flaw")} />Flaw <FaExclamationCircle />
                                    </div>
                                </div>

                                Brawl: <input type="number" min="0" max="6" value={charData[0].brawl} placeholder={`${charData[0].brawl}`} onChange={(e) => handleChange(Number(e.target.value), "brawl")} />
                                <div className={'specbox'}>
                                    <textarea value={charData[0].brawl_specs} placeholder={`${charData[0].brawl_specs}`} onChange={(e) => handleChange(String(e.target.value), "brawl_specs")} />
                                    <div>
                                        <input type="checkbox" value={charData[0].brawl_reroll} placeholder={`${charData[0].brawl_reroll}`} onChange={(e) => handleChange(Boolean(e.target.value), "brawl_reroll")} />Reroll <MdOutlineSettingsBackupRestore />
                                        <input type="checkbox" value={charData[0].brawl_flaw} placeholder={`${charData[0].brawl_flaw}`} onChange={(e) => handleChange(Boolean(e.target.value), "brawl_flaw")} />Flaw <FaExclamationCircle />
                                    </div>
                                </div>

                                Defence: <input type="number" min="0" max="6" value={charData[0].defence} placeholder={`${charData[0].defence}`} onChange={(e) => handleChange(Number(e.target.value), "defence")} />
                                <div className={'specbox'}>
                                    <textarea value={charData[0].def_specs} placeholder={`${charData[0].def_specs}`} onChange={(e) => handleChange(String(e.target.value), "def_specs")} />
                                    <div>
                                        <input type="checkbox" value={charData[0].def_reroll} placeholder={`${charData[0].def_reroll}`} onChange={(e) => handleChange(Boolean(e.target.value), "def_reroll")} />Reroll <MdOutlineSettingsBackupRestore />
                                        <input type="checkbox" value={charData[0].def_flaw} placeholder={`${charData[0].def_flaw}`} onChange={(e) => handleChange(Boolean(e.target.value), "def_flaw")} />Flaw <FaExclamationCircle />
                                    </div>
                                </div>
                            </div>

                            <div className={'proficiency'}>
                                <h3>Proficiency</h3>
                                Survival: <input type="number" min="0" max="6" value={charData[0].survival} placeholder={`${charData[0].survival}`} onChange={(e) => handleChange(Number(e.target.value), "survival")} />
                                <div className={'specbox'}>
                                    <textarea value={charData[0].surv_specs} placeholder={`${charData[0].surv_specs}`} onChange={(e) => handleChange(String(e.target.value), "surv_specs")} />
                                    <div>
                                        <input type="checkbox" value={charData[0].surv_reroll} placeholder={`${charData[0].surv_reroll}`} onChange={(e) => handleChange(Boolean(e.target.value), "surv_reroll")} />Reroll <MdOutlineSettingsBackupRestore />
                                        <input type="checkbox" value={charData[0].surv_flaw} placeholder={`${charData[0].surv_flaw}`} onChange={(e) => handleChange(Boolean(e.target.value), "surv_flaw")} />Flaw <FaExclamationCircle />
                                    </div>
                                </div>

                                Exploring: <input type="number" min="0" max="6" value={charData[0].exploring} placeholder={`${charData[0].exploring}`} onChange={(e) => handleChange(Number(e.target.value), "exploring")} />
                                <div className={'specbox'}>
                                    <textarea value={charData[0].ex_specs} placeholder={`${charData[0].ex_specs}`} onChange={(e) => handleChange(String(e.target.value), "ex_specs")} />
                                    <div>
                                        <input type="checkbox" value={charData[0].ex_reroll} placeholder={`${charData[0].ex_reroll}`} onChange={(e) => handleChange(Boolean(e.target.value), "ex_reroll")} />Reroll <MdOutlineSettingsBackupRestore />
                                        <input type="checkbox" value={charData[0].ex_flaw} placeholder={`${charData[0].ex_flaw}`} onChange={(e) => handleChange(Boolean(e.target.value), "ex_flaw")} />Flaw <FaExclamationCircle />
                                    </div>
                                </div>

                                Subterfuge: <input type="number" min="0" max="6" value={charData[0].subterfuge} placeholder={`${charData[0].subterfuge}`} onChange={(e) => handleChange(Number(e.target.value), "subterfuge")} />
                                <div className={'specbox'}>
                                    <textarea value={charData[0].sub_specs} placeholder={`${charData[0].sub_specs}`} onChange={(e) => handleChange(String(e.target.value), "sub_specs")} />
                                    <div>
                                        <input type="checkbox" value={charData[0].sub_reroll} placeholder={`${charData[0].sub_reroll}`} onChange={(e) => handleChange(Boolean(e.target.value), "sub_reroll")} />Reroll <MdOutlineSettingsBackupRestore />
                                        <input type="checkbox" value={charData[0].sub_flaw} placeholder={`${charData[0].sub_flaw}`} onChange={(e) => handleChange(Boolean(e.target.value), "sub_flaw")} />Flaw <FaExclamationCircle />
                                    </div>
                                </div>

                                Persuasion: <input type="number" min="0" max="6" value={charData[0].persuasion} placeholder={`${charData[0].persuasion}`} onChange={(e) => handleChange(Number(e.target.value), "persuasion")} />
                                <div className={'specbox'}>
                                    <textarea value={charData[0].per_specs} placeholder={`${charData[0].per_specs}`} onChange={(e) => handleChange(String(e.target.value), "per_specs")} />
                                    <div>
                                        <input type="checkbox" value={charData[0].per_reroll} placeholder={`${charData[0].per_reroll}`} onChange={(e) => handleChange(Boolean(e.target.value), "per_reroll")} />Reroll <MdOutlineSettingsBackupRestore />
                                        <input type="checkbox" value={charData[0].per_flaw} placeholder={`${charData[0].per_flaw}`} onChange={(e) => handleChange(Boolean(e.target.value), "per_flaw")} />Flaw <FaExclamationCircle />
                                    </div>
                                </div>

                                Art: <input type="number" min="0" max="6" value={charData[0].art} placeholder={`${charData[0].art}`} onChange={(e) => handleChange(Number(e.target.value), "art")} />
                                <div className={'specbox'}>
                                    <textarea value={charData[0].art_specs} placeholder={`${charData[0].art_specs}`} onChange={(e) => handleChange(String(e.target.value), "art_specs")} />
                                    <div>
                                        <input type="checkbox" value={charData[0].art_reroll} placeholder={`${charData[0].art_reroll}`} onChange={(e) => handleChange(Boolean(e.target.value), "art_reroll")} />Reroll <MdOutlineSettingsBackupRestore />
                                        <input type="checkbox" value={charData[0].art_flaw} placeholder={`${charData[0].art_flaw}`} onChange={(e) => handleChange(Boolean(e.target.value), "art_flaw")} />Flaw <FaExclamationCircle />
                                    </div>
                                </div>

                                Medicine: <input type="number" min="0" max="6" value={charData[0].medicine} placeholder={`${charData[0].medicine}`} onChange={(e) => handleChange(Number(e.target.value), "medicine")} />
                                <div className={'specbox'}>
                                    <textarea value={charData[0].med_specs} placeholder={`${charData[0].med_specs}`} onChange={(e) => handleChange(String(e.target.value), "med_specs")} />
                                    <div>
                                        <input type="checkbox" value={charData[0].med_reroll} placeholder={`${charData[0].med_reroll}`} onChange={(e) => handleChange(Boolean(e.target.value), "med_reroll")} />Reroll <MdOutlineSettingsBackupRestore />
                                        <input type="checkbox" value={charData[0].med_flaw} placeholder={`${charData[0].med_flaw}`} onChange={(e) => handleChange(Boolean(e.target.value), "med_flaw")} />Flaw <FaExclamationCircle />
                                    </div>
                                </div>
                            </div>

                            <div className={'lore'}>
                                <h3>Lore</h3>
                                Academics: <input type="number" min="0" max="6" value={charData[0].academics} placeholder={`${charData[0].academics}`} onChange={(e) => handleChange(Number(e.target.value), "academics")} />
                                <div className={'specbox'}>
                                    <textarea value={charData[0].aca_specs} placeholder={`${charData[0].aca_specs}`} onChange={(e) => handleChange(String(e.target.value), "aca_specs")} />
                                    <div>
                                        <input type="checkbox" value={charData[0].aca_reroll} placeholder={`${charData[0].aca_reroll}`} onChange={(e) => handleChange(Boolean(e.target.value), "aca_reroll")} />Reroll <MdOutlineSettingsBackupRestore />
                                        <input type="checkbox" value={charData[0].aca_flaw} placeholder={`${charData[0].aca_flaw}`} onChange={(e) => handleChange(Boolean(e.target.value), "aca_flaw")} />Flaw <FaExclamationCircle />
                                    </div>
                                </div>

                                Urban: <input type="number" min="0" max="6" value={charData[0].urban} placeholder={`${charData[0].urban}`} onChange={(e) => handleChange(Number(e.target.value), "urban")} />
                                <div className={'specbox'}>
                                    <textarea value={charData[0].urb_specs} placeholder={`${charData[0].urb_specs}`} onChange={(e) => handleChange(String(e.target.value), "urb_specs")} />
                                    <div>
                                        <input type="checkbox" value={charData[0].urb_reroll} placeholder={`${charData[0].urb_reroll}`} onChange={(e) => handleChange(Boolean(e.target.value), "urb_reroll")} />Reroll <MdOutlineSettingsBackupRestore />
                                        <input type="checkbox" value={charData[0].urb_flaw} placeholder={`${charData[0].urb_flaw}`} onChange={(e) => handleChange(Boolean(e.target.value), "urb_flaw")} />Flaw <FaExclamationCircle />
                                    </div>
                                </div>

                                Arcane: <input type="number" min="0" max="6" value={charData[0].arcane} placeholder={`${charData[0].arcane}`} onChange={(e) => handleChange(Number(e.target.value), "arcane")} />
                                <div className={'specbox'}>
                                    <textarea value={charData[0].arcane_specs} placeholder={`${charData[0].arcane_specs}`} onChange={(e) => handleChange(String(e.target.value), "arcane_specs")} />
                                    <div>
                                        <input type="checkbox" value={charData[0].arcane_reroll} placeholder={`${charData[0].arcane_reroll}`} onChange={(e) => handleChange(Boolean(e.target.value), "arcane_reroll")} />Reroll <MdOutlineSettingsBackupRestore />
                                        <input type="checkbox" value={charData[0].arcane_flaw} placeholder={`${charData[0].arcane_flaw}`} onChange={(e) => handleChange(Boolean(e.target.value), "arcane_flaw")} />Flaw <FaExclamationCircle />
                                    </div>
                                </div>

                                Kosmology: <input type="number" min="0" max="6" value={charData[0].kosmology} placeholder={`${charData[0].kosmology}`} onChange={(e) => handleChange(Number(e.target.value), "kosmology")} />
                                <div className={'specbox'}>
                                    <textarea value={charData[0].kosm_specs} placeholder={`${charData[0].kosm_specs}`} onChange={(e) => handleChange(String(e.target.value), "kosm_specs")} />
                                    <div>
                                        <input type="checkbox" value={charData[0].kosm_reroll} placeholder={`${charData[0].kosm_reroll}`} onChange={(e) => handleChange(Boolean(e.target.value), "kosm_reroll")} />Reroll <MdOutlineSettingsBackupRestore />
                                        <input type="checkbox" value={charData[0].kosm_flaw} placeholder={`${charData[0].kosm_flaw}`} onChange={(e) => handleChange(Boolean(e.target.value), "kosm_flaw")} />Flaw <FaExclamationCircle />
                                    </div>
                                </div>

                                Esoterism: <input type="number" min="0" max="6" value={charData[0].esoterism} placeholder={`${charData[0].esoterism}`} onChange={(e) => handleChange(Number(e.target.value), "esoterism")} />
                                <div className={'specbox'}>
                                    <textarea value={charData[0].eso_specs} placeholder={`${charData[0].eso_specs}`} onChange={(e) => handleChange(String(e.target.value), "eso_specs")} />
                                    <div>
                                        <input type="checkbox" value={charData[0].eso_reroll} placeholder={`${charData[0].eso_reroll}`} onChange={(e) => handleChange(Boolean(e.target.value), "eso_reroll")} />Reroll <MdOutlineSettingsBackupRestore />
                                        <input type="checkbox" value={charData[0].eso_flaw} placeholder={`${charData[0].eso_flaw}`} onChange={(e) => handleChange(Boolean(e.target.value), "eso_flaw")} />Flaw <FaExclamationCircle />
                                    </div>
                                </div>

                                Natural: <input type="number" min="0" max="6" value={charData[0].natural} placeholder={`${charData[0].natural}`} onChange={(e) => handleChange(Number(e.target.value), "natural")} />
                                <div className={'specbox'}>
                                    <textarea value={charData[0].nat_specs} placeholder={`${charData[0].nat_specs}`} onChange={(e) => handleChange(String(e.target.value), "nat_specs")} />
                                    <div>
                                        <input type="checkbox" value={charData[0].nat_reroll} placeholder={`${charData[0].nat_reroll}`} onChange={(e) => handleChange(Boolean(e.target.value), "nat_reroll")} />Reroll <MdOutlineSettingsBackupRestore />
                                        <input type="checkbox" value={charData[0].nat_flaw} placeholder={`${charData[0].nat_flaw}`} onChange={(e) => handleChange(Boolean(e.target.value), "nat_flaw")} />Flaw <FaExclamationCircle />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h2>INVENTORY & ENCUMBERMENT</h2>
                        <div className={'inventory'}>
                            <div className="invalues">
                                <div>
                                    Tier Value: <input type="number" step=".1" min="0" value={charData[0].tier_value} placeholder={`${charData[0].tier_value}`} onChange={(e) => handleChange(Number(e.target.value), "tier_value")} /> kg
                                </div>
                                <div>
                                    Weight in Personal Inventory: <input type="number" step=".1" min="0" value={charData[0].carried_weight} placeholder={`${charData[0].carried_weight}`} onChange={(e) => handleChange(Number(e.target.value), "carried_weight")} /> kg
                                </div>
                                <div>
                                    Weight in Carrier Inventory: <input type="number" step=".1" min="0" value={charData[0].carried_carrier} placeholder={`${charData[0].carried_carrier}`} onChange={(e) => handleChange(Number(e.target.value), "carried_carrier")} /> kg
                                </div>
                            </div>
                            <div className="boxes">
                                <div>
                                    Personal Inventory: <textarea value={charData[0].personal_inventory} placeholder={`${charData[0].personal_inventory}`} onChange={(e) => handleChange(String(e.target.value), "personal_inventory")} />
                                </div>
                                <div>
                                    Carriers' Inventory: <textarea value={charData[0].carrier_inventory} placeholder={`${charData[0].carrier_inventory}`} onChange={(e) => handleChange(String(e.target.value), "carrier_inventory")} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="right">
                        <h2>COMPLEXION</h2>
                        <div className={'complexion'}>
                            <div className="resilience">
                                Resilience: <input type="number" min="1" value={charData[0].resilience} placeholder={`${charData[0].resilience}`} onChange={(e) => handleChange(Number(e.target.value), "resilience")} />
                                Speed: <input type="number" min="1" value={charData[0].speed} placeholder={`${charData[0].speed}`} onChange={(e) => handleChange(Number(e.target.value), "speed")} />
                                Initiative: <input type="number" min="1" value={charData[0].initiative} placeholder={`${charData[0].initiative}`} onChange={(e) => handleChange(Number(e.target.value), "initiative")} />
                            </div>
                            <div className="momentum">
                                Momentum: <input type="number" min="6" value={charData[0].momentum} placeholder={`${charData[0].momentum}`} onChange={(e) => handleChange(Number(e.target.value), "momentum")} />
                                Size: <input type="text" value={charData[0].size} placeholder={`${charData[0].size}`} onChange={(e) => handleChange(String(e.target.value), "size")} />
                                Size Modifier: <input type="number" value={charData[0].size_modifier} placeholder={`${charData[0].size_modifier}`} onChange={(e) => handleChange(Number(e.target.value), "size_modifier")} />
                            </div>
                            <div className="ambition">
                                Ambition: <textarea value={charData[0].ambition} placeholder={`${charData[0].ambition}`} onChange={(e) => handleChange(String(e.target.value), "ambition")} />
                            </div>
                        </div>

                        <h2>WOUNDS, ILLNESSES & FAINTS</h2>
                        <div className={'wounds'}>
                            <textarea value={charData[0].wounds} placeholder={`${charData[0].wounds}`} onChange={(e) => handleChange(String(e.target.value), "wounds")} />
                        </div>

                        <div className="expandsoul">
                            <div>
                                <h2>EXPERIENCE</h2>
                                <div className={'experience'}>
                                    <div>
                                        EXP: <input type="number" min="0" max={`${charData[0].exp_threshold}`} value={charData[0].exp} placeholder={`${charData[0].exp}`} onChange={(e) => handleExp(Number(e.target.value))} />
                                        / {charData[0].exp_threshold}
                                    </div>
                                    Tokens: <input type="number" min="0" max={`${charData[0].tokens}`} value={charData[0].tokens} placeholder={`${charData[0].tokens}`} onChange={(e) => handleChange(Number(e.target.value), "tokens")} />
                                    <button type='button' onClick={() => handleAmbition()}>
                                        Ambition Fulfilled!
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h2>SOUL & BLOOD</h2>
                                <div className={'soulblood'}>
                                    <div className="soulstuff">
                                        Soul Level: <input type="text" value={charData[0].soul_level} placeholder={`${charData[0].soul_level}`} onChange={(e) => handleChange(String(e.target.value), "soul_level")} />
                                        Soul Affliction: <input type="text" value={charData[0].soul_affliction} placeholder={`${charData[0].soul_affliction}`} onChange={(e) => handleChange(String(e.target.value), "soul_affliction")} />
                                    </div>
                                    <div className="bloodstuff">
                                        Blood Level: <input type="text" value={charData[0].blood_level} placeholder={`${charData[0].blood_level}`} onChange={(e) => handleChange(String(e.target.value), "blood_level")} />
                                        Blood Affliction: <input type="text" value={charData[0].blood_affliction} placeholder={`${charData[0].blood_affliction}`} onChange={(e) => handleChange(String(e.target.value), "blood_affliction")} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h2>RELATIONSHIPS & RIVALRIES</h2>
                        {/* relationships */}
                        <div className={'relationships'}>

                            <div className="relabel">
                                <h3>Add New Relationship</h3>
                                <button type='button' onClick={() => handleNewRela()}>
                                    <FaUpload />
                                </button>
                            </div>
                            <div className="newrelapara">
                                <div className="namepa">
                                    <div>
                                        Name: <input type="text" placeholder='e.g. Jurgen Ruderth Bjorn' onChange={(e) => setRelaName(e.target.value)} />
                                    </div>
                                    <div>
                                        Parameters: <input type="text" placeholder='e.g. Military, Individual, Local' onChange={(e) => setRelaPara(e.target.value)} />
                                    </div>
                                </div>
                                <div className="effects">
                                    Effects: <textarea placeholder='e.g. Authorizes an Arxian bombardment on the area.' onChange={(e) => setRelaEffects(e.target.value)} />
                                </div>
                            </div>

                            {(charData[0].relationships).map((x, i) =>
                                <div className="relapara">
                                    <div className="namepa">
                                        <div>
                                            Name: <input type="text" value={x.name} placeholder={`${x.name}`} onChange={(e) => handleChangeRela((e.target.value), 'relationships', i, 'name')} />
                                        </div>
                                        <div>
                                            Parameters: <input type="text" value={x.para} placeholder={`${x.para}`} onChange={(e) => handleChangeRela((e.target.value), 'relationships', i, 'para')} />
                                        </div>
                                    </div>
                                    <div className="effects">
                                        Effects: <textarea value={x.effects} placeholder={`${x.effects}`} onChange={(e) => handleChangeRela((e.target.value), 'relationships', i, 'effects')} />
                                    </div>
                                </div>
                            )}


                            {/* rivalries */}

                            <div className="rivabel">
                                <h3>Add New Rivalry</h3>
                                <button type='button' onClick={() => handleNewRiva()}>
                                    <FaUpload />
                                </button>
                            </div>

                            <div className="newrelapara">
                                <div className="namepa">
                                    <div>
                                        Name: <input type="text" placeholder='e.g. Kalth Golden Hand' onChange={(e) => setRivaName(e.target.value)} />
                                    </div>
                                    <div>
                                        Parameters: <input type="text" placeholder='e.g. Divine, Individual, Personal' onChange={(e) => setRivaPara(e.target.value)} />
                                    </div>
                                </div>
                                <div className="effects">
                                    Effects: <textarea placeholder="e.g. Raises the Champion's stress every hour." onChange={(e) => setRivaEffects(e.target.value)} />
                                </div>
                            </div>

                            {(charData[0].rivalries).map((x, i) =>
                                <div className="relapara">
                                    <div className="namepa">
                                        <div>
                                            Name: <input type="text" value={x.name} placeholder={`${x.name}`} onChange={(e) => handleChangeRela((e.target.value), 'rivalries', i, 'name')} />
                                        </div>
                                        <div>
                                            Parameters: <input type="text" value={x.para} placeholder={`${x.para}`} onChange={(e) => handleChangeRela((e.target.value), 'rivalries', i, 'para')} />
                                        </div>
                                    </div>
                                    <div className="effects">
                                        Effects: <textarea value={x.effects} placeholder={`${x.effects}`} onChange={(e) => handleChangeRela((e.target.value), 'rivalries', i, 'effects')} />
                                    </div>
                                </div>
                            )}

                        </div>

                        <h2>FATEFUL EVENTS</h2>
                        <div className={'fatefulevents'}>
                            <div className="cardeck">
                                <h3>Suits Deck</h3>
                                <textarea value={charData[0].suits_deck} placeholder={`${charData[0].suits_deck}`} onChange={(e) => handleChange(String(e.target.value), "suits_deck")} />
                            </div>
                            <div className="cardeck">
                                <h3>Tarots Deck</h3>
                                <textarea value={charData[0].tarots_deck} placeholder={`${charData[0].tarots_deck}`} onChange={(e) => handleChange(String(e.target.value), "tarots_deck")} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
};

export default CharacterSheet;