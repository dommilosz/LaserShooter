import React, { useContext } from "react";
import { sessionContext } from "../App";
import { selectedUserContext } from "../views/UsersView";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {putUser, removeUser, url} from "../api/backendApi";
import { Box, Card, IconButton, Stack, Typography } from "@mui/material";
import ObjectContainer from "./ObjectContainer";

export default function UsersList({ selectedUser, setSelectedUser }: any) {
    let { users } = useContext(sessionContext);

    return (
        <selectedUserContext.Provider value={[selectedUser, setSelectedUser]}>
            <ObjectContainer empty={false}>
                <Card
                    className={`object-card users`}
                    onClick={async () => {
                        let userName = prompt("Enter username to create");
                        let userId = +new Date();
                        await putUser(userId,userName);
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
                </Card>
                {Object.keys(users).map((userKey, i) => {
                    let user = users[userKey as unknown as number];
                    return (
                        <UserObject
                            user={{
                                id: userKey as unknown as number,
                                name: user,
                            }}
                            index={i}
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

    return (
        <Card
            className={`object-card users ${
                selectedUser == index ? "active" : ""
            }`}
            onClick={() => {
                if (setSelectedUser) setSelectedUser(index);
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
                    <Typography fontWeight={700}>{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {user.id}
                    </Typography>
                </Stack>
                <IconButton
                    onClick={async () => {
                        if (
                            !confirm(
                                `Do you want to remove ${user.id} user? Clients and shots with this user will be reverted to their ids`
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
                    <DeleteIcon sx={{ fontSize: 20 }} />
                </IconButton>
                <IconButton
                    onClick={async () => {
                        let userName = prompt("Enter new username");
                        await putUser(user.id,userName);
                    }}
                >
                    <EditIcon sx={{ fontSize: 20 }} />
                </IconButton>
            </Box>
        </Card>
    );
}
