import React from "react";
import "./header.css";
import {Link} from "react-router-dom";

export default function header() {
  const clicked = () => {
    console.log("clicked");
  };

  return (
    <div className="header">
        <Link to="/">Home</Link>
        <Link to="/clients">Clients</Link>
        <Link to="/users">Users</Link>
      <div className="text">Strzelnica</div>
      <button onClick={clicked} id={"settings-button"}>
        <img src={require("../images/settings.png")} id={"settings-img"} alt="Settings" />
      </button>
    </div>
  );
}
