import React, { useContext, useState } from "react";
import { sessionContext } from "../App";
import { ClientData, ShotData } from "../types";
import { createContext } from "../api/hooks";
import { BootstrapTooltip } from "../api/customElements";
import { UserAssignModal } from "../customComponents/userAssignModal";
import { selectedClientContext } from "../views/ClientsView";
import { url } from "../api/backendApi";
import { resolveClientUserName } from "../api/resolveClientUser";
import "./ClientsList.css"

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
    let name = resolveClientUserName(sessionData,client.id,users);
    const [open, setOpen] = React.useState(false);

    return (
        <div
            className={
                "shot_object clients" + (selectedClient == index ? " active" : "")
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
                open={open}
                setOpen={setOpen}
            ></UserAssignModal>

            <div style={{ width: "100%",display:"flex",height:30,alignItems:"center",justifyContent:"center" }}>
                <div>{name}</div>
                <img src={require("../images/edit.png")} className="edit-btn" style={{height:30}} onClick={()=>setOpen(true)}/></div>
            <div style={{ width: "100%" }}>&nbsp;</div>
            <div style={{ width: "100%" }}>{client.id}</div>
        </div>
    );
}
