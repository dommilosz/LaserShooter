import React from 'react';
import Modal from "@mui/material/Modal";
import ServerSetting from "../components/SettingItems/ServerSetting";
import Paper from "@mui/material/Paper";

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
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    minWidth:250,
};

export default function ({open}: { open: boolean }) {
    return <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Paper sx={style}>
            <div className={"settings-text2"}>Please connect to server to continue</div>
            <ServerSetting></ServerSetting>
        </Paper>
    </Modal>
}