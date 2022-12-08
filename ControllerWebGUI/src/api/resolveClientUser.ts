import { SessionData, Users } from "../types";

export function resolveClientUser(sessionData:SessionData,clientId:number,ts?:number){
    if(ts===undefined){
        return sessionData.clients[clientId].users[sessionData.clients[clientId].users.length-1].userId;
    }

    let clientUserId = -1;
    for (
        let i = 0;
        i < sessionData.clients[clientId].users.length;
        i++
    ) {
        const user = sessionData.clients[clientId].users[i];
        const nextUser =
            sessionData.clients[clientId].users[i + 1];
        if (ts >= user.from && (!nextUser || ts < nextUser.from))
        clientUserId = user.userId;
    }
    return clientUserId;
}

export function resolveClientUserName(sessionData:SessionData,clientId:number,users:Users,ts?:number){
   let userId = resolveClientUser(sessionData,clientId,ts);
   return users[userId]??clientId; 
}