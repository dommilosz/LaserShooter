import React, {useContext, useState} from "react";
import {sessionContext} from "../App";
import {selectedUserContext} from "../views/UsersView";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {putUser, removeUser, url} from "../api/backendApi";
import {Box, Card, IconButton, Stack, Typography} from "@mui/material";
import ObjectContainer, {ObjectCard} from "./ObjectContainer";
import StatisticsModal from "../customComponents/statisticsModal";
import AssessmentIcon from "@mui/icons-material/Assessment"
import {useShowConfirmBox, useShowPromptBox} from "./DialogBoxComponents/MessageBoxContext";

export default function UsersList({selectedUser, setSelectedUser}: any) {
    let {users} = useContext(sessionContext);
    let showPromptBox = useShowPromptBox();

    return (
        <selectedUserContext.Provider value={[selectedUser, setSelectedUser]}>
            <ObjectContainer empty={false}>
                <ObjectCard
                    className={`object-card users`}
                    onClick={async () => {
                        let userName = await showPromptBox({content:"Enter username of the new user",title:"Create user", fieldName:"Username"});
                        let userId = +new Date();
                        if (!userName) return;
                        await putUser(userId, userName);
                    }}
                >
                    <Box
                        sx={{
                            p: 2,
                            display: "flex",
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Stack spacing={0.5}>
                            <Typography variant="body2" color="text.secondary">
                                Add new user
                            </Typography>
                        </Stack>
                    </Box>
                </ObjectCard>
                {Object.keys(users).map((userKey, i) => {
                    let user = users[userKey as unknown as number];
                    return (
                        <UserObject
                            user={{
                                id: userKey as unknown as number,
                                name: user,
                            }}
                            index={i}
                            key={i}
                        ></UserObject>
                    );
                })}
            </ObjectContainer>
        </selectedUserContext.Provider>
    );
}

export function UserObject({
                               user,
                               index,
                           }: {
    user: { id: number; name: string };
    index: number;
}) {
    let [selectedUser, setSelectedUser] = useContext(selectedUserContext);
    let [statisticsOpen, setStatisticsOpen] = useState(false);
    let showConfirmBox = useShowConfirmBox();
    let showPromptBox = useShowPromptBox();

    return (
        <ObjectCard
            active={selectedUser == index}
            className={`object-card shots`}
            onClick={() => {
                if (setSelectedUser) setSelectedUser(index);
            }}
        >
            <StatisticsModal open={statisticsOpen} setOpen={(open)=>setStatisticsOpen(open)} userId={user.id}></StatisticsModal>
            <Box
                sx={{
                    p: 2,
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Stack spacing={0.5}>
                    <Typography fontWeight={700}>{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {user.id}
                    </Typography>
                </Stack>
                <IconButton onClick={()=>setStatisticsOpen(true)}>
                    <AssessmentIcon sx={{fontSize: 20}}/>
                </IconButton>
                <IconButton
                    onClick={async () => {
                        if (
                            !await showConfirmBox(
                                {content:`Remove ${user.name} (${user.id}) user? Clients and shots with this user will be reverted to their ids`,title:`Remove user ${user.name}`, }
                            )
                        ) {
                            return;
                        }
                        let resp = await removeUser(user.id)
                        if (resp.status !== 200) {
                            alert(await resp.text());
                        }
                    }}
                >
                    <DeleteIcon sx={{fontSize: 20}}/>
                </IconButton>
                <IconButton
                    onClick={async () => {
                        let userName = await showPromptBox({content:`Enter new username for: ${user.name} (${user.id})`,title:`Rename user ${user.name}`, fieldName:"Username"});
                        if (!userName) return;
                        await putUser(user.id, userName);
                    }}
                >
                    <EditIcon sx={{fontSize: 20}}/>
                </IconButton>
            </Box>
        </ObjectCard>
    );
}
