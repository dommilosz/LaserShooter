import { useEffect, useState } from "react";
import { Session, SessionData, SessionInfo, Users } from "../types";

export const url = "https://pifpaf.atos-iks.de/";

export async function getSession(session: number | "current") {
    let sessionData = await fetch(url + "sessions/" + session);
    return await sessionData.json();
}

export async function getSessionInfo() {
    let sessionInfo = await fetch(url + "session");
    return await sessionInfo.json();
}

export async function getUsers() {
    let users = await fetch(url + "users");
    return await users.json();
}

export function useCurrentSession(): Session {
    let [sessionInfo, setSessionInfo] = useState({
        session: 0,
        shots: 0,
        lastKA: 0,
        changeIndex: 0,
    });
    let [sessionData, setSessionData] = useState<SessionData>({
        shots: [],
        clients: {},
    });

    let [users, setUsers] = useState<Users>({});

    let [lastFetch, setLastFetch] = useState(0);

    useEffect(() => {
        const intervalCall = setInterval(async () => {
            setSessionInfo(await getSessionInfo());
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
                setSessionInfo(await getSessionInfo());
                setLastFetch(+new Date());
            }
            setUsers(await getUsers());
            setSessionData(await getSession("current"));
        });
    }, [sessionInfo.changeIndex]);

    return { sessionInfo, sessionData, users };
}
