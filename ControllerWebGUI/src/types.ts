export type ShotData = {
    pktype: 0,
    ts: number,
    idPacket: {
        clientId: number,
        shotId: number,
    },
    w: number,
    h: number,
    score: number,
    p: {
        x: number,
        y: number,
        R: number,
        G: number,
        B: number,
    },
    session: number
}