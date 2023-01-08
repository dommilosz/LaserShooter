import React, {useState} from "react";
import {SettingItem} from "../../views/SettingsView";
import {useLocalStorage} from "../../api/hooks";
import Button from '@mui/material/Button';
import {Typography} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import {removeUsers} from "../../api/backendApi";
import {useShowConfirmBox} from "../DialogBoxComponents/MessageBoxContext";

export default function () {
    let showConfirmBox = useShowConfirmBox();

    return <SettingItem>
        <Typography fontWeight={900}>
            Reset
        </Typography>
        <FormControl fullWidth margin={"normal"}>
            <Typography>
                It won't affect the sessions on server
            </Typography>
            <Button variant="contained" color="error" onClick={() => {
                localStorage.clear();
                location.reload();
            }}>
                RESET Client
            </Button>
        </FormControl>
        <FormControl fullWidth margin={"normal"}>
            <Typography>
                Remove all users on server
            </Typography>
            <Button variant="contained" color="error" onClick={ async () => {
                if(await showConfirmBox({content:"Clear all users on server?",title:"Clear all users"}))await removeUsers();
            }}>
                Clear users
            </Button>
        </FormControl>
    </SettingItem>
}