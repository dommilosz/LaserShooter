import Struct from "struct";
import {IDPacketType, IDShotPacketType, PointStructType} from "./types";

export const IDPacket_ID = 0
export const IDShotPacket_ID = 1

export const PointPacket_ID = (0 + 256)
export const KeepAlivePacket_ID = (1 + 256)

export const IDShotPacket = Struct<IDShotPacketType>()
    .word32Ule("pktype")
    .word32Ule("clientId")
    .word32Ule("shotId")

export const IDPacket = Struct<IDPacketType>()
    .word32Ule("pktype")
    .word32Ule("clientId")

export const PointStruct = Struct<PointStructType>()
    .word32Ule("x")
    .word32Ule("y")
    .word8("R")
    .word8("G")
    .word8("B")
    .word8("found")

export const PointPacket = Struct<{pktype:number, idPacket:IDPacketType, w:number, h:number, score:number, p:PointStructType}>()
    .word32Ule("pktype")
    .struct("idPacket", IDShotPacket)
    .word32Ule("w")
    .word32Ule("h")
    .word32Sle("score")
    .struct("p", PointStruct)

export const EmptyPacket = Struct<{pktype:number}>()
    .word32Ule("pktype")