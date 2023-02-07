import React, {useContext} from "react";
import {FormControl, Input, Typography} from "@mui/material";
import {SettingItem} from "../../views/SettingsView";
import {setCalibration} from "../../api/backendApi";
import Button from "@mui/material/Button";
import {sessionContext} from "../../App";

export function ScoreCalibrationSettings() {
    const {localCalibration, setLocalCalibration} = useContext(sessionContext);

    if (!localCalibration.scoreMultiplier) localCalibration.scoreMultiplier = 10;
    if (!localCalibration.scorePostMultiplier) localCalibration.scorePostMultiplier = 10;
    let scoreMultiplier = localCalibration.scoreMultiplier;
    let scorePostMultiplier = localCalibration.scorePostMultiplier;

    return <SettingItem>
        <Typography>Score calibration</Typography>
        <FormControl fullWidth margin={"normal"}>
            <Typography>Enter score multiplier</Typography>
            <Input type={"number"} onChange={(e) => {
                setLocalCalibration({...localCalibration, scoreMultiplier: Number(e.target.value)})
            }} value={localCalibration.scoreMultiplier}/>
        </FormControl>
        <FormControl fullWidth margin={"normal"}>
            <Typography>Enter post score multiplier</Typography>
            <Input type={"number"} onChange={(e) => {
                setLocalCalibration({...localCalibration, scorePostMultiplier: Number(e.target.value)})
            }} value={localCalibration.scorePostMultiplier}/>
        </FormControl>
        <FormControl fullWidth margin={"normal"}>
            <Button variant="contained" color="success" onClick={async () => {
                await setCalibration(localCalibration)
            }}>Apply</Button>
        </FormControl>
        <Typography>
            Examples: <br/>
            255 ={">"} {Math.round((255 / 255) * scoreMultiplier) * scorePostMultiplier} <br/>
            100 ={">"} {Math.round((100 / 255) * scoreMultiplier) * scorePostMultiplier} <br/>
            200 ={">"} {Math.round((200 / 255) * scoreMultiplier) * scorePostMultiplier} <br/>
        </Typography>
    </SettingItem>
}