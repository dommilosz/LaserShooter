import React, {useState} from "react";
import SessionSetting from "./SettingItems/SessionSetting";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import {Card, ListItemButton, Paper} from "@mui/material";

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
            <Paper elevation={3} className="object-container">
                <div style={{marginBottom:5}}>
                    Session is empty. Shot some shots or load previous session to
                    begin.
                </div>
                <Button style={{width:'100%'}} variant={"contained"} onClick={()=>{navigate("/settings")}}>
                    Settings
                </Button>
            </Paper>
        );
    }
    return <Paper elevation={3} className="object-container">{children}</Paper>;
}

export function ObjectCard({...props}:any){
    let [isHovered, setIsHovered] = useState(false);

    let elevation = props.active?6:1;
    if(isHovered)elevation+=6;

    return <Card elevation={elevation} {...props} onMouseEnter={()=>setIsHovered(true)} onMouseLeave={()=>setIsHovered(false)}/>
}