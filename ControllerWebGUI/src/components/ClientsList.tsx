import React, { useContext, useState } from "react";
import { sessionContext } from "../App";
import { ClientData, ShotData } from "../types";
import { createContext } from "../api/hooks";
import { BootstrapTooltip } from "../api/customElements";
import { UserAssignModal } from "../customComponents/userAssignModal";
import { selectedClientContext } from "../views/ClientsView";
import { url } from "../api/backendApi";

export default function ClientsList({
    selectedShot: selectedClient,
    setSelectedShot: setSelectedClient,
}: any) {
    let { sessionInfo, sessionData, users } = useContext(sessionContext);

    return (
        <selectedClientContext.Provider
            value={[selectedClient, setSelectedClient]}
        >
            <div className="object-container">
                {Object.keys(sessionData.clients).map((clientKey, i) => {
                    let client =
                        sessionData.clients[clientKey as unknown as number];
                    return (
                        <ClientObject client={client} index={i}></ClientObject>
                    );
                })}
            </div>
        </selectedClientContext.Provider>
    );
}

export function ClientObject({
    client,
    index,
}: {
    client: ClientData;
    index: number;
}) {
    const [selectedClient, setSelectedClient] = useContext(
        selectedClientContext
    );
    let { sessionInfo, sessionData, users } = useContext(sessionContext);

    let name = "Not named";
    if (client.users.length > 0)
        name = users[client.users[client.users.length - 1].userId];

    return (
        <div
            className={
                "shot_object" + (selectedClient == index ? " active" : "")
            }
            onClick={() => {
                if (setSelectedClient) setSelectedClient(index);
            }}
        >
            <UserAssignModal
                elements={Object.keys(users).map((user) => {
                    return {
                        name: users[user as unknown as number],
                        value: user,
                    };
                })}
                title={"Select User to associate with this client id"}
                callback={(value) => {
                    fetch(`${url}client/${client.id}/user`, {
                        method: "PUT",
                        body: JSON.stringify({
                            from: +new Date(),
                            newUser: value,
                        }),
                        headers: { "content-type": "application/json" },
                    });
                }}
                trigger={<div style={{ width: "100%" }}>{name} (edit)</div>}
            ></UserAssignModal>

            <div style={{ width: "100%" }}>&nbsp;</div>
            <div style={{ width: "100%" }}>{client.id}</div>
        </div>
    );
}
