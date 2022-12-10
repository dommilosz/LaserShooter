import React from "react";
import {SettingItem} from "../../views/SettingsView";
import {useLocalStorage} from "../../api/hooks";
import TargetVisualiserDemo from "../targetVisualiserDemo";

export default function (){
    const [showAllShotsOnTarget, setShowAllShotsOnTarget] = useLocalStorage(
        "visualise_all_shots",
        "false"
    );

    return <SettingItem className={"settings-item"}>
        <div style={{height:50}}>
            <div className={"settings-text"}>Show all shots on target:</div>
            <input type="checkbox" onChange={(e)=>{
                setShowAllShotsOnTarget(e.target.checked);
            }} checked={showAllShotsOnTarget}></input>
        </div>
        <div style={{height:"calc(100% - 50px)"}}>
            <TargetVisualiserDemo showAllShots={showAllShotsOnTarget}></TargetVisualiserDemo>
        </div>
    </SettingItem>
}