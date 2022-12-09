import React, {ReactNode, useRef} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import "./userAssignModal.css"

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

export function UserAssignModal({
                                    elements,
                                    title,
                                    callback,
                                    open,
                                    setOpen
                                }: { elements: { name: string, value: string }[], title: string, callback: (value: string) => any, open: boolean, setOpen: any }) {
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    let selectRef = useRef(null);

    return (<Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <select ref={selectRef}>
                    {elements.map(el => {
                        return <option value={el.value}>{el.name}</option>
                    })}
                </select>
                <button
                    className="button"
                    onClick={() => {
                        console.log('modal closed ');
                        // @ts-ignore
                        callback(selectRef.current.value)
                        setOpen(false);
                    }}
                >
                    Save
                </button>
                <button
                    className="button"
                    onClick={() => {
                        console.log('modal closed ');
                        setOpen(false);
                    }}
                >
                    Cancel
                </button>
            </Box>
        </Modal>
    );
}

export function UserAssignModal2({
                                     elements,
                                     title,
                                     callback,
                                     trigger
                                 }: { elements: { name: string, value: string }[], title: string, callback: (value: string) => any, trigger: any }) {
    let selectRef = useRef(null);

    function PopupContent(close: any) {
        return (<div className="modal">
            <button className="close" onClick={close}>
                &times;
            </button>
            <div className="header">{title}</div>
            <div className="content">
                <select ref={selectRef}>
                    {elements.map(el => {
                        return <option value={el.value}>{el.name}</option>
                    })}
                </select>
            </div>
            <div className="actions">
                <button
                    className="button"
                    onClick={() => {
                        console.log('modal closed ');
                        // @ts-ignore
                        callback(selectRef.current.value)
                        close();
                    }}
                >
                    Save
                </button>
                <button
                    className="button"
                    onClick={() => {
                        console.log('modal closed ');
                        close();
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>)
    }

    // @ts-ignore
    return <Popup trigger={trigger} modal nested>{PopupContent}</Popup>;
}

