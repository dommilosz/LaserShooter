import React, { useContext, useState } from "react";
import { sessionContext } from "../App";
import { createContext, useLocalStorage } from "../api/hooks";
import ClientsList from "../components/ClientsList";
import TargetVisualuser from "../components/targetVisualiser";

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
            <div style={{ display: "flex", width: "33%" }}>
                <ClientsList
                    selectedShot={selectedClient}
                    setSelectedShot={setSelectedClient}
                />
            </div>
            <div
                style={{
                    display: "flex",
                    width: "66%",
                    height: "calc( 100% - 4px )",
                    flexDirection: "column",
                }}
            >
                <button
                    onClick={() => {
                        setShowAllShotsOnTarget(
                            showAllShotsOnTarget === "true" ? "false" : "true"
                        );
                    }}
                >
                    Toggle show all
                </button>
                <TargetVisualuser
                    shots={sessionData.shots.filter((shot) => {
                        return (
                            shot.idPacket.clientId ===
                            Number(
                                Object.keys(sessionData.clients)[selectedClient]
                            )
                        );
                    })}
                    dotColor={"red"}
                    secondaryColor={"red"}
                ></TargetVisualuser>
            </div>
        </div>
    );
}
