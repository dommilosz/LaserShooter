import {SessionData, Users} from "../types";
import {resolveClientUser} from "./resolveClientUser";

function median(values:number[]){
    if(values.length ===0) return 0;

    values.sort(function(a,b){
        return a-b;
    });

    let half = Math.floor(values.length / 2);

    if (values.length % 2)
        return values[half];

    return (values[half - 1] + values[half]) / 2.0;
}

export function userStats(userId:number, sessionData:SessionData){
    let usersShots = sessionData.shots.filter((shot)=>{
        let shotUser = resolveClientUser(sessionData,shot.idPacket.clientId,shot.ts);
        return shotUser == userId;
    })
    let totalScore = usersShots.reduce((p,c)=>{
       return c.score + p;
    },0)
    let shotScores = usersShots.reduce<number[]>((p,c)=>{
       p.push(c.score);
       return p;
    },[])

    return {
        shots:usersShots.length,
        totalScore,
        avgScore: Math.round(totalScore/usersShots.length*10)/10,
        medianScore: Math.round(median(shotScores)*10)/10,
    }
}

export function calcUserPlace(userId:number, sessionData:SessionData,users:Users):{shots: number, totalScore: number, avgScore: number, medianScore: number}{
    let currStats = userStats(userId, sessionData);
    let allUserStats:any = {};
    for (let usersKey in users) {
        let stats = userStats(Number(usersKey),sessionData);
        Object.keys(stats).forEach((statsKey:any) => {
            if(!allUserStats[statsKey]){
                allUserStats[statsKey] = [];
            }
            if(stats.shots > 0){
                // @ts-ignore
                allUserStats[statsKey].push(stats[statsKey]);
            }
        })
    }
    for (let allUserStatsKey in allUserStats) {
        allUserStats[allUserStatsKey] = allUserStats[allUserStatsKey].sort((a:number, b:number) => (a > b ? -1 : 1))
        console.log(allUserStats[allUserStatsKey])
        // @ts-ignore
        allUserStats[allUserStatsKey] = allUserStats[allUserStatsKey].indexOf(currStats[allUserStatsKey])+1;
    }
    return allUserStats;
}