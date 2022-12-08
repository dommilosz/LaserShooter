import React, {useEffect, useState} from "react";
import "./App.css";
import moment from "moment";
import {Session, SessionData, ShotData} from "./types";
import TargetVisualuser from "./components/targetVisualiser";
import Header from "./components/header";
import RecentShots from "./components/recentShots";
import {getSession, getSessionInfo, useCurrentSession} from "./api/backendApi";
import {createContext, useAppSize, useLocalStorage} from "./api/hooks";
import {Routes, Route, BrowserRouter} from "react-router-dom";
import HomeView from "./views/HomeView";
import ClientsView from "./views/ClientsView";
import UsersView from "./views/UsersView";
import SettingsView from "./views/SettingsView";

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
                <BrowserRouter>
                    <Header/>
                    <Routes>
                        <Route path="/" element={<HomeView/>}/>
                        <Route path="/clients" element={<ClientsView/>}/>
                        <Route path="/users" element={<UsersView/>}/>
                        <Route path="/settings" element={<SettingsView/>}/>
                    </Routes>
                </BrowserRouter>

            </sessionContext.Provider>
        </div>
    );
}

export default App;