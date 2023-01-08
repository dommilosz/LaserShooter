import { useEffect, useState } from "react";
import {SessionInfo, SessionData, Users, Session} from "../types";

export let url = "http://localhost:3000"
try{
    url = JSON.parse(localStorage.getItem("server-url")??url)
}catch{

}
if(!url.endsWith("/")){
    url = url + "/"
}

async function fetchWithTimeout(resource:string, options:any = {}) {
    const { timeout = 5000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);
    return response;
}

export async function getSession(session: number | "current") {
    let sessionData = await fetch(url + "sessions/" + session);
    return await sessionData.json();
}

export async function getSessionInfo() {
    let sessionInfo = await fetchWithTimeout(url + "session");
    return await sessionInfo.json();
}

export async function getUsers() {
    let users = await fetch(url + "users");
    return await users.json();
}

export async function putUser(userId:number,userName:string){
    return await fetch(url + "users/" + userId, {
        method: "PUT",
        body: JSON.stringify({ name: userName }),
        headers: { "content-type": "application/json" },
    });
}

export async function removeUser(userId:number){
    return  await fetch(url + "users/" + userId, {
        method: "DELETE",
    });
}

export async function removeUsers(){
    return  await fetch(url + "users", {
        method: "DELETE",
    });
}

export async function assignUserToClient(clientId:number,user:string){
    return await fetch(`${url}client/${clientId}/user`, {
        method: "PUT",
        body: JSON.stringify({
            from: +new Date(),
            newUser: user,
        }),
        headers: {"content-type": "application/json"},
    });
}

export async function deleteShot(shotId:number){
    return await fetch(
        url + "shot/" + shotId,
        {
            method: "DELETE",
        }
    );
}

export async function checkServer(surl:string){
    if(!surl.endsWith("/"))
        surl = surl+"/";
    let resp = await fetch(surl+"session");
    let json = await resp.json();
    return !!json.session;
}

export async function putSession(session?:number){
    return await fetch(url + "session/", {
        method: "PUT",
        body: JSON.stringify({ session: session }),
        headers: { "content-type": "application/json" },
    });
}

export async function getSessions(){
    let resp = await fetch(url + "sessions/");
    return await resp.json();
}

export function useCurrentSession(): Session {
    let [sessionInfo, setSessionInfo] = useState<SessionInfo>({
        session: 0,
        shots: 0,
        lastKA: 0,
        changeIndex: 0,
        lastFetch:0,
    });
    let [sessionData, setSessionData] = useState<SessionData>({
        shots: [],
        clients: {},
    });

    let [users, setUsers] = useState<Users>({});

    let [lastFetch, setLastFetch] = useState(0);

    useEffect(() => {
        const intervalCall = setInterval(async () => {
            try{
                setSessionInfo(await getSessionInfo());
            }catch(e) {
                console.error(e);
                setSessionInfo({session:0,lastKA:0,shots:0,changeIndex:0,lastFetch});
            }
            setLastFetch(+new Date());
        }, 1500);
        return () => {
            // clean up
            clearInterval(intervalCall);
        };
    }, []);

    useEffect(() => {
        setTimeout(async () => {
            if (sessionInfo.session === 0) {
                try{
                    setSessionInfo(await getSessionInfo());
                }catch(e) {
                    console.error(e);
                    setSessionInfo({session:0,lastKA:0,shots:0,changeIndex:0,lastFetch});
                }
                setLastFetch(+new Date());
            }
            setUsers(await getUsers());
            setSessionData(await getSession("current"));
        });
    }, [sessionInfo.changeIndex,sessionInfo.session]);

    sessionInfo.lastFetch = lastFetch;

    return { sessionInfo, sessionData, users };
}
