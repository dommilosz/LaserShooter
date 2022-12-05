import React, {ReactNode, useRef} from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import "./userAssignModal.css"

export function UserAssignModal({elements, title, callback,trigger}: { elements: { name: string, value: string }[], title: string, callback:(value:string)=>any,trigger:any }) {
    let selectRef = useRef(null);

    function PopupContent(close: any) {
        return (<div className="modal">
            <button className="close" onClick={close}>
                &times;
            </button>
            <div className="header">{title}</div>
            <div className="content">
                <select ref={selectRef}>
                    {elements.map(el=>{
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

