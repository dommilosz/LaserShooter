import React, { useContext } from "react";
import "./header.css";
import { Link } from "react-router-dom";
import { sessionContext } from "../App";
import moment from "moment";

export default function header() {
    let { sessionInfo, sessionData } = useContext(sessionContext);
    let sessionTime = moment(Number(sessionInfo.session));

    const clicked = () => {
        console.log("clicked");
    };

    return (
        <div className="header">
            <div
                className="text"
                style={{ paddingTop: "5px", paddingLeft: "32px" }}
            >
                Strzelnica
            </div>
            <div style={{fontSize:"1rem"}}>
                Session from {sessionTime.format("lll")}
            </div>
            <div className="menu">
            <div>
                    <Link className="menuItem hover-3" to="/settings">
                        Settings
                    </Link>
                </div>
                <div>
                    <Link className="menuItem hover-3" to="/">
                        Home
                    </Link>
                </div>
                <div>
                    <Link className="menuItem hover-3" to="/clients">
                        Clients
                    </Link>
                </div>
                <div>
                    <Link
                        className="menuItem hover-3"
                        style={{ border: "none" }}
                        to="/users"
                    >
                        Users
                    </Link>
                </div>
            </div>
        </div>
    );
}
