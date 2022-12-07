import React from "react";
import "./header.css";
import { Link } from "react-router-dom";

export default function header() {
    const clicked = () => {
        console.log("clicked");
    };

    return (
        <div className="header">
            {/* <Link to="/">Home</Link>
            <Link to="/clients">Clients</Link>
            <Link to="/users">Users</Link> */}
            {/* <button onClick={clicked} id={"settings-button"}>
                <img
                src={require("../images/settings.png")}
                id={"settings-img"}
                alt="Settings"
                />
              </button> */}
            <div
                className="text"
                style={{ paddingTop: "5px", paddingLeft: "32px" }}
            >
                Strzelnica
            </div>
            <div className="menu">
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
