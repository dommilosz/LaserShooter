import React, {useState} from "react";
import {SettingItem} from "../../views/SettingsView";
import {useLocalStorage} from "../../api/hooks";
import Button from '@mui/material/Button';

export default function (){
    const [serverUrlLS, setServerUrlLS] = useLocalStorage(
        "server-url",
        "http://localhost:3000"
    );
    const [serverUrl, setServerUrl] = useState("");

    return <SettingItem className={"settings-item"}>
        <div className={"settings-text2"}>Reset client to it's defaults. It won't affect the sessions on server</div>
        <Button variant="contained" color="error"  onClick={()=>{
            localStorage.clear();
            location.reload();
        }}>
            RESET
        </Button>
    </SettingItem>
}