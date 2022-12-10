import React from "react"
import "./SettingsView.css"
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ServerSetting from "../components/SettingItems/ServerSetting";
import SessionSetting from "../components/SettingItems/SessionSetting";
import ShowAllOnTargetSetting from "../components/SettingItems/ShowAllOnTargetSetting";
import ResetClient from "../components/SettingItems/ResetClient";

export const SettingItem = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height:200,
}));

export default function SettingsView() {
    return <div id="settings-view">
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <ServerSetting/>
            </Grid>
            <Grid item xs={4}>
                <SessionSetting/>
            </Grid>
            <Grid item xs={4}>
                <ShowAllOnTargetSetting/>
            </Grid>
            <Grid item xs={4}>
                <ResetClient/>
            </Grid>
        </Grid>
    </div>
}