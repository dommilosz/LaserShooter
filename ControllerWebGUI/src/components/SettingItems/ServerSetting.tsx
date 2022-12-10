import React, {useState} from "react";
import {SettingItem} from "../../views/SettingsView";
import {useLocalStorage} from "../../api/hooks";

export default function (){
    const [serverUrlLS, setServerUrlLS] = useLocalStorage(
        "server-url",
        "http://localhost:3000"
    );
    const [serverUrl, setServerUrl] = useState("");

    return <SettingItem className={"settings-item"}>
        <div className={"settings-text"}>Server url: {serverUrlLS}</div>
        <input type="text" onChange={(e)=>{
            setServerUrl(e.target.value);
        }} value={serverUrl}></input>
        <button onClick={async ()=>{
            try{
                let surl = serverUrl;
                if(!surl.endsWith("/"))
                    surl = serverUrl+"/";

                let resp = await fetch(surl+"session");
                let json = await resp.json();
                if(json.session){
                    alert("Server url is valid")
                }
            }catch (e){
                alert("Error while checking: "+e);
            }

        }}>Check</button>
        <button onClick={()=>{
            setServerUrlLS(serverUrl);
            location.reload();
        }}>Apply</button>
    </SettingItem>
}