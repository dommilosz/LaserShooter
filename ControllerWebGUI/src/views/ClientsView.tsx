import React, { useContext, useState } from "react";
import { sessionContext } from "../App";
import { createContext, useLocalStorage } from "../api/hooks";
import ClientsList from "../components/ClientsList";
import TargetVisualiser from "../components/targetVisualiser";
import ObjectView from "../components/ObjectView";
import Paper from "@mui/material/Paper";

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
        <>
            <ObjectView>
                <ClientsList
                    selectedShot={selectedClient}
                    setSelectedShot={setSelectedClient}
                />
            </ObjectView>
            <Paper
                style={{
                    display: "flex",
                    width: "calc(66.666% - 10px)",
                    height: "100%",
                    flexDirection: "column",
                    marginLeft:10,
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
            </Paper>
        </>
    );
}
