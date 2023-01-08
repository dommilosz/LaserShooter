import React, {useContext} from 'react';
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import {Card, Typography} from "@mui/material";
import {sessionContext} from "../App";
import {calcUserPlace, userStats} from "../api/calculateStatistics";
import "./statisticsModal.css"
import ModalBox from "../components/ModalBox";

export default function ({open, userId,setOpen}: { open: boolean, userId: number,setOpen:(v:boolean)=>any }) {
    let {sessionData, users, sessionInfo} = useContext(sessionContext);
    let stats = userStats(userId,sessionData);
    let places = calcUserPlace(userId,sessionData,users);

    return <ModalBox
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        setOpen={setOpen}
    >
        {stats.shots>0?(<><Card className={"statistics-card"}>
            Shot amount: {stats.shots} (#{places.shots})
        </Card>
            <Card className={"statistics-card"}>
                Total score: {stats.totalScore} (#{places.totalScore})
            </Card>
            <Card className={"statistics-card"}>
                Average score: {stats.avgScore} (#{places.avgScore})
            </Card>
            <Card className={"statistics-card"}>
                Median score: {stats.medianScore} (#{places.medianScore})
            </Card></>):(<Typography>
            Cannot calculate statistics for this user (No shots available from this user)
        </Typography>)}
    </ModalBox>
}