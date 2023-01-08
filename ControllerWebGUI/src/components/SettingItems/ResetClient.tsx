import React, {useContext, useState} from "react";
import {SettingItem} from "../../views/SettingsView";
import {useLocalStorage} from "../../api/hooks";
import Button from '@mui/material/Button';
import {Typography} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import {removeSessions, removeUsers, resetServer} from "../../api/backendApi";
import {useShowConfirmBox} from "../DialogBoxComponents/MessageBoxContext";
import {sessionContext} from "../../App";

export default function () {
    let showConfirmBox = useShowConfirmBox();
    let {updateSessions} = useContext(sessionContext);

    return <SettingItem>
        <Typography fontWeight={900}>
            Reset
        </Typography>
        <FormControl fullWidth margin={"normal"}>
            <Typography>
                Affects only this client
            </Typography>
            <Button variant="contained" color="error" onClick={() => {
                localStorage.clear();
                location.reload();
            }}>
                RESET Client
            </Button>
        </FormControl>
        <Typography>
            Clear data on the server
        </Typography>
        <Button style={{margin:5}} variant="contained" color="error" onClick={ async () => {
            if(await showConfirmBox({content:"Clear all users on the server?",title:"Clear all users"}))await removeUsers();
        }}>
            Users
        </Button>
        <Button style={{margin:5}} variant="contained" color="error" onClick={ async () => {
            if(await showConfirmBox({content:"Clear all sessions on the server?",title:"Clear all sessions"})){await removeSessions();updateSessions();}
        }}>
            Sessions
        </Button>
        <Button style={{margin:5}} variant="contained" color="error" onClick={ async () => {
            if(await showConfirmBox({content:"Clear all sessions, users, devices and shots on the server?",title:"Factory reset"})){await resetServer();updateSessions();}
        }}>
            Full reset
        </Button>
    </SettingItem>
}