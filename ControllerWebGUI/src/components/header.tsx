import React, { useContext } from "react";
import "./header.css";
import { Link,useLocation  } from "react-router-dom";
import { sessionContext } from "../App";
import moment from "moment";

export function LinkButton({path,children}:{path:string,children:any}){
    const location = useLocation();

    return  <div>
        <Link
            className={`menuItem hover-3 ${location.pathname === path?"active":""}`} to={path}
        >
            {children}
        </Link>
    </div>
}

export default function header() {
    let { sessionInfo, sessionData } = useContext(sessionContext);
    let sessionTime = moment(Number(sessionInfo.session));

    return (
        <div className="header">
            <div
                className="text"
                style={{ paddingTop: "5px", paddingLeft: "32px" }}
            >
                Strzelnica
            </div>
            <div style={{fontSize:"1rem"}}>
                {sessionInfo.session > 0?(`Session from ${sessionTime.format("lll")}`):(<div style={{color:"#b90707"}}>
                    Error while connecting to server.
                </div>)}
            </div>
            <div className="menu">
                <LinkButton path={"/settings"}>Settings</LinkButton>
                <LinkButton path={"/"}>Home</LinkButton>
                <LinkButton path={"/clients"}>Clients</LinkButton>
                <LinkButton path={"/users"}>Users</LinkButton>
            </div>
        </div>
    );
}
