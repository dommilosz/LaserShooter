import React, { useContext, useState } from "react";
import { sessionContext } from "../App";
import { createContext, useLocalStorage } from "../api/hooks";
import RecentShots from "../components/recentShots";
import TargetVisualuser from "../components/targetVisualiser";
import ClientsList from "../components/ClientsList";
import UsersList from "../components/UsersList";

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
            <div style={{ display: "flex", width: "33%" }}>
                <UsersList
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
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
                <TargetVisualuser
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
                ></TargetVisualuser>
            </div>
        </div>
    );
}
