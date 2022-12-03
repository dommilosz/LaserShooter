import React, {useEffect, useState} from "react";
import "./App.css";
import moment from "moment";
import {SessionData, ShotData} from "./types";
import TargetVisualuser from "./components/targetVisualiser";
import Header from "./components/header";
import RecentShots from "./components/recentShots";
import {getSession, getSessionInfo, useCurrentSession} from "./api/backendApi";

function App() {
    const [sessionInfo, sessionData] = useCurrentSession();

    return (
        <div className="App">
            <Header/>
            <div style={{display: "flex"}}>
                <RecentShots sessionData={sessionData}/>
                <TargetVisualuser
                    shot={sessionData.shots[sessionData.shots.length - 1]}
                    scale={5}
                    dotSize={10}
                    dotColor={"red"}
                ></TargetVisualuser>
            </div>
        </div>
    );
}

export default App;

{
    /* <header className="App-header">
          <div>
            Session: {sessionInfo.session}, Shots: {sessionInfo.shots} Update: {moment(lastFetch).format("h:mm:ss")} LastKA: {moment(sessionInfo.lastKA).format("h:mm:ss")}
          </div>
          <TargetVisualuser shot={sessionData.shots[sessionData.shots.length-1]} scale={2}></TargetVisualuser>
          {sessionData.shots.map(shot=>{
            return <p>
              {shot.idPacket.shotId}
            </p>
          }).reverse()}
        </header> */
}
