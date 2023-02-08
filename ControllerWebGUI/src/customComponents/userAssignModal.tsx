import React, {useState} from 'react';
import 'reactjs-popup/dist/index.css';
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import {Select, Typography} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import ModalBox from "../components/ModalBox";

export function UserAssignModal(
    {
        elements,
        callback,
        open,
        setOpen
    }: { elements: { name: string, value: string }[], callback: (value: string) => any, open: boolean, setOpen: any }) {
    const [selectedUser, setSelectedUser] = useState("");

    return (<ModalBox
            open={open}
            setOpen={setOpen}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <div>
                <Typography>Select user to assign with this client</Typography>
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
                        {elements.map((el, i) => {
                            return <MenuItem value={el.value} key={i}>{el.name}</MenuItem>
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
            </div>
        </ModalBox>
    );
}