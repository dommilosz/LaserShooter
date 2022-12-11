import React, {useState} from "react";
import {SettingItem} from "../../views/SettingsView";
import {useLocalStorage} from "../../api/hooks";
import Button from '@mui/material/Button';
import {Typography} from "@mui/material";

export default function (){
    const [serverUrlLS, setServerUrlLS] = useLocalStorage(
        "server-url",
        "http://localhost:3000"
    );
    const [serverUrl, setServerUrl] = useState("");

    return <SettingItem className={"settings-item"}>
        <Typography fontWeight={900}>
            Reset client to it's defaults
        </Typography>
        <Typography>
            It won't affect the sessions on server
        </Typography>
        <Button variant="contained" color="error"  onClick={()=>{
            localStorage.clear();
            location.reload();
        }}>
            RESET
        </Button>
    </SettingItem>
}