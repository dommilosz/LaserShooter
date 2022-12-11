import React from "react";

export default function ({children}:{children:any}){
    return <div style={{ display: "flex", width: "33%", minWidth:200 }}>
        {children}
    </div>
}