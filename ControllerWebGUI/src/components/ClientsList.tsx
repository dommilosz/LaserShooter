import React, {useContext, useEffect, useState} from "react";
import {sessionContext} from "../App";
import {ClientData} from "../types";
import {UserAssignModal} from "../customComponents/userAssignModal";
import {selectedClientContext} from "../views/ClientsView";
import {addClient, assignUserToClient, deleteClient, getActiveClients} from "../api/backendApi";
import {resolveClientUserName} from "../api/resolveClientUser";
import {Box, Typography, Stack, IconButton} from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import ObjectContainer, {ObjectCard} from "./ObjectContainer";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {useShowConfirmBox} from "./DialogBoxComponents/MessageBoxContext";

export default function ClientsList(
    {
        selectedShot: selectedClient,
        setSelectedShot: setSelectedClient,
    }: any) {
    let {sessionData} = useContext(sessionContext);

    const [availableClients, setAvailableClients] = useState({});
    useEffect(() => {
        (async () =>
            setAvailableClients(await getActiveClients()))()
    }, [])

    let unAddedClients = Object.keys(availableClients).filter(client => {
        return !Object.keys(sessionData.clients).includes(client)
    });

    return (
        <selectedClientContext.Provider
            value={[selectedClient, setSelectedClient]}
        >
            <ObjectContainer empty={Object.keys(sessionData.clients).length + unAddedClients.length <= 0}>
                {Object.keys(sessionData.clients).map((clientKey, i) => {
                    let client =
                        sessionData.clients[clientKey as unknown as number];
                    return (
                        <ClientObject client={client} index={i} key={i}></ClientObject>
                    );
                })}
                {unAddedClients.length > 0 ? <Typography margin={1}>Available Clients: </Typography> : <></>}
                {unAddedClients.map((client, i) => {
                    return (
                        <AvailableClientObject clientId={Number(client)} key={client}></AvailableClientObject>
                    );
                })}
            </ObjectContainer>
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

    let showConfirmBox = useShowConfirmBox();

    const Modal = <UserAssignModal
        elements={Object.keys(users).map((user) => {
            return {
                name: users[user as unknown as number],
                value: user,
            };
        })}
        callback={(value) => {
            assignUserToClient(client.id, value);
        }}
        open={open}
        setOpen={setOpen}
    ></UserAssignModal>

    return <ObjectCard
        active={selectedClient == index} className={`object-card clients`} onClick={() => {
        if (setSelectedClient) setSelectedClient(index);
    }}>
        {Modal}
        <Box sx={{p: 2, display: 'flex', width: "100%", justifyContent: "center", alignItems: "center"}}>
            <Stack spacing={0.5}>
                <Typography fontWeight={700}>{name}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {client.id}
                </Typography>
            </Stack>
            <IconButton onClick={() => setOpen(true)}>
                <Edit sx={{fontSize: 20}}/>
            </IconButton>
            <IconButton onClick={async () => {
                if(await showConfirmBox({
                    content: `Remove user: ${client.id}? This operation will also remove all shots associated to this user`,
                    title: `Remove: ${client.id}?`
                })) await deleteClient(client.id);
            }}>
                <DeleteIcon sx={{fontSize: 20}}/>
            </IconButton>
        </Box>
    </ObjectCard>;
}

export function AvailableClientObject(
    {
        clientId,
    }: {
        clientId: number;
    }) {

    return <ObjectCard className={`object-card clients`}>
        <Box sx={{p: 2, display: 'flex', width: "100%", justifyContent: "center", alignItems: "center"}}>
            <Stack spacing={0.5}>
                <Typography fontWeight={700}>{clientId}</Typography>
            </Stack>
            <IconButton onClick={() => addClient(clientId)}>
                <AddIcon sx={{fontSize: 20}}/>
            </IconButton>
        </Box>
    </ObjectCard>;
}
