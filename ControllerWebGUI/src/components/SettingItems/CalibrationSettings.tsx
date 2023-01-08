import React, {useContext, useState} from "react";
import {FormControl, Grid, InputLabel, MenuItem, Select, Slider, Typography} from "@mui/material";
import {SettingItem} from "../../views/SettingsView";
import {ThemeContext} from "../../api/Theme";
import ModalBox from "../ModalBox";
import {url} from "../../api/backendApi";
import Button from "@mui/material/Button";
import {useUpdateV} from "../../api/hooks";
import Paper from "@mui/material/Paper";
import {Target} from "../targetVisualiserDemo";
import CalibrationTarget from "../targetCallibration";

export function CalibrationUI(
    {
        open,
        setOpen,
        offset,
        setOffset
    }: { open: boolean, setOpen: (v: boolean) => any, offset: [number, number, number], setOffset: (v: [number, number, number]) => any }) {
    let [update, setUpdate] = useUpdateV();
    let [opacity, setOpacity] = useState(90);
    return <ModalBox open={open} setOpen={setOpen} style={{height:"100%", overflowY:"auto"}}>
        <Paper style={{display: "flex", flexDirection: "column"}}>
            <Typography>Move sliders until the centers of the target matches</Typography>
            <Paper style={{width: 600, height: 450, position: "relative"}}>
                <CalibrationTarget offset={offset} imageKey={String(update)} opacity={opacity/100}/>
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
                value={offset[0]}
                min={-100}
                onChange={(e, value) => {
                    if (typeof value === "number")
                        setOffset([value, offset[1], offset[2]])
                }}
            />
            <Typography>Y</Typography>
            <Slider
                size="small"
                defaultValue={0}
                min={-100}
                aria-label="Small"
                valueLabelDisplay="auto"
                value={offset[1]}
                onChange={(e, value) => {
                    if (typeof value === "number")
                        setOffset([offset[0], value, offset[2]])
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
                value={offset[2]}
                onChange={(e, value) => {
                    if (typeof value === "number")
                        setOffset([offset[0], offset[1], value])
                }}
            />
            <Button onClick={() => setOpen(false)}>OK</Button>
        </Paper>
    </ModalBox>
}

export function CalibrationSettings() {
    let [offset, setOffset] = useState<[number, number, number]>([0, 0, 100]);
    let [calibrationUIOpen, setCalibrationUIOpen] = useState(false);

    return <SettingItem>
        <CalibrationUI open={calibrationUIOpen} setOpen={setCalibrationUIOpen} offset={offset} setOffset={setOffset}/>
        <Typography fontSize={18}>Calibration</Typography>
        <Typography>Target offset: X: {offset[0]} Y: {offset[1]} Scale: {offset[2]}</Typography>
        <Button onClick={() => setCalibrationUIOpen(true)}>Open calibration ui</Button>
    </SettingItem>
}