import {useEffect, useState} from "react";
import {SessionData, SessionInfo} from "../types";

export async function getSession(session: number | "current") {
    let sessionData = await fetch("http://localhost:8008/sessions/" + session);
    return await sessionData.json();
}

export async function getSessionInfo() {
    let sessionInfo = await fetch("http://localhost:8008/session");
    return await sessionInfo.json();
}

export function useCurrentSession(): [SessionInfo, SessionData] {
    let [sessionInfo, setSessionInfo] = useState({
        session: 0,
        shots: 0,
        lastKA: 0,
    });
    let [sessionData, setSessionData] = useState<SessionData>({
        shots: [],
        clients: {},
    });
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
            setSessionData(await getSession("current"));
        });
    }, [sessionInfo.shots]);

    return [sessionInfo, sessionData]
}