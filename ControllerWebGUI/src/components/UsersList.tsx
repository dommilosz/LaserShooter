import React, { useContext } from "react";
import { sessionContext } from "../App";
import { selectedUserContext } from "../views/UsersView";
import DeleteIcon from '@mui/icons-material/Delete';
import { url } from "../api/backendApi";
import "./UsersList.css"
import {IconButton} from "@mui/material";

export default function UsersList({ selectedUser, setSelectedUser }: any) {
    let { users } = useContext(sessionContext);

    return (
        <selectedUserContext.Provider value={[selectedUser, setSelectedUser]}>
            <div className="object-container">
                <div
                    className={"shot_object adder users"}
                    onClick={async () => {
                        let userName = prompt("Enter username to create");
                        let userId = +new Date();
                        await fetch(url + "users/" + userId, {
                            method: "PUT",
                            body: JSON.stringify({ name: userName }),
                            headers: { "content-type": "application/json" },
                        });
                    }}
                >
                    +
                </div>
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
            </div>
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
        <div
            className={"shot_object users" + (selectedUser == index ? " active" : "")}
            onClick={() => {
                if (setSelectedUser) setSelectedUser(index);
            }}
        >
            <div style={{width:"80%",height:"100%"}}>
                <div style={{ width: "100%" }}>{user.name}</div>
                <div style={{ width: "100%" }}>{user.id}</div>
            </div>
            <div style={{width:"20%",height:"100%",display:"flex",alignItems:"center"}}>
                <IconButton onClick={async ()=>{
                    if(!confirm(`Do you want to remove ${user.id} user? Clients and shots with this user will be reverted to their ids`)){
                        return;
                    }
                    let resp = await fetch(url + "users/" + user.id, {
                        method: "DELETE",
                    });
                    if(resp.status !== 200){
                        alert(await resp.text())
                    }
                }}>
                    <DeleteIcon />
                </IconButton>
            </div>
        </div>
    );
}
