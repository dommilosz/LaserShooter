import React from "react"
import "./SettingsView.css"
import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ServerSetting from "../components/SettingItems/ServerSetting";
import SessionSetting from "../components/SettingItems/SessionSetting";
import ShowAllOnTargetSetting from "../components/SettingItems/ShowAllOnTargetSetting";
import ResetClient from "../components/SettingItems/ResetClient";

export const SettingItem = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 250,
}));

export default function SettingsView() {
    return <div style={{overflow:"auto"}}>
        <div id="settings-view">
            <Grid container spacing={2} style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                <Grid item xs={"auto"}>
                    <ServerSetting/>
                </Grid>
                <Grid item xs={"auto"}>
                    <SessionSetting/>
                </Grid>
                <Grid item xs={"auto"}>
                    <ShowAllOnTargetSetting/>
                </Grid>
                <Grid item xs={"auto"}>
                    <ResetClient/>
                </Grid>
            </Grid>
        </div>
    </div>
}