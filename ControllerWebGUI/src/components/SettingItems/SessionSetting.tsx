import {url} from "../../api/backendApi";
import React, {useContext, useEffect, useState} from "react";
import {SettingItem} from "../../views/SettingsView";
import {sessionContext} from "../../App";
import moment from "moment/moment";

export default function (){
    const {sessionInfo} = useContext(sessionContext);
    let sessionTime = moment(Number(sessionInfo.session));
    let [sessions, setSessions] = useState<string[]>([]);
    useEffect(()=>{
        (async()=>{
            let resp = await fetch(url + "sessions/");
            setSessions(await resp.json())
        })()
    },[])

    return <SettingItem>
        <div>Current Session: {sessionInfo.session}</div>
        <div>Session Date: {sessionTime.format("LLL")}</div>
        <div>Load Session: </div>
        <select id="session-load-box">
            {sessions.map(session=>{
                return <option value={session}>{session}</option>
            })}
        </select>
        <button onClick={async ()=>{
            // @ts-ignore
            let id = document.querySelector("#session-load-box").value;
            try{
                let resp = await fetch(url + "session/", {
                    method: "PUT",
                    body: JSON.stringify({ session: id }),
                    headers: { "content-type": "application/json" },
                });
                if(resp.status !== 200){
                    alert(await resp.text());
                    return;
                }
                alert("changed")
            }catch(e){
                alert(e)
            }


        }}>Load</button>
    </SettingItem>
}