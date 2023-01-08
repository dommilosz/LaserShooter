import React from "react";
import Paper from "@mui/material/Paper";

export default function ({children}:{children:any}){
    return <Paper style={{ display: "flex", width: "33%", minWidth:200, height:"100%"}}>
        {children}
    </Paper>
}