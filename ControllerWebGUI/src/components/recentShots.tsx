import React, {useContext, useEffect} from "react";
import {SessionData, ShotData} from "../types";
import "./recentShots.css";
import moment from "moment";
import {selectedShotContext} from "../App";

export default function recentShots({sessionData,}: { sessionData: SessionData }) {
    useEffect(() => {
        console.log(sessionData);
    }, []);
    return <div style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexShrink: 0,
        flexDirection: "column",
        overflow: "auto",
        alignItems: "center"
    }}>
        {sessionData.shots.map((shot, i) => {
            return <ShotObject shot={shot} key={i} index={sessionData.shots.length-i-1}></ShotObject>
        }).reverse()}
    </div>;
}

export function ShotObject({shot, index}: { shot: ShotData, index: number }) {
    const [selectedShot, setSelectedShot] = useContext(selectedShotContext) ?? [0,()=>{}]
    let timeAgo = moment(shot.ts);

    return <div style={{backgroundColor: "#750000", width: 200, margin: 10}} onClick={() => {
        setSelectedShot(index)
    }}>
        <div>{shot.idPacket.shotId}</div>
        <div>Score: {shot.score}</div>
        <div>{timeAgo.fromNow()}</div>
    </div>
}
