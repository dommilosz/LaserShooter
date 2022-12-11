import React, {useContext, useState} from "react";
import {SettingItem} from "../../views/SettingsView";
import {useLocalStorage} from "../../api/hooks";
import Button from '@mui/material/Button';
import {TextField,Typography} from "@mui/material";
import {sessionContext} from "../../App";
import moment from "moment";

export default function (){
    const [serverUrlLS, setServerUrlLS] = useLocalStorage(
        "server-url",
        "http://localhost:3000"
    );
    const [serverUrl, setServerUrl] = useState("");
    let { sessionData,sessionInfo } = useContext(sessionContext);

    let isError = sessionInfo.session <= 0;
    let lastFetch = `${moment(sessionInfo.lastFetch).fromNow()} ${isError?" FAILED":""}`;

    return <SettingItem className={"settings-item"}>
        <Typography>Server url: {serverUrlLS}</Typography>
        <Typography>Last fetch: <Typography color={isError?"red":""}>{sessionInfo.lastFetch>0?lastFetch:"Never"}</Typography></Typography>
        <TextField style={{width:"100%"}} label="Enter server url" variant="standard" onChange={(e)=>{
            setServerUrl(e.target.value);
        }} value={serverUrl} />
        <br/>
        <Button variant="contained" color="secondary" onClick={async ()=>{
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

        }}>Check</Button>
        <br/>
        <Button variant="contained" color="success" onClick={()=>{
            setServerUrlLS(serverUrl);
            location.reload();
        }}>Apply</Button>
    </SettingItem>
}