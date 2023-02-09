import React, { useContext } from "react";
import "./header.css";
import { Link, useLocation } from "react-router-dom";
import { sessionContext } from "../App";
import moment from "moment";

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

export default function header() {
    let { sessionInfo } = useContext(sessionContext);
    let sessionTime = moment(Number(sessionInfo.session));
    let sessionValid = !!sessionInfo.session;

    return (
        <div className="header">
            <div
                className="text"
                style={{ paddingTop: "5px", paddingLeft: "32px" }}
            >
                Strzelnica
            </div>
            <div className={`sessionNotice ${sessionValid ? "" : "error"}`}>
                {sessionValid
                    ? `Session from ${sessionTime.format("lll")}`
                    : "Error while connecting to server."}
            </div>
            <div className="menu">
                <LinkButton path={"/settings"}>Settings</LinkButton>
                <LinkButton path={"/"}>Home</LinkButton>
                <LinkButton path={"/clients"}>Devices</LinkButton>
                <LinkButton path={"/users"}>Users</LinkButton>
            </div>
        </div>
    );
}
