import React, {useContext, useState} from "react";
import {sessionContext} from "../App";
import {createContext} from "../api/hooks";
import { selectedUserContext } from "../views/UsersView";

export default function UsersList({selectedUser,setSelectedUser}:any) {
    let {sessionInfo, sessionData, users} = useContext(sessionContext);

    return <selectedUserContext.Provider value={[selectedUser, setSelectedUser]}>
        <div className="object-container">
            <div className={"shot_object adder"} style={{height:42}}
                 onClick={async () => {
                    let userName = prompt("Enter username to create");
                    let userId = +new Date();
                    await fetch("http://localhost:8008/users/"+userId,{method: 'PUT',body:JSON.stringify({name:userName}),headers:{"content-type":"application/json"}});
                 }}>

                +
            </div>
            {Object.keys(users).map((userKey, i) => {
                let user = users[userKey as unknown as number];
                return <UserObject user={{id: userKey as unknown as number, name: user}} index={i}></UserObject>
            })}
        </div>
    </selectedUserContext.Provider>
}

export function UserObject({user, index}: { user: { id: number, name: string }, index: number }) {
    let {sessionInfo, sessionData, users} = useContext(sessionContext);
    let [selectedUser, setSelectedUser] = useContext(selectedUserContext);

    return <div className={"shot_object" + (selectedUser == index ? " active" : "")}
         onClick={() => {
             if (setSelectedUser)
                 setSelectedUser(index)
         }}>

        <div style={{width: "100%"}}>{user.name}</div>
        <div style={{width: "100%"}}>{user.id}</div>
    </div>
}
