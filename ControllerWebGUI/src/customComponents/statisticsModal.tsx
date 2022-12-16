import React, {useContext} from 'react';
import Modal from "@mui/material/Modal";
import ServerSetting from "../components/SettingItems/ServerSetting";
import Paper from "@mui/material/Paper";
import {Card, Typography} from "@mui/material";
import {sessionContext} from "../App";
import {calcUserPlace, userStats} from "../api/calculateStatistics";
import "./statisticsModal.css"

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40vw',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: 250,
};

export default function ({open, userId,close}: { open: boolean, userId: number,close:any }) {
    let {sessionData, users, sessionInfo} = useContext(sessionContext);
    let stats = userStats(userId,sessionData);
    let places = calcUserPlace(userId,sessionData,users);

    return <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClose={close}
    >
        <Paper sx={style}>
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
                Cannot calculate statistics for this user (user have to shot at least once)
                </Typography>)}
        </Paper>
    </Modal>
}