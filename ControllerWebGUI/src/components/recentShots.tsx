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
            return <ShotObject shot={shot} key={i} index={sessionData.shots.length - i - 1}></ShotObject>
        }).reverse()}
    </div>;
}

export function ShotObject({shot, index}: { shot: ShotData, index: number }) {
    const [selectedShot, setSelectedShot] = useContext(selectedShotContext) ?? [0, undefined]
    let timeAgo = moment(shot.ts);

    return <div
        className={"shot_object"+(selectedShot==index?" active":"")}
        onClick={() => {
            if (setSelectedShot)
                setSelectedShot(index)
        }}>
        <div style={{width: "60%"}}>{shot.idPacket.shotId}</div>
        <div style={{width: "40%"}}>{timeAgo.fromNow()}</div>
        <div className={"w100"}>Score: {shot.score}</div>
    </div>
}
