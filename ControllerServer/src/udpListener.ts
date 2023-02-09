import {EmptyPacket, PointPacket, ShotData} from "./types";
import {calcScore} from "./bitmapParser";
import {config, saveData, stateData} from "./index";
import dgram from "dgram";

const client = dgram.createSocket("udp4");

client.on("listening", function () {
    let address = client.address();
    console.log(
        "UDP Client listening on " + address.address + ":" + address.port
    );
    client.setBroadcast(true);
});

let added: number[] = []
client.on("message", async function (message, rinfo) {
    EmptyPacket.setBuffer(message);
    if (EmptyPacket.fields.pktype == 0) {
        PointPacket.setBuffer(message);
        let p: any = PointPacket.fields;
        if (!added.includes(p.idPacket.shotId)) {
            let data: ShotData = JSON.parse(JSON.stringify(p));
            data.ts = +new Date();
            data.score = calcScore(data.p.x, data.p.y, stateData.calibration);
            added.push(p.idPacket.shotId);

            stateData.sessionData.shots.push(data);

            if (!stateData.sessionData.clients[data.idPacket.clientId])
                stateData.sessionData.clients[data.idPacket.clientId] = {users: [], id: data.idPacket.clientId};

            await saveData();

            console.log(
                `x:${p.p.x} y:${p.p.y} id: ${p.idPacket.shotId} from: ${p.idPacket.clientId} score: ${data.score}`
            );
        }
    }

    if (EmptyPacket.fields.pktype === 1) {
        stateData.lastKA = +new Date();
    }
});

client.on("connection", (ws) => {
    console.log("Message from: ");
});

client.bind(config.udpPort, "0.0.0.0");
