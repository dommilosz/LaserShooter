import React, { useContext, useState } from "react";
import { sessionContext } from "../App";
import { createContext, useLocalStorage } from "../api/hooks";
import ClientsList from "../components/ClientsList";
import TargetVisualiser from "../components/targetVisualiser";
import ObjectView from "../components/ObjectView";

export const selectedClientContext =
    createContext<[number, React.Dispatch<React.SetStateAction<number>>]>();

export default function ClientsView() {
    const [selectedClient, setSelectedClient] = useState(0);
    let { sessionData } = useContext(sessionContext);
    const [showAllShotsOnTarget, setShowAllShotsOnTarget] = useLocalStorage(
        "visualise_all_shots",
        "false"
    );

    return (
        <div style={{ display: "flex", height: "calc( 100% - 80px )" }}>
            <ObjectView>
                <ClientsList
                    selectedShot={selectedClient}
                    setSelectedShot={setSelectedClient}
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
                    primaryShots={sessionData.shots.filter((shot) => {
                        return (
                            shot.idPacket.clientId ===
                            Number(
                                Object.keys(sessionData.clients)[selectedClient]
                            )
                        );
                    })}
                    secondaryShots={showAllShotsOnTarget?sessionData.shots:[]}
                    primaryColor={"red"}
                    secondaryColor={"red"}
                ></TargetVisualiser>
            </div>
        </div>
    );
}
