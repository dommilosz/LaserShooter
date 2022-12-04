import React from "react";
import "./header.css";

export default function header() {
  const clicked = () => {
    console.log("clicked");
  };

  return (
    <div className="header">
      <div className="text">Strzelnica</div>
      <button onClick={clicked} id={"settings-button"}>
        <img src={require("../images/settings.png")} id={"settings-img"} alt="Settings" />
      </button>
    </div>
  );
}
