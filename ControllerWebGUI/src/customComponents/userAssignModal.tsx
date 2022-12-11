import React, {useRef, useState} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import 'reactjs-popup/dist/index.css';
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import {Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export function UserAssignModal(
    {
        elements,
        callback,
        open,
        setOpen
    }: { elements: { name: string, value: string }[], callback: (value: string) => any, open: boolean, setOpen: any }) {
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [selectedUser, setSelectedUser] = useState("");

    return (<Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Paper sx={style}>
                <div className={"settings-text2"}>Select user to assign with this client</div>
                <FormControl variant="standard" sx={{m: 1, minWidth: "100%"}}>
                    <InputLabel id="user-select-label">User</InputLabel>
                    <Select
                        labelId="user-select-label"
                        label={"User"}
                        onChange={(e) => {
                            {
                                setSelectedUser(String(e.target.value));
                            }
                        }}
                    >
                        {elements.map(el => {
                            return <MenuItem value={el.value}>{el.name}</MenuItem>
                        })}
                    </Select>
                </FormControl>
                <Button variant="contained" color="success"
                        className="button" style={{margin: 5}}
                        onClick={() => {
                            console.log('modal closed ');
                            callback(selectedUser)
                            setOpen(false);
                        }}
                >
                    Save
                </Button>
                <Button variant="contained" color="error"
                        className="button" style={{margin: 5}}
                        onClick={() => {
                            console.log('modal closed ');
                            setOpen(false);
                        }}
                >
                    Cancel
                </Button>
            </Paper>
        </Modal>
    );
}