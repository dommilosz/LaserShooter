import React, {useEffect, useState} from "react";
import "./App.css";
import moment from "moment";
import {Session, SessionData, ShotData} from "./types";
import TargetVisualuser from "./components/targetVisualiser";
import Header from "./components/header";
import RecentShots from "./components/recentShots";
import {getSession, getSessionInfo, useCurrentSession} from "./api/backendApi";
import {createContext, useAppSize, useLocalStorage} from "./api/hooks";
import {MemoryRouter, Routes, Route} from "react-router-dom";
import HomeView from "./views/HomeView";
import ClientsView from "./views/ClientsView";
import UsersView from "./views/UsersView";

export const sessionContext = createContext<Session>();

function App() {
    const {sessionInfo, sessionData, users} = useCurrentSession();
    const selectedShotState = useState(0);
    const selectedClientState = useState(0);

    useEffect(() => {
        selectedShotState[1](0);
    }, [sessionInfo.shots])

    return (
        <div className="App">
            <sessionContext.Provider value={{sessionInfo, sessionData, users}}>
                <MemoryRouter>
                    <Header/>
                    <Routes>
                        <Route path="/" element={<HomeView/>}/>
                        <Route path="/clients" element={<ClientsView/>}/>
                        <Route path="/users" element={<UsersView/>}/>
                    </Routes>
                </MemoryRouter>

            </sessionContext.Provider>
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
