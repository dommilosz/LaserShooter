import React, {useContext} from "react";
import "./header.css";
import {Link, useLocation} from "react-router-dom";
import {sessionContext} from "../App";
import moment from "moment";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';
import {CircularProgress, Typography} from "@mui/material";

export function LinkButton({
                               path,
                               children,
                           }: {
    path: string;
    children: any;
}) {
    const location = useLocation();

    return (
        <div>
            <Link
                className={`menuItem hover-3 ${
                    location.pathname === path ? "active" : ""
                }`}
                to={path}
            >
                {children}
            </Link>
        </div>
    );
}

export function StatusIcon({status}:{status:"pending" | "error" | "ok"}){
    if(status === "ok") return <CheckCircleIcon color={"success"}/>
    if(status === "error") return <ErrorIcon color={"error"}/>
    return <CircularProgress style={{width:20, height:"auto", margin:2}} color={"warning"}/>
}

export function ConnectionStatus() {
    let {sessionInfo} = useContext(sessionContext);
    let serverStatus: "pending" | "error" | "ok" = "pending";
    let targetStatus: "pending" | "error" | "ok" = "pending";

    let ts = +new Date();

    if (sessionInfo.session) serverStatus = "ok"
    if (sessionInfo.lastFetch > 0 && !sessionInfo.session) serverStatus = "error";

    if (ts - sessionInfo.lastKA > 5000) targetStatus = "error";
    else targetStatus = "ok";
    if (sessionInfo.lastKA <= 0) targetStatus = "pending";

    return <div style={{display:"flex"}} className={"header-status"}>
        <div style={{margin:10}}>
            <StatusIcon status={serverStatus}/>
            <Typography>Server</Typography>
        </div>
        <div style={{margin:10}}>
            <StatusIcon status={targetStatus}/>
            <Typography>Target</Typography>
        </div>
    </div>
}

export default function header() {
    let {sessionInfo} = useContext(sessionContext);
    let sessionTime = moment(Number(sessionInfo.session));
    let sessionValid = !!sessionInfo.session;

    return (
        <div className="header">
            <div
                className="text"
                style={{paddingTop: "5px", paddingLeft: "32px"}}
            >
                Strzelnica
            </div>
            <ConnectionStatus/>
            <div className="menu">
                <LinkButton path={"/settings"}>Settings</LinkButton>
                <LinkButton path={"/"}>Home</LinkButton>
                <LinkButton path={"/clients"}>Devices</LinkButton>
                <LinkButton path={"/users"}>Users</LinkButton>
            </div>
        </div>
    );
}
