import express, {json, Request, Response} from "express";
import cors from "cors";
import {sendFile, sendJSON, sendText} from "express-wsutils";
import zlib from "zlib";
import fs from "fs";
import {calcScore, originalBitmap, solidBitmap} from "./bitmapParser";
import {config, saveData, startTime, stateData} from "./index";
import fetch from 'node-fetch';
import {SessionData} from "./types";

const app = express();
const port = config.port;
app.use(json({limit: "50mb"}));
app.use(cors());

app.get("/", (req: Request, res: Response) => {
    sendFile(req, res, "src/index.html", 200);
});

app.get("/target.png", (req: Request, res: Response) => {
    res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Encoding": "gzip",
    });
    zlib.gzip(fs.readFileSync("./target.png"), function (_, result) {
        // The callback will give you the
        res.end(result); // result, so just send it.
    });
});

app.get("/target-solid.png", (req: Request, res: Response) => {
    if(!solidBitmap){
        sendText(res, "Not loaded yet", 500);
        return;
    }
    res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Encoding": "gzip",
    });
    res.end(solidBitmap.gz);
});

app.get("/target.png", (req: Request, res: Response) => {
    if(!originalBitmap){
        sendText(res, "Not loaded yet", 500);
        return;
    }
    res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Encoding": "gzip",
    });
    res.end(originalBitmap.gz);
});

app.get("/sessions/current", (req: Request, res: Response) => {
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Content-Encoding": "gzip",
    });
    stateData.sessionData.shots = stateData.sessionData.shots.map((shot)=>{
        shot.score = calcScore(shot.p.x,shot.p.y, stateData.calibration);
        return shot;
    })
    const text = JSON.stringify(stateData.sessionData);
    zlib.gzip(text, function (_, result) {
        res.end(result);
    });
});

app.patch("/sessions/current", async (req: Request, res: Response) => {
    let newName = req.body.name;
    if(!newName){
        sendText(res,"Invalid name", 400);
        return;
    }

    stateData.sessionData.header.name = newName;
    await saveData();

    res.writeHead(200, {
        "Content-Type": "application/json",
        "Content-Encoding": "gzip",
    });
    stateData.sessionData.shots = stateData.sessionData.shots.map((shot)=>{
        shot.score = calcScore(shot.p.x,shot.p.y, stateData.calibration);
        return shot;
    })
    const text = JSON.stringify(stateData.sessionData);
    zlib.gzip(text, function (_, result) {
        res.end(result);
    });
});

app.get("/sessions/:session", (req: Request, res: Response) => {
    let buf = fs.readFileSync("data/" + req.params.session + ".json.gz");
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Content-Encoding": "gzip",
    });
    res.write(buf);
    res.end();
});

app.get("/sessions", (req: Request, res: Response) => {
    let files = fs
        .readdirSync("data", {withFileTypes: true})
        .filter((file) => {
            return file.isFile() && file.name.endsWith(".json.gz");
        })
        .map((file) => {
            try{
                let buf = fs.readFileSync("data/" + file.name);
                let unzip = zlib.gunzipSync(buf);
                let sessionData:SessionData = JSON.parse(unzip.toString());
                if(!sessionData.header)sessionData.header={ts:Number(file.name.split(".")[0])}
                return {shots:sessionData.shots.length, ...sessionData.header};
            }catch {
                return undefined;
            }
        }).filter((session)=>{
            return session && session.ts > 0;
        });
    sendJSON(res, files, 200);
});

app.delete("/sessions", (req: Request, res: Response) => {
    fs.readdirSync("data", {withFileTypes: true})
        .filter((file) => {
            return file.isFile() && file.name.endsWith(".json.gz");
        })
        .forEach((file) => {
            fs.unlinkSync("data/"+file.name)
        });
    stateData.currentSession = +new Date();
    stateData.sessionData = {shots: [], clients: {}, header:{ts:stateData.currentSession}};
    sendText(res, "Sessions deleted", 200);
});

app.get("/session", (req: Request, res: Response) => {
    sendJSON(
        res,
        {session: {shots:stateData.sessionData.shots.length, name:stateData.sessionData.header?.name, ts:stateData.sessionData.header?.ts}, lastKA:stateData.lastKA, changeIndex:stateData.changeIndex, startTime},
        200
    );
});

app.put("/session", (req: Request, res: Response) => {
    let session = req.body.session;

    if (session) {
        if (fs.existsSync("data/" + session + ".json.gz")) {
            let buf = fs.readFileSync("data/" + session + ".json.gz");
            let unzip = zlib.gunzipSync(buf);
            stateData.sessionData = JSON.parse(unzip.toString());
            stateData.currentSession = session;
            if(!stateData.sessionData.header)stateData.sessionData.header = {ts:stateData.currentSession}
            sendJSON(res, {session: stateData.currentSession}, 200);
            return;
        } else {
            sendText(res, "Couldn't load the session", 500);
            return;
        }
    }

    stateData.currentSession = +new Date();
    stateData.sessionData = {shots: [], clients: {}, header:{ts:stateData.currentSession}};
    sendJSON(res, {session: stateData.currentSession}, 200);

});

app.get("/shot/:shot",async (req: Request, res: Response) => {
    let _shot = req.params.shot;
    for (const shot of stateData.sessionData.shots) {
        if(String(shot.idPacket.shotId) === _shot){
            sendJSON(res, shot, 200);
            return;
        }
    }
    sendText(res, "Not found", 404);
})

app.delete("/shot/:shot",async (req: Request, res: Response) => {
    let _shot = req.params.shot;
    for (let i = 0; i < stateData.sessionData.shots.length; i++){
        const shot = stateData.sessionData.shots[i];
        if(String(shot.idPacket.shotId) === _shot){
            stateData.sessionData.shots.splice(i,1);
            await saveData();
            sendText(res, "Deleted", 200);
            return;
        }
    }
    sendText(res, "Not found", 404);
})

app.get("/shot/:shot/recalculate",async (req: Request, res: Response) => {
    let _shot = req.params.shot;
    for (const shot of stateData.sessionData.shots) {
        if(String(shot.idPacket.shotId) === _shot){
            shot.score = calcScore(shot.p.x,shot.p.y, stateData.calibration);
            await saveData();
            sendJSON(res, shot, 200);
            return;
        }
    }
    sendText(res, "Not found", 404);
})

app.put("/client/:client/user", async (req: Request, res: Response) => {
    let body = req.body;
    let client = req.params.client;
    let newUserId = body.newUser;
    let from = body.from;

    if (!isFinite(Number(from)) || !isFinite(Number(newUserId))) {
        sendText(res, "Invalid values", 400);
        return;
    }

    let clientData = stateData.sessionData.clients[Number(client)];
    if (clientData) {
        clientData.users.push({from: Number(from), userId: Number(newUserId)});
        await saveData();
        sendJSON(res, clientData, 200);
    } else {
        sendText(res, "Client Not found", 404);
        return;
    }
});

app.get("/users",async (req: Request, res: Response) => {
    sendJSON(res, stateData.users, 200);
})

app.delete("/users",async (req: Request, res: Response) => {
    stateData.users = {};
    await saveData();
    sendText(res, "Users deleted", 200);
})

app.put("/users/:user", async (req: Request, res: Response) => {
    let name = req.body.name;
    let user = Number(req.params.user);
    if(!isFinite(user) || !name){
        sendText(res, "Invalid values", 400);
        return;
    }
    stateData.users[user] = name;
    await saveData();
    sendText(res, "User changed", 200);
})

app.delete("/users/:user", async (req: Request, res: Response) => {
    let user = Number(req.params.user);
    if(!isFinite(user)){
        sendText(res, "Invalid values", 400);
        return;
    }
    if(stateData.users[user]){
        delete stateData.users[user];
        await saveData();
        sendText(res, "User removed", 200);
    }else{
        sendText(res, "User not found", 404);
    }
})

app.delete("/server-data", async (req: Request, res: Response) => {
    stateData.users = {};
    await saveData();
    fs.readdirSync("data", {withFileTypes: true})
        .filter((file) => {
            return file.isFile() && file.name.endsWith(".json.gz");
        })
        .forEach((file) => {
            fs.unlinkSync("data/"+file.name)
        });
    stateData.currentSession = +new Date();
    stateData.sessionData = {shots: [], clients: {}, header:{ts:stateData.currentSession}};
    sendText(res, "Server reset", 200);
});

app.get("/camera-image", async (req: Request, res: Response) =>{
    try{
        let data = await fetch("http://192.168.4.1/capture");
        let buffer = await data.arrayBuffer();
        res.writeHead(200);
        res.write(Buffer.from(buffer));
        res.end();
    }catch {
        sendText(res, "Error", 500);
    }
})

app.get("/calibration", async (req: Request, res: Response) => {
    sendJSON(res,stateData.calibration, 200);
})

app.post("/calibration", async (req: Request, res: Response) => {
    let offsetX = Number(req.body.offsetX);
    let offsetY = Number(req.body.offsetY);
    let scale = Number(req.body.scale);
    let scoreMultiplier = Number(req.body.scoreMultiplier);
    let scorePostMultiplier = Number(req.body.scorePostMultiplier);

    if(!isFinite(offsetX) || !isFinite(offsetY) || !isFinite(scale) || !isFinite(scoreMultiplier) || !isFinite(scorePostMultiplier)){
        sendText(res, "Invalid values", 400);
        return;
    }
    stateData.calibration = {...stateData.calibration,offsetX,offsetY,scale, scorePostMultiplier, scoreMultiplier};
    await saveData();
    sendText(res, "Calibration updated", 200);
})

app.listen(port, () => {
    console.log(`Api listening on port ${port}`);
});

app.get("/clients/active", async (req: Request, res: Response) => {
    Object.keys(stateData.clients).forEach(client=>{
        let clientData = stateData.clients[client];
        let ts = +new Date();
        if(ts-clientData.lastPacket > 30*1000){
            delete stateData.clients[client];
        }
    })
    stateData.clients[123] = {lastPacket:+new Date()}
    sendJSON(res,stateData.clients, 200);
})

app.put("/client/:client", async (req: Request, res: Response) => {
    let client = req.params.client;

    if (!isFinite(Number(client))) {
        sendText(res, "Invalid client", 400);
        return;
    }

    let clientData = stateData.sessionData.clients[Number(client)];
    if(!clientData){
        stateData.sessionData.clients[Number(client)] = {users:[], id:Number(client)}
        await saveData();
        sendJSON(res, clientData, 200);
    }else{
        sendText(res, "Client already added", 400);
        return;
    }
})

app.delete("/client/:client", async (req: Request, res: Response) => {
    let client = req.params.client;

    if (!isFinite(Number(client))) {
        sendText(res, "Invalid client", 400);
        return;
    }

    delete stateData.sessionData.clients[Number(client)];
    for (let shotKey in stateData.sessionData.shots){
        let shot = stateData.sessionData.shots[shotKey];
        if(shot.idPacket.clientId === Number(client)){
            delete stateData.sessionData.shots[shotKey];
        }
    }

    await saveData();
    sendText(res, "Client deleted", 200);
})