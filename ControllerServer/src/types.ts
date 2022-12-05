import Struct from "struct";

export const IDPacket = Struct()
    .word32Ule("clientId")
    .word32Ule("shotId")

export const Point = Struct()
    .word32Ule("x")
    .word32Ule("y")
    .word8("R")
    .word8("G")
    .word8("B")
    .word8("found")

export const PointPacket = Struct()
    .word32Ule("pktype")
    .struct("idPacket", IDPacket)
    .word32Ule("w")
    .word32Ule("h")
    .word32Sle("score")
    .struct("p", Point)

export const EmptyPacket = Struct()
    .word32Ule("pktype")

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

export type ClientData = {
    id:number,
    users:{from:number,userId:number}[]
}

export type SessionData = { shots: ShotData[]; clients: { [key: number]: ClientData } }