import Struct from "struct";
import {PNG} from "pngjs";

export type IDPacketType = {
    pktype: 0,
    cliendId:number,
}

export type IDShotPacketType = {
    pktype: 0,
    cliendId:number,
    shotId:number,
}

export type PointStructType = {
    x: number, y: number, R: number, G: number, B: number, found: boolean,
}

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

export type SessionData = { header:{ name?: string, ts: number } ,shots: ShotData[], clients: { [key: number]: ClientData } }
export type CalibrationType = { offsetX: number; offsetY: number; scale: number, scoreMultiplier:number, scorePostMultiplier:number }

export type BitmapData = PNG & Partial<{buffer:Buffer, gz:Buffer}>