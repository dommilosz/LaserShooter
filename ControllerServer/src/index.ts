import express, {json, Request, Response} from 'express'
import {sendCompletion, sendFile, sendJSON, sendText} from 'express-wsutils';
import configured from 'configuredjs';
import dgram from "dgram";
import * as fs from "fs";
import zlib from "zlib";
import cors from "cors";
import {EmptyPacket, PointPacket, ShotData} from './types';
import { calcPoints } from './calcPoints';

let config = configured({
    path: "./config.json", writeMissing: true, defaultConfig: {
        port: 8008,
        cameraIp: "192.168.4.1",
        udpPort: 19700
    }
})

const app = express()
const port = config.port
app.use(json({limit: '50mb'}));
app.use(cors())

let added: number[] = []

app.get('/', (req: Request, res: Response) => {
    sendFile(req, res, "src/index.html", 200);
})

app.get('/target.png', (req: Request, res: Response) => {
    res.writeHead(200, {'Content-Type': 'image/png', 'Content-Encoding': 'gzip'});
    zlib.gzip(fs.readFileSync("./target.png"), function (_, result) {  // The callback will give you the
        res.end(result);                     // result, so just send it.
    });
})

app.get('/target.png', (req: Request, res: Response) => {
    res.writeHead(200, {'Content-Type': 'image/png', 'Content-Encoding': 'gzip'});
    zlib.gzip(fs.readFileSync("./target.png"), function (_, result) {  // The callback will give you the
        res.end(result);                     // result, so just send it.
    });
})

app.get('/sessions/current', (req: Request, res: Response) => {
    res.writeHead(200, {'Content-Type': 'application/json', 'Content-Encoding': 'gzip'});
    const text = JSON.stringify(sessionData);
    zlib.gzip(text, function (_, result) {
        res.end(result);
    });
})

app.get('/sessions/:session', (req: Request, res: Response) => {
    let buf = fs.readFileSync("data/" + req.params.session + ".json.gz");
    res.writeHead(200, {'Content-Type': 'application/json', 'Content-Encoding': 'gzip'});
    res.write(buf);
    res.end();
})

app.get('/sessions', (req: Request, res: Response) => {
    let files = fs.readdirSync("data", {withFileTypes: true}).filter((file) => {
        return file.isFile() && file.name.endsWith(".json.gz");
    }).map(file => {
        return file.name.split(".")[0];
    })
    sendJSON(res, files, 200);
})

app.get('/session', (req: Request, res: Response) => {
    sendJSON(res, {session: currentSession,shots:sessionData.shots.length,lastKA}, 200);
})

app.get('/new-session', (req: Request, res: Response) => {
    currentSession = +new Date();
    sessionData =  {shots: [], clients: {}};
    sendJSON(res, {session: currentSession}, 200);
})

app.listen(port, () => {
    console.log(`Api listening on port ${port}`)
})

const client = dgram.createSocket('udp4');
let currentSession = +new Date();
let sessionData: { shots: ShotData[], clients: { [key: number]: 1 } } = {shots: [], clients: {}}
let lastKA = 0;

if (!fs.existsSync("data")) {
    fs.mkdirSync("data");
}

client.on('listening', function () {
    let address = client.address();
    console.log('UDP Client listening on ' + address.address + ":" + address.port);
    client.setBroadcast(true);
});

client.on('message', async function (message, rinfo) {
    // @ts-ignore
    EmptyPacket._setBuff(message);
    // @ts-ignore
    if (EmptyPacket.fields.pktype == 0) {
        // @ts-ignore
        PointPacket._setBuff(message);
        let p: any = PointPacket.fields;
        if (!added.includes(p.idPacket.shotId)) {
            let data: ShotData = JSON.parse(JSON.stringify(p));
            data.ts = +new Date();
            data.score = calcPoints(data.p.x,data.p.y);
            added.push(p.idPacket.shotId);
            sessionData.shots.push(data);
            sessionData.clients[data.idPacket.clientId] = 1;

            let str = JSON.stringify(sessionData);
            let buf = zlib.gzipSync(Buffer.from(str));

            await fs.writeFileSync(`data/${currentSession}.json.gz`, buf, {encoding: "utf-8"});
            console.log(`x:${p.p.x} y:${p.p.y} id: ${p.idPacket.shotId} from: ${p.idPacket.clientId} score: ${data.score}`);
        }
    }
    // @ts-ignore
    if(EmptyPacket.fields.pktype === 1){
        lastKA = +new Date()
    }
});

client.on('connection', (ws) => {
    console.log('Message from: ');
})

client.bind(config.udpPort, "0.0.0.0");