import React from "react";

export default function ({children,empty}:{children:any,empty:boolean}){
    if(empty){
        return <div className="object-container">
            Session is empty. Shot some shots or load previous session to begin.
        </div>
    }
    return <div className="object-container">
        {children}
    </div>
}