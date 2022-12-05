import RecentShots from "../components/recentShots";
import TargetVisualuser from "../components/targetVisualiser";
import React, {useContext, useState} from "react";
import {sessionContext} from "../App";
import {createContext, useLocalStorage} from "../api/hooks";

export const selectedShotContext = createContext<[number, React.Dispatch<React.SetStateAction<number>>]>();

export default function HomeView() {
    let {sessionInfo, sessionData} = useContext(sessionContext);
    let [selectedShot, setSelectedShot] = useState(0);
    const [showAllShotsOnTarget, setShowAllShotsOnTarget] = useLocalStorage("visualise_all_shots", "false");

    return <div style={{display: "flex", height: "calc( 100% - 80px )"}}>
        <div style={{display: "flex", width: "33%"}}>
            <RecentShots selectedShot={selectedShot} setSelectedShot={setSelectedShot}/>
        </div>
        <div style={{display: "flex", width: "66%", height: "calc( 100% - 4px )", flexDirection: "column"}}>
            <button onClick={() => {
                setShowAllShotsOnTarget(showAllShotsOnTarget === "true" ? "false" : "true")
            }}>Toggle show all
            </button>
            <TargetVisualuser
                shot={sessionData.shots[sessionData.shots.length - selectedShot - 1]}
                shots={showAllShotsOnTarget === "true" ? sessionData.shots : []}
                dotColor={"red"}
                secondaryColor={"black"}
            ></TargetVisualuser>
            <div>
                <div>X: {sessionData.shots[sessionData.shots.length - selectedShot - 1]?.p?.x}</div>
                <div>Y: {sessionData.shots[sessionData.shots.length - selectedShot - 1]?.p?.y}</div>
            </div>
        </div>
    </div>
}