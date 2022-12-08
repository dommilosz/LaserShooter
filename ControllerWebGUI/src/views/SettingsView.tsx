import moment from "moment";
import React, { useContext, useEffect, useState } from "react"
import { url } from "../api/backendApi";
import { useLocalStorage } from "../api/hooks";
import { sessionContext } from "../App";
import "./SettingsView.css"

export default function SyntaxView() {
    const [showAllShotsOnTarget, setShowAllShotsOnTarget] = useLocalStorage(
        "visualise_all_shots",
        "false"
    );
    const [serverUrl, setServerUrl] = useLocalStorage(
        "server-url",
        "http://localhost:3000"
    );
    const {sessionInfo, sessionData, users} = useContext(sessionContext);
    let sessionTime = moment(Number(sessionInfo.session));
    let [sessions, setSessions] = useState<string[]>([]);
    useEffect(()=>{
        (async()=>{
            let resp = await fetch(url + "sessions/");
            setSessions(await resp.json())
        })()
    },[])

    return <div id="settings-view">
        <div className="settings-item" style={{flexDirection:"column"}}>
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
        </div>
        <div className="settings-item">
            <div>Show all shots on target:</div>
            <input type="checkbox" onChange={(e)=>{
                setShowAllShotsOnTarget(e.target.checked);
            }} checked={showAllShotsOnTarget}></input>
        </div>
        <div className="settings-item">
            <div>Server url:</div>
            <input type="text" onChange={(e)=>{
                setServerUrl(e.target.value);
            }} value={serverUrl}></input>
        </div>

    </div>
}