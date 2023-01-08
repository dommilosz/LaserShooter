import {getSessions, putSession, url} from "../../api/backendApi";
import React, {useContext, useEffect, useState} from "react";
import {SettingItem} from "../../views/SettingsView";
import {sessionContext} from "../../App";
import moment from "moment/moment";
import Button from '@mui/material/Button';
import {Select} from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

export default function (){
    const {sessionInfo} = useContext(sessionContext);
    let sessionTime = moment(Number(sessionInfo.session));
    let [sessions, setSessions] = useState<string[]>([]);
    useEffect(()=>{
        (async()=>{
            setSessions(await getSessions())
        })()
    },[])
    let [selectedSession, setSelectedSession] = useState(0);

    return <SettingItem >
        <div className={"settings-text"}>Current Session: {sessionInfo.session}</div>
        <div className={"settings-text"}>Session Date: {sessionTime.format("LLL")}</div>
        <div className={"settings-text"}>Load Session: </div>

        <FormControl variant="standard" sx={{ m: 1, minWidth: "100%" }}>
            <InputLabel id="session-select-label">Session</InputLabel>
        <Select
            labelId="session-select-label"
            label={"Session"}
            onChange={(e)=>{{
                setSelectedSession(Number(e.target.value));
            }}}
            defaultValue={""}
        >
            {sessions.map(session=>{
                return <MenuItem value={session} key={session}>{session}</MenuItem>
            })}
        </Select>
        </FormControl>
        <Button variant="contained" color="success" onClick={async ()=>{
            if(selectedSession <= 0){
                alert("Please select valid session");
                return;
            }
            try{
                let resp = await putSession(selectedSession);
                if(resp.status !== 200){
                    alert(await resp.text());
                    return;
                }
                alert("changed")
            }catch(e){
                alert(e)
            }


        }}>Load</Button>
        <Button variant="contained" onClick={async ()=>{
            try{
                let resp = await putSession();
                if(resp.status !== 200){
                    alert(await resp.text());
                    return;
                }
                alert("changed")
            }catch(e){
                alert(e)
            }


        }}>New Session</Button>
    </SettingItem>
}