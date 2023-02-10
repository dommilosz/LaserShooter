import {ShotData} from "./types";
import {calcScore} from "./bitmapParser";
import {config, saveData, stateData} from "./index";
import dgram from "dgram";
import {EmptyPacket, IDPacket, IDPacket_ID, KeepAlivePacket_ID, PointPacket, PointPacket_ID} from "./networkStructs";

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
    const packetId = EmptyPacket.fields.pktype;

    if (packetId == PointPacket_ID) {
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

    if (packetId === KeepAlivePacket_ID) {
        stateData.lastKA = +new Date();
    }

    if(packetId === IDPacket_ID){
        IDPacket.setBuffer(message);
        stateData.clients[IDPacket.fields.cliendId] = {lastPacket:+new Date()};
    }
});

client.on("connection", (ws) => {
    console.log("Message from: ");
});

client.bind(config.udpPort, "0.0.0.0");
