export function GetObjectKeys<T>(obj: T): Array<keyof T> {
    // @ts-ignore
    return Object.keys(obj) as Array<keyof typeof obj>
}

export type ShotData = {
    pktype: 0;
    ts: number;
    idPacket: {
        clientId: number;
        shotId: number;
    };
    w: number;
    h: number;
    score: number;
    p: {
        x: number;
        y: number;
        R: number;
        G: number;
        B: number;
    };
    session: number;
};

export type ClientData = {
    id: number,
    users: { from: number, userId: number }[]
}

export type SessionData = {
    shots: ShotData[];
    clients: { [key: number]: ClientData };
};

export type SessionEntry = { name?: string, ts: number, shots: number }

export type SessionInfo = { lastKA: number; session?: SessionEntry, changeIndex: number, lastFetch: number, startTime:number }

export type Users = {
    [key: number]: string
}

export type Session = {
    sessionData: SessionData,
    sessionInfo: SessionInfo,
    users: Users,
}

export type CalibrationType = { offsetX: number; offsetY: number; scale: number, scoreMultiplier: number, scorePostMultiplier: number }

export type SessionContext = {
    sessionData: SessionData,
    sessionInfo: SessionInfo,
    users: Users,
    sessions: SessionEntry[],
    updateSessions: () => any,
    localCalibration: CalibrationType,
    setLocalCalibration: (v: CalibrationType) => any
}