import React, {useContext, useEffect, useRef} from "react";
import {ShotData} from "../types";
import "./recentShots.css";
import moment from "moment";
import {sessionContext} from "../App";
import {selectedShotContext} from "../views/HomeView";
import {resolveClientUserName} from "../api/resolveClientUser";
import {useLocation} from "react-router-dom";
import {url} from "../api/backendApi";
import DeleteIcon from "@mui/icons-material/Delete";
import {IconButton} from "@mui/material";

export default function recentShots({selectedShot, setSelectedShot}: any) {
    let {sessionData} = useContext(sessionContext);
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

export function ShotObject({shot, index}: { shot: ShotData; index: number }) {
    const [selectedShot, setSelectedShot] = useContext(selectedShotContext);
    let { sessionData, users} = useContext(sessionContext);
    let shotUsername = resolveClientUserName(sessionData, shot.idPacket.clientId, users, shot.ts);

    let timeAgo = moment(shot.ts);
    let objRef = useRef<HTMLDivElement>(null);
    let isActive = selectedShot == index;
    let location = useLocation();

    useEffect(() => {
        if (location.state?.selectShot && location.state?.selectShot.idPacket.shotId === shot.idPacket.shotId && objRef.current !== null) {
            objRef.current!.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location.state?.selectShot])

    return (
        <div
            className={"shot_object" + (isActive ? " active" : "")}
            onClick={() => {
                if (setSelectedShot) setSelectedShot(index);
            }}
            ref={objRef}
        >
            {/* <div style={{ width: "50%" }}>{shot.idPacket.shotId}</div> */}
            {/* <div style={{ width: "100%" }}>{timeAgo.fromNow()}</div> */}
            <div className="shotID">#{index}</div>
            <div className="shotScoreText">Score:</div>
            <div className="shotScore">{shot.score}</div>
            <div className="shotUsername">{shotUsername}</div>
            <div style={{display:"flex",alignItems:"center"}}><IconButton onClick={async ()=>{
                if(!confirm(`Do you want to remove ${shot.idPacket.shotId} shot?`)){
                    return;
                }
                let resp = await fetch(url + "shot/" + shot.idPacket.shotId, {
                    method: "DELETE",
                });
                if(resp.status !== 200){
                    alert(await resp.text())
                }
            }}>
                <DeleteIcon />
            </IconButton></div>
        </div>
    );
}
