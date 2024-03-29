import {useEffect, useState} from "react";
import {SessionInfo, SessionData, Users, Session, CalibrationType, SessionEntry} from "../types";

export let url = "http://localhost:3000"
try {
    url = JSON.parse(localStorage.getItem("server-url") ?? url)
} catch {

}
if (!url.endsWith("/")) {
    url = url + "/"
}

async function fetchWithTimeout(resource: string, options: any = {}) {
    const {timeout = 5000} = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);
    return response;
}

export async function getActiveClients() {
    let sessionData = await fetch(url + "clients/active");
    return await sessionData.json();
}

export async function getSession(session: number | "current") {
    let sessionData = await fetch(url + "sessions/" + session);
    return await sessionData.json();
}

export async function renameSession(newName: string) {
    return await (await fetch(url + "sessions/current", {
        method: "PATCH",
        body: JSON.stringify({name: newName}),
        headers: {"content-type": "application/json"},
    })).json();
}

export async function getSessionInfo() {
    let sessionInfo = await fetchWithTimeout(url + "session");
    return await sessionInfo.json();
}

export async function getUsers() {
    let users = await fetch(url + "users");
    return await users.json();
}

export async function putUser(userId: number, userName: string) {
    return await fetch(url + "users/" + userId, {
        method: "PUT",
        body: JSON.stringify({name: userName}),
        headers: {"content-type": "application/json"},
    });
}

export async function removeUser(userId: number) {
    return await fetch(url + "users/" + userId, {
        method: "DELETE",
    });
}

export async function removeUsers() {
    return await fetch(url + "users", {
        method: "DELETE",
    });
}


export async function assignUserToClient(clientId: number, user: string) {
    return await fetch(`${url}client/${clientId}/user`, {
        method: "PUT",
        body: JSON.stringify({
            from: +new Date(),
            newUser: user,
        }),
        headers: {"content-type": "application/json"},
    });
}

export async function addClient(clientId: number) {
    return await fetch(`${url}client/${clientId}`, {
        method: "PUT",
    });
}

export async function deleteClient(clientId: number) {
    return await fetch(`${url}client/${clientId}`, {
        method: "DELETE",
    });
}

export async function deleteShot(shotId: number) {
    return await fetch(
        url + "shot/" + shotId,
        {
            method: "DELETE",
        }
    );
}

export async function checkServer(serverUrl: string) {
    if (!serverUrl.endsWith("/"))
        serverUrl = serverUrl + "/";
    let resp = await fetch(serverUrl + "session");
    let json = await resp.json();
    return !!json.session;
}

export async function putSession(session?: number) {
    return await fetch(url + "session/", {
        method: "PUT",
        body: JSON.stringify({session: session}),
        headers: {"content-type": "application/json"},
    });
}

export async function getSessions(): Promise<SessionEntry[]> {
    let resp = await fetch(url + "sessions/");
    return await resp.json();
}

export async function removeSessions() {
    return await fetch(url + "sessions", {
        method: "DELETE",
    });
}

export async function resetServer() {
    return await fetch(url + "server-data", {
        method: "DELETE",
    });
}

export async function setCalibration(data: CalibrationType) {
    return await fetch(url + "calibration", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-Type": "Application/json"},
    });
}

export async function getCalibration() {
    let resp = await fetch(url + "calibration/");
    return await resp.json();
}


export function useCurrentSession(): Session {
    let [sessionInfo, setSessionInfo] = useState<SessionInfo>({
        session: undefined,
        lastKA: 0,
        changeIndex: 0,
        lastFetch: 0,
        startTime:0
    });
    let [sessionData, setSessionData] = useState<SessionData>({
        shots: [],
        clients: {},
    });

    let [users, setUsers] = useState<Users>({});

    let [lastFetch, setLastFetch] = useState(0);

    useEffect(() => {
        const intervalCall = setInterval(async () => {
            try {
                setSessionInfo(await getSessionInfo());
            } catch (e) {
                console.error(e);
                setSessionInfo({session: undefined, lastKA: 0, changeIndex: 0, lastFetch,startTime:0});
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
            if (!sessionInfo.session) {
                try {
                    setSessionInfo(await getSessionInfo());
                } catch (e) {
                    console.error(e);
                    setSessionInfo({session: undefined, lastKA: 0, changeIndex: 0, lastFetch, startTime:0});
                }
                setLastFetch(+new Date());
            }
            setUsers(await getUsers());
            setSessionData(await getSession("current"));
        });
    }, [sessionInfo.changeIndex, sessionInfo.session?.ts, sessionInfo.session?.name]);

    sessionInfo.lastFetch = lastFetch;

    return {sessionInfo, sessionData, users};
}
