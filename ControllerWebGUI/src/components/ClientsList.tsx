import React, {useContext} from "react";
import {sessionContext} from "../App";
import {ClientData} from "../types";
import EditIcon from '@mui/icons-material/Edit';
import {UserAssignModal} from "../customComponents/userAssignModal";
import {selectedClientContext} from "../views/ClientsView";
import {url} from "../api/backendApi";
import {resolveClientUserName} from "../api/resolveClientUser";
import {Box, Card, Typography, Stack, IconButton} from "@mui/material";
import Edit from "@mui/icons-material/Edit";

export default function ClientsList(
    {
        selectedShot: selectedClient,
        setSelectedShot: setSelectedClient,
    }: any) {
    let {sessionData} = useContext(sessionContext);

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

export function ClientObject(
    {
        client,
        index,
    }: {
        client: ClientData;
        index: number;
    }) {

    const [selectedClient, setSelectedClient] = useContext(
        selectedClientContext
    );
    let {sessionData, users} = useContext(sessionContext);
    let name = resolveClientUserName(sessionData, client.id, users);
    const [open, setOpen] = React.useState(false);

    const Modal = <UserAssignModal
        elements={Object.keys(users).map((user) => {
            return {
                name: users[user as unknown as number],
                value: user,
            };
        })}
        callback={(value) => {
            fetch(`${url}client/${client.id}/user`, {
                method: "PUT",
                body: JSON.stringify({
                    from: +new Date(),
                    newUser: value,
                }),
                headers: {"content-type": "application/json"},
            });
        }}
        open={open}
        setOpen={setOpen}
    ></UserAssignModal>

    return <Card className={`object-card clients ${selectedClient == index?"active":""}`} onClick={() => {
        if (setSelectedClient) setSelectedClient(index);
    }}>
        {Modal}
        <Box sx={{p: 2, display: 'flex', width: "100%", justifyContent: "center",alignItems:"center"}}>
            <Stack spacing={0.5}>
                <Typography fontWeight={700}>{name}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {client.id}
                </Typography>
            </Stack>
            <IconButton onClick={() => setOpen(true)}>
                <Edit sx={{fontSize: 14}}/>
            </IconButton>
        </Box>
    </Card>;
}
