import React, {useContext, useEffect, useState} from "react";
import {Slider, Typography} from "@mui/material";
import {SettingItem} from "../../views/SettingsView";
import ModalBox from "../ModalBox";
import {setCalibration} from "../../api/backendApi";
import Button from "@mui/material/Button";
import {useUpdateV} from "../../api/hooks";
import Paper from "@mui/material/Paper";
import CalibrationTarget from "../targetCallibration";
import {CalibrationType} from "../../types";
import {sessionContext} from "../../App";

export function TargetCalibrationUI(
    {
        open,
        setOpen,
        initialCalibration,
        saveCalibration,
    }: { open: boolean, setOpen: (v: boolean) => any, initialCalibration:CalibrationType, saveCalibration: (v: CalibrationType) => any }) {
    let [calibration, setCalibration] = useState<CalibrationType>({
        offsetX: 0,
        offsetY: 0,
        scale: 100,
        scorePostMultiplier:10,
        scoreMultiplier:10,
    });

    useEffect(()=>{
        setCalibration({...initialCalibration});
    },[initialCalibration, open])

    let [update, setUpdate] = useUpdateV();
    let [opacity, setOpacity] = useState(90);
    return <ModalBox open={open} setOpen={setOpen} style={{height: "100%", overflowY: "auto"}}>
        <Paper style={{display: "flex", flexDirection: "column", width:600, padding:15}}>
            <Typography>Move sliders until the centers of the targets matches</Typography>
            <Paper elevation={3} style={{width: 600, height: 450, position: "relative", marginBottom:15}}>
                <CalibrationTarget imageKey={String(update)} opacity={opacity / 100}/>
            </Paper>
            <Typography>Opacity</Typography>
            <Slider
                size="small"
                aria-label="Small"
                valueLabelDisplay="auto"
                value={opacity}
                step={10}
                onChange={(e, value) => {
                    if (typeof value === "number")
                        setOpacity(value)
                }}
            />
            <Button onClick={setUpdate}>Refresh image</Button>
            <Typography>X</Typography>
            <Slider
                size="small"
                aria-label="Small"
                valueLabelDisplay="auto"
                value={calibration.offsetX}
                max={150}
                min={-150}
                onChange={(e, value) => {
                    if (typeof value === "number") {
                        calibration.offsetX = value;
                        setCalibration({...calibration, offsetX: value});
                    }
                }}
            />
            <Typography>Y</Typography>
            <Slider
                size="small"
                defaultValue={0}
                max={150}
                min={-150}
                aria-label="Small"
                valueLabelDisplay="auto"
                value={calibration.offsetY}
                onChange={(e, value) => {
                    if (typeof value === "number") {
                        calibration.offsetY = value;
                        setCalibration({...calibration, offsetY: value});
                    }
                }}
            />
            <Typography>Scale</Typography>
            <Slider
                size="small"
                defaultValue={0}
                min={0}
                max={200}
                aria-label="Small"
                valueLabelDisplay="auto"
                value={calibration.scale}
                onChange={(e, value) => {
                    if (typeof value === "number") {
                        setCalibration({...calibration, scale: value});
                    }
                }}
            />
            <div>
                <Button style={{width:"50%"}} color={"error"} onClick={() => {
                    setOpen(false);
                }}>Cancel</Button>
                <Button style={{width:"50%"}} onClick={() => {
                    setOpen(false);
                    saveCalibration(calibration)
                }}>Save</Button>
            </div>
        </Paper>
    </ModalBox>
}

export function TargetCalibrationSettings() {
    const {localCalibration, setLocalCalibration} = useContext(sessionContext);
    let [calibrationUIOpen, setCalibrationUIOpen] = useState(false);

    return <SettingItem>
        <TargetCalibrationUI open={calibrationUIOpen} setOpen={setCalibrationUIOpen} initialCalibration={localCalibration} saveCalibration={async (calibration)=>{
            setLocalCalibration(calibration);
            await setCalibration(calibration);
        }}/>
        <Typography fontSize={18}>Calibration</Typography>
        <Typography>Target offset: X: {localCalibration.offsetX}px Y: {localCalibration.offsetY}px
            Scale: {localCalibration.scale}%</Typography>
        <Button onClick={() => setCalibrationUIOpen(true)}>Open calibration ui</Button>
    </SettingItem>
}