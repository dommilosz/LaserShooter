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
