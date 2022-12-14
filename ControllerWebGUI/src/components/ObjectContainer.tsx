import React from "react";
import SessionSetting from "./SettingItems/SessionSetting";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";

export default function ({
                             children,
                             empty,
                         }: {
    children: any;
    empty: boolean;
}) {
    const navigate = useNavigate();

    if (empty) {
        return (
            <div className="object-container">
                <div style={{marginBottom:5}}>
                    Session is empty. Shot some shots or load previous session to
                    begin.
                </div>
                <Button style={{width:'100%'}} variant={"contained"} onClick={()=>{navigate("/settings")}}>
                    Settings
                </Button>
            </div>
        );
    }
    return <div className="object-container">{children}</div>;
}
