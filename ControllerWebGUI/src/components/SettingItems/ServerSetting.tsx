import React, {useContext, useState} from "react";
import {SettingItem} from "../../views/SettingsView";
import {useLocalStorage} from "../../api/hooks";
import Button from '@mui/material/Button';
import {TextField,Typography} from "@mui/material";
import {sessionContext} from "../../App";
import moment from "moment";
import {checkServer} from "../../api/backendApi";

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
        <Typography color={isError?"red":""}>Last fetch: {sessionInfo.lastFetch>0?lastFetch:"Never"}</Typography>
        <TextField style={{width:"100%"}} label="Enter server url" variant="standard" onChange={(e)=>{
            setServerUrl(e.target.value);
        }} value={serverUrl} />
        <Button variant="contained" color="success" onClick={async ()=>{
            try{
                if(await checkServer(serverUrl)){
                    setServerUrlLS(serverUrl);
                    location.reload();
                }
            }catch (e){
                alert("Error while checking: "+e);
                return;
            }
        }}>Apply</Button>
    </SettingItem>
}