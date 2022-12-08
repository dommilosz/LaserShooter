import React, { useContext, useEffect, useState } from "react";
import { SessionData, ShotData } from "../types";
import "./recentShots.css";
import moment from "moment";
import { sessionContext } from "../App";
import { BootstrapTooltip } from "../api/customElements";
import { UserAssignModal } from "../customComponents/userAssignModal";
import { createContext } from "../api/hooks";
import { selectedShotContext } from "../views/HomeView";
import { resolveClientUserName } from "../api/resolveClientUser";

export default function recentShots({ selectedShot, setSelectedShot }: any) {
    let { sessionInfo, sessionData, users } = useContext(sessionContext);
    return (
        <selectedShotContext.Provider value={[selectedShot, setSelectedShot]}>
            <div className="object-container">
                {sessionData.shots
                    .map((shot, i) => {
                        return (
                            <ShotObject
                                shot={shot}
                                key={i}
                                index={sessionData.shots.length - i - 1}
                            ></ShotObject>
                        );
                    })
                    .reverse()}
            </div>
        </selectedShotContext.Provider>
    );
}

export function ShotObject({ shot, index }: { shot: ShotData; index: number }) {
    const [selectedShot, setSelectedShot] = useContext(selectedShotContext);
    let { sessionInfo, sessionData, users } = useContext(sessionContext);
    let shotUsername = resolveClientUserName(sessionData,shot.idPacket.clientId,shot.ts,users);

    let timeAgo = moment(shot.ts);

    return (
        <div
            className={"shot_object" + (selectedShot == index ? " active" : "")}
            onClick={() => {
                if (setSelectedShot) setSelectedShot(index);
            }}
        >
            {/* <div style={{ width: "50%" }}>{shot.idPacket.shotId}</div> */}
            {/* <div style={{ width: "100%" }}>{timeAgo.fromNow()}</div> */}
            <div className="shotID">#{index}</div>
            <div className="shotScoreText">Score:</div>
            <div className="shotScore">{shot.score}</div>
            <div className="shotUsername">{shotUsername}</div>
        </div>
    );
}
