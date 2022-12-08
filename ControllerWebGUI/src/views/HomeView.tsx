import RecentShots from "../components/recentShots";
import TargetVisualuser from "../components/targetVisualiser";
import React, { useContext, useState } from "react";
import { sessionContext } from "../App";
import { createContext, useLocalStorage } from "../api/hooks";
import "./homeview.css";

export const selectedShotContext =
    createContext<[number, React.Dispatch<React.SetStateAction<number>>]>();

export default function HomeView() {
    let { sessionInfo, sessionData } = useContext(sessionContext);
    let [selectedShot, setSelectedShot] = useState(0);
    const [showAllShotsOnTarget, setShowAllShotsOnTarget] = useLocalStorage(
        "visualise_all_shots",
        "false"
    );

    return (
        <div className="homeView">
            <div className="recentShots">
                <RecentShots
                    selectedShot={selectedShot}
                    setSelectedShot={setSelectedShot}
                />
            </div>
            <div className="targetVisualuser">
                <TargetVisualuser
                    primaryShots={[sessionData.shots[
                        sessionData.shots.length - selectedShot - 1
                    ]]}
                    secondaryShots={
                        showAllShotsOnTarget ? sessionData.shots : []
                    }
                    primaryColor={"red"}
                    secondaryColor={"black"}
                ></TargetVisualuser>
            </div>
        </div>
    );
}
