import Struct from "struct";
import {PNG} from "pngjs";

export type IDPacketType = {
    cliendId:number,
    shotId:number,
}

export const IDPacket = Struct<IDPacketType>()
    .word32Ule("clientId")
    .word32Ule("shotId")

export type PointStructType = {
    x:number, y:number, R:number, G: number, B:number, found:boolean,
}
export const PointStruct = Struct<PointStructType>()
    .word32Ule("x")
    .word32Ule("y")
    .word8("R")
    .word8("G")
    .word8("B")
    .word8("found")

export const PointPacket = Struct<{pktype:number, idPacket:IDPacketType, w:number, h:number, score:number, p:PointStructType}>()
    .word32Ule("pktype")
    .struct("idPacket", IDPacket)
    .word32Ule("w")
    .word32Ule("h")
    .word32Sle("score")
    .struct("p", PointStruct)

export const EmptyPacket = Struct<{pktype:number}>()
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
export type CalibrationType = { offsetX: number; offsetY: number; scale: number, scoreMultiplier:number, scorePostMultiplier:number }

export type BitmapData = PNG & Partial<{buffer:Buffer, gz:Buffer}>