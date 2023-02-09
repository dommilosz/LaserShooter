import {putSession, renameSession} from "../../api/backendApi";
import React, {useContext, useState} from "react";
import {SettingItem} from "../../views/SettingsView";
import {sessionContext} from "../../App";
import moment from "moment/moment";
import Button from '@mui/material/Button';
import {Select, Typography} from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import {useShowPromptBox} from "../DialogBoxComponents/MessageBoxContext";

export default function () {
    const {sessionInfo, sessions} = useContext(sessionContext);
    let sessionTime = moment(Number(sessionInfo.session?.ts));
    let [selectedSession, setSelectedSession] = useState(0);
    let showPromptBox = useShowPromptBox();

    return <SettingItem>
        <Typography>Current Session: {(sessionInfo.session?.name??sessionInfo?.session?.ts)}</Typography>
        <Typography>Session ID: {(sessionInfo?.session?.ts)}</Typography>
        <Typography>Session Date: {sessionTime.format("LLL")}</Typography>

        <Button fullWidth onClick={async () => {
            let newName = await showPromptBox({
                title: "Rename session",
                fieldName: "New name",
                content: "Enter new name for the session: "+(sessionInfo.session?.name??sessionInfo?.session?.ts),
            })
            if(newName){
                await renameSession(newName);
            }
        }}>Rename</Button>

        <Typography>Load Session:</Typography>

        <FormControl variant="standard" style={{width:"80%"}}>
            <InputLabel id="session-select-label">Session</InputLabel>
            <Select
                labelId="session-select-label"
                label={"Session"}
                onChange={(e) => {
                    {
                        setSelectedSession(Number(e.target.value));
                    }
                }}
                value={selectedSession}
            >
                {sessions.map(session => {
                    return <MenuItem value={session.ts}
                                     key={session.ts}>{session.name??session.ts} {moment(session.ts).format("lll")} ({session.shots})</MenuItem>
                })}
            </Select>
        </FormControl>
        <FormControl margin={"dense"} style={{width:"20%"}}><Button variant="contained" color="success" onClick={async () => {
            if (selectedSession <= 0) {
                alert("Please select valid session");
                return;
            }
            try {
                let resp = await putSession(selectedSession);
                if (resp.status !== 200) {
                    alert(await resp.text());
                    return;
                }
                alert("changed")
            } catch (e) {
                alert(e)
            }


        }}>Load</Button></FormControl>
        <FormControl fullWidth margin={"normal"}><Button variant="contained" onClick={async () => {
            try {
                let resp = await putSession();
                if (resp.status !== 200) {
                    alert(await resp.text());
                    return;
                }
                alert("changed")
            } catch (e) {
                alert(e)
            }


        }}>New Session</Button></FormControl>
    </SettingItem>
}