import React from 'react';
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import {Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import ServerSetting from "../components/SettingItems/ServerSetting";

export default function ({open}: { open: boolean }) {
    return <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <ServerSetting></ServerSetting>
    </Modal>
}