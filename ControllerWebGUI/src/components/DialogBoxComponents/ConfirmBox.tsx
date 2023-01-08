import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function (
    {
        content,
        open,
        setOpen,
        title,
        onResult
    }: { content: string, open: boolean, setOpen: (v: boolean) => any, title: string, onResult: (v: boolean) => any }) {

    return (
        <div>
            <Dialog
                open={open}
                onClose={() => {
                    onResult(false);
                    setOpen(false);
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div style={{width: "min(600px, 50vw)"}}>
                    <DialogTitle id="alert-dialog-title">
                        {title}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {content}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            onResult(false);
                            setOpen(false);
                        }}>No</Button>
                        <Button onClick={() => {
                            onResult(true);
                            setOpen(false);
                        }} autoFocus>
                            Yes
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>
        </div>
    );
}