export type ShotData = {
  pktype: 0;
  ts: number;
  idPacket: {
    clientId: number;
    shotId: number;
  };
  w: number;
  h: number;
  score: number;
  p: {
    x: number;
    y: number;
    R: number;
    G: number;
    B: number;
  };
  session: number;
};

export type ClientData = {
  id:number,
  users:{from:number,userId:number}[]
}

export type SessionData = {
  shots: ShotData[];
  clients: { [key: number]: ClientData };
};

export type SessionInfo = { lastKA: number; session: number; shots: number,changeIndex:number,lastFetch:number }

export type Users = {
  [key:number]:string
}

export type Session = {
  sessionData:SessionData,
  sessionInfo:SessionInfo,
  users:Users,
}

export type CalibrationType = { offsetX: number; offsetY: number; scale: number, scoreMultiplier:number, scorePostMultiplier:number }

export type SessionContext = {
  sessionData:SessionData,
  sessionInfo:SessionInfo,
  users:Users,
  sessions:{name:string, shots:number}[],
  updateSessions:()=>any,
  localCalibration:CalibrationType,
  setLocalCalibration:(v:CalibrationType)=>any
}