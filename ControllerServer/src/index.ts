import configured from "configuredjs";
import * as fs from "fs";
import zlib from "zlib";
import {CalibrationType, SessionData} from "./types";

export let config = configured({
    path: "./config.json",
    writeMissing: true,
    defaultConfig: {
        port: 8008,
        cameraIp: "192.168.4.1",
        udpPort: 19700,
        target: {height: 120, width: 160}
    },
});

export let startTime = +new Date();
export let stateData: {
    calibration: CalibrationType;
    currentSession: number, sessionData: SessionData, lastKA: number, users: { [key: number]: string }, changeIndex: number,
    clients: {[key:string]:{lastPacket: number,}}
} = {
    currentSession: +new Date(),
    sessionData: {shots:[], header:{ts:+new Date()}, clients:{}},
    lastKA: 0,
    users: {},
    changeIndex: 0,
    calibration: {offsetX: 0, offsetY: 0, scale: 100, scoreMultiplier:10, scorePostMultiplier:10},
    clients:{}
}

if (!fs.existsSync("data")) {
    fs.mkdirSync("data");
}
if (fs.existsSync(`data/users.json`)) {
    stateData.users = JSON.parse(fs.readFileSync(`data/users.json`, {encoding: "utf-8"}))
}
if (fs.existsSync(`data/calibration.json`)) {
    stateData.calibration = JSON.parse(fs.readFileSync(`data/calibration.json`, {encoding: "utf-8"}))
}

export async function saveData() {
    if (stateData.sessionData && stateData.sessionData.shots.length > 0) {
        let str = JSON.stringify(stateData.sessionData);
        let buf = zlib.gzipSync(Buffer.from(str));

        fs.writeFileSync(`data/${stateData.currentSession}.json.gz`, buf, {
            encoding: "utf-8",
        });
    }
    fs.writeFileSync(`data/users.json`, JSON.stringify(stateData.users), {encoding: "utf-8"});
    fs.writeFileSync("data/calibration.json", JSON.stringify(stateData.calibration));
    stateData.changeIndex++
}

import "./udpListener";
import "./httpApi";
