import React, {useRef, useState} from "react";
import {url} from "../api/backendApi";
import {drawImageOnCanvas, useWaitForCanvas} from "../api/hooks";
import {CircularProgress, Typography} from "@mui/material";
import {CalibrationType} from "../types";

export default function CalibrationTarget(
    {
        imageKey, opacity, calibration
    }: {
        imageKey: string, opacity: number, calibration:CalibrationType
    }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    let scale = 10;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    let w = 160 * scale;
    let h = 120 * scale;
    let imgScale = calibration.scale * scale /100;
    let imgW = 160 * imgScale;
    let imgH = 120 * imgScale;

    let [loaded, setLoaded] = useState(0);

    useWaitForCanvas(ctx, async (ctx) => {
        ctx.globalAlpha = 1;
        await drawImageOnCanvas(ctx, url+"target-solid.png",false);

        if (loaded < 1)
            setLoaded(1);

        ctx.globalAlpha = opacity;

        let camX = calibration.offsetX + (ctx.canvas.width / 2 - imgW / 2);
        let camY = calibration.offsetY + (ctx.canvas.height / 2 - imgH / 2)

        await drawImageOnCanvas(ctx, url+"camera-image?key=" + imageKey, false, camX, camY, imgW, imgH);

        if (loaded < 2)
            setLoaded(2);
    })

    return (
        <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <canvas
                style={{maxWidth: "100%", maxHeight: "100%", display:loaded<2?"none":""}}
                ref={canvasRef}
                width={w}
                height={h}
            />
            {loaded<2 ? <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}><CircularProgress/><Typography>Not loading? Check connection with {loaded == 0?"server":"target"}</Typography></div> : <></>}
        </div>
    );
}