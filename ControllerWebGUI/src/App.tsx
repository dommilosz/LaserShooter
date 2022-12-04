import React, {useEffect, useState} from "react";
import "./App.css";
import moment from "moment";
import {SessionData, ShotData} from "./types";
import TargetVisualuser from "./components/targetVisualiser";
import Header from "./components/header";
import RecentShots from "./components/recentShots";
import {getSession, getSessionInfo, useCurrentSession} from "./api/backendApi";
import {useAppSize} from "./api/hooks";

export const selectedShotContext = React.createContext<[number, React.Dispatch<React.SetStateAction<number>>]|undefined>(undefined);

function App() {
    const [sessionInfo, sessionData] = useCurrentSession();
    const selectedShotState = useState(0);

    useEffect(()=>{
        selectedShotState[1](0);
    },[sessionInfo.shots])

    return (
        <div className="App">
            <selectedShotContext.Provider value={selectedShotState}>
                <Header/>
                <div style={{display: "flex", height: "calc( 100% - 80px )"}}>
                    <div style={{display: "flex", width: "33%"}}>
                        <RecentShots sessionData={sessionData}/>
                    </div>
                    <div style={{display: "flex", width: "66%", height: "calc( 100% - 4px )"}}>
                        <TargetVisualuser
                            shot={sessionData.shots[sessionData.shots.length - selectedShotState[0] - 1]}
                            dotColor={"red"}
                        ></TargetVisualuser>
                    </div>
                </div>
            </selectedShotContext.Provider>
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
