import React from "react";
import {SettingItem} from "../../views/SettingsView";
import {useLocalStorage} from "../../api/hooks";
import TargetVisualiserDemo from "../targetVisualiserDemo";
import {Checkbox} from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';

export default function (){
    const [showAllShotsOnTarget, setShowAllShotsOnTarget] = useLocalStorage(
        "visualise_all_shots",
        "false"
    );

    return <SettingItem className={"settings-item"}>
        <div style={{height:50}}>
            <FormControlLabel control={<Checkbox defaultChecked color="success" onChange={(e)=>{
                setShowAllShotsOnTarget(e.target.checked);
            }} checked={showAllShotsOnTarget} />} label={<span style={{fontSize:"min(1.2vw, 12px)"}}>Show all shots on target</span>}/>
        </div>
        <div style={{height:"calc(100% - 50px)"}}>
            <TargetVisualiserDemo showAllShots={showAllShotsOnTarget}></TargetVisualiserDemo>
        </div>
    </SettingItem>
}