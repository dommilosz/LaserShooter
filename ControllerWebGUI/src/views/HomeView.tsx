import RecentShots from "../components/recentShots";
import TargetVisualiser from "../components/targetVisualiser";
import React, {useContext, useEffect, useState} from "react";
import {sessionContext} from "../App";
import {createContext, useLocalStorage} from "../api/hooks";
import "./homeview.css";
import {useLocation} from "react-router-dom";
import ObjectView from "../components/ObjectView";

export const selectedShotContext =
    createContext<[number, React.Dispatch<React.SetStateAction<number>>]>();

export default function HomeView() {
    let { sessionData} = useContext(sessionContext);
    let [selectedShot, setSelectedShot] = useState(0);
    const [showAllShotsOnTarget, setShowAllShotsOnTarget] = useLocalStorage(
        "visualise_all_shots",
        "false"
    );
    let location = useLocation();

    useEffect(() => {
        // Clear the location state when the page is refreshed
        history.replaceState({}, document.title, location.pathname);
    }, [location]);

    useEffect(() => {
        if (location.state?.selectShot) {
            sessionData.shots.forEach((shot, i) => {
                if (shot.idPacket.shotId === location.state?.selectShot.idPacket.shotId) {
                    setSelectedShot(sessionData.shots.length - i-1);
                }
            })
        }
    }, [location.state?.selectShot])

    return (
        <div style={{ display: "flex", height: "calc( 100% - 80px )"}}>
            <ObjectView>
                <RecentShots
                    selectedShot={selectedShot}
                    setSelectedShot={setSelectedShot}
                />
            </ObjectView>
            <div
                style={{
                    display: "flex",
                    width: "66%",
                    height: "calc( 100% - 4px )",
                    flexDirection: "column",
                }}
            >
                <TargetVisualiser
                    primaryShots={[sessionData.shots[
                    sessionData.shots.length - selectedShot - 1
                        ]]}
                    secondaryShots={
                        showAllShotsOnTarget ? sessionData.shots : []
                    }
                    primaryColor={"red"}
                    secondaryColor={"black"}
                ></TargetVisualiser>
            </div>
        </div>
    );
}
