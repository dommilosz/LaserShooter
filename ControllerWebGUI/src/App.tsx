import React, {useEffect, useState} from "react";
import "./App.css";
import {Session} from "./types";
import Header from "./components/header";
import {useCurrentSession} from "./api/backendApi";
import {createContext} from "./api/hooks";
import {Routes, Route, BrowserRouter} from "react-router-dom";
import HomeView from "./views/HomeView";
import ClientsView from "./views/ClientsView";
import UsersView from "./views/UsersView";
import SettingsView from "./views/SettingsView";
import ServerConnectionModal from "./customComponents/serverConnectionModal";
import {useTheme} from "@mui/material";

export const sessionContext = createContext<Session>();

function App() {
    const {sessionInfo, sessionData, users} = useCurrentSession();
    const selectedShotState = useState(0);
    useState(0);
    let theme = useTheme();

    useEffect(() => {
        selectedShotState[1](0);
    }, [sessionInfo.shots])

    return (
        <div className="App" style={{backgroundColor:theme.palette.background.default}}>
            <sessionContext.Provider value={{sessionInfo, sessionData, users}}>
                <ServerConnectionModal open={sessionInfo.lastFetch > 0 && sessionInfo.session <= 0}/>
                <BrowserRouter>
                    <Header/>
                    <div style={{height:"calc(100vh - 105px)",padding:10, overflow:"auto", display:"flex", flexDirection:"row", flexWrap:"wrap"}}>
                        <Routes>
                            <Route path="/" element={<HomeView/>}/>
                            <Route path="/clients" element={<ClientsView/>}/>
                            <Route path="/users" element={<UsersView/>}/>
                            <Route path="/settings" element={<SettingsView/>}/>
                        </Routes>
                    </div>

                </BrowserRouter>

            </sessionContext.Provider>
        </div>
    );
}

export default App;