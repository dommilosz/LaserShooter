import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useState} from "react";

export default function(
    {
        content,
        open,
        setOpen,
        title,
        onResult,
        fieldName
    }: { content: string, open: boolean, setOpen: (v: boolean) => any, title: string,onResult:(v:string|false)=>any, fieldName:string }) {

    let [text, setText] = useState("");

    return (
        <div>
            <Dialog open={open} onClose={()=>{
                onResult(false);
                setOpen(false);
            }}>
                <div style={{width:"min(600px, 50vw)"}}>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {content}
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label={fieldName}
                            fullWidth
                            variant="standard"
                            onChange={(e)=>setText(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>{
                            onResult(false);
                            setOpen(false);
                        }}>Cancel</Button>
                        <Button onClick={()=>{
                            onResult(text);
                            setOpen(false);
                        }}>OK</Button>
                    </DialogActions>
                </div>
            </Dialog>
        </div>
    );
}