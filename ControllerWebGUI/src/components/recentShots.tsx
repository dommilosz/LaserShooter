import React, {useContext, useEffect, useState} from "react";
import {SessionData, ShotData} from "../types";
import "./recentShots.css";
import moment from "moment";
import {sessionContext} from "../App";
import {BootstrapTooltip} from "../api/customElements";
import {UserAssignModal} from "../customComponents/userAssignModal";
import {createContext} from "../api/hooks";
import { selectedShotContext } from "../views/HomeView";

export default function recentShots({selectedShot,setSelectedShot}:any) {
    let {sessionInfo, sessionData, users} = useContext(sessionContext);
    return <selectedShotContext.Provider value={[selectedShot, setSelectedShot]}>
        <div className="object-container">
            {sessionData.shots.map((shot, i) => {
                return <ShotObject shot={shot} key={i} index={sessionData.shots.length - i - 1}></ShotObject>
            }).reverse()}
        </div>
    </selectedShotContext.Provider>;
}

export function ShotObject({shot, index}: { shot: ShotData, index: number }) {
    const [selectedShot, setSelectedShot] = useContext(selectedShotContext);
    let {sessionInfo, sessionData, users} = useContext(sessionContext);
    let shotUsername = `${shot.idPacket.clientId}`;

    for (let i = 0; i < sessionData.clients[shot.idPacket.clientId].users.length; i++) {
        const user = sessionData.clients[shot.idPacket.clientId].users[i];
        const nextUser = sessionData.clients[shot.idPacket.clientId].users[i + 1];
        if (shot.ts >= user.from && (!nextUser || shot.ts < nextUser.from))
            shotUsername = users[user.userId];
    }

    let timeAgo = moment(shot.ts);

    return <div
        className={"shot_object" + (selectedShot == index ? " active" : "")}
        onClick={() => {
            if (setSelectedShot)
                setSelectedShot(index)
        }}>

        <div style={{width: "50%"}}>{shotUsername}</div>
        <div style={{width: "50%"}}>{shot.idPacket.shotId}</div>
        <div style={{width: "100%"}}>{timeAgo.fromNow()}</div>
        <div style={{width: "80%"}}>Score: {shot.score}</div>
    </div>
}
