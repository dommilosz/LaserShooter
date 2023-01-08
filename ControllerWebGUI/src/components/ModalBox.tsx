import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import {Paper, SxProps, Theme} from "@mui/material";

const defaultStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function ModalBox({children, style, open, setOpen}:{children:JSX.Element, style?:SxProps<Theme>, open:boolean,setOpen:(v:boolean)=>any}) {
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Paper>
                    <Box sx={{...defaultStyle,...style}}>
                        {children}
                    </Box>
                </Paper>

            </Modal>
        </div>
    );
}