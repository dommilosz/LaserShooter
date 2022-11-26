import React, {useEffect, useState} from 'react';
import './App.css';
import moment from "moment";
import {ShotData} from "./types";
import TargetVisualuser from "./targetVisualiser";

function App() {
  let [sessionInfo,setSessionInfo] = useState({session:0,shots:0,lastKA:0});
  let [sessionData,setSessionData] = useState<{ shots: ShotData[], clients: { [key: number]: 1 } }>( {shots: [], clients: {}})
  let [lastFetch, setLastFetch] = useState(0);

  useEffect(( ) => {
    const intervalCall = setInterval(async () => {
      let sessionInfo = await fetch("http://localhost:8008/session");
      setSessionInfo(await sessionInfo.json());
      setLastFetch(+new Date());
    }, 1500);
    return () => {
      // clean up
      clearInterval(intervalCall);
    };
  }, []);

  useEffect(()=>{
    setTimeout(async ()=>{
      let sessionData = await fetch("http://localhost:8008/sessions/current");
      setSessionData(await sessionData.json());
    })
  },[sessionInfo.shots])

  return (
    <div className="App">
      <header className="App-header">
        <div>
          Session: {sessionInfo.session}, Shots: {sessionInfo.shots} Update: {moment(lastFetch).format("h:mm:ss")} LastKA: {moment(sessionInfo.lastKA).format("h:mm:ss")}
        </div>
        <TargetVisualuser shot={sessionData.shots[sessionData.shots.length-1]} scale={2}></TargetVisualuser>
        {sessionData.shots.map(shot=>{
          return <p>
            {shot.idPacket.shotId}
          </p>
        }).reverse()}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
