import React from "react"
import "./SettingsView.css"
import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ServerSetting from "../components/SettingItems/ServerSetting";
import SessionSetting from "../components/SettingItems/SessionSetting";
import ShowAllOnTargetSetting from "../components/SettingItems/ShowAllOnTargetSetting";
import ResetClient from "../components/SettingItems/ResetClient";
import {ThemeSettings} from "../components/SettingItems/ThemeSettings";
import {PaperTypeMap} from "@mui/material/Paper/Paper";
import {OverridableComponent} from "@mui/material/OverridableComponent";
import {TargetCalibrationSettings} from "../components/SettingItems/TargetCalibrationSettings";
import {ScoreCalibrationSettings} from "../components/SettingItems/ScoreCalibrationSettings";

// @ts-ignore
export const Paper2:OverridableComponent<PaperTypeMap<{}, "div">> = ({...props}:PaperTypeMap) => <Paper elevation={3} {...props}/>;

export const SettingItem = styled(Paper2)(({theme}) => ({
    backgroundColor: theme.palette.background.paper,
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height:250,
    width:"calc(33% - 25px)",
    minWidth:210,
    margin:5,
    overflowY:"auto"
}));

export default function SettingsView() {
    return <>
        <ServerSetting/>
        <SessionSetting/>
        <ShowAllOnTargetSetting/>
        <ResetClient/>
        <ThemeSettings/>
        <TargetCalibrationSettings/>
        <ScoreCalibrationSettings/>
    </>
}
