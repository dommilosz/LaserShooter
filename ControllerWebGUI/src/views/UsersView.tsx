import React, { useContext, useState } from "react";
import { sessionContext } from "../App";
import { createContext, useLocalStorage } from "../api/hooks";
import TargetVisualiser from "../components/targetVisualiser";
import UsersList from "../components/UsersList";
import ObjectView from "../components/ObjectView";

export const selectedUserContext =
    createContext<[number, React.Dispatch<React.SetStateAction<number>>]>();

export default function UsersView() {
    const [selectedUser, setSelectedUser] = useState(0);
    let { sessionData, users } = useContext(sessionContext);
    const [showAllShotsOnTarget, setShowAllShotsOnTarget] = useLocalStorage(
        "visualise_all_shots",
        "false"
    );
        
    return (
        <div style={{ display: "flex", height: "calc( 100% - 80px )"}}>
            <ObjectView>
                <UsersList
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
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
                        let shotUser = -1;
                        for (
                            let i = 0;
                            i <
                            sessionData.clients[shot.idPacket.clientId].users
                                .length;
                            i++
                        ) {
                            const user =
                                sessionData.clients[shot.idPacket.clientId]
                                    .users[i];
                            const nextUser =
                                sessionData.clients[shot.idPacket.clientId]
                                    .users[i + 1];
                            if (
                                shot.ts >= user.from &&
                                (!nextUser || shot.ts < nextUser.from)
                            )
                                shotUser = user.userId;
                        }
                        return (
                            shotUser ===
                            Number(Object.keys(users)[selectedUser])
                        );
                    })}
                    primaryColor={"red"}
                    secondaryColor={"black"}
                    secondaryShots={
                        showAllShotsOnTarget ? sessionData.shots : []
                    }
                ></TargetVisualiser>
            </div>
        </div>
    );
}
