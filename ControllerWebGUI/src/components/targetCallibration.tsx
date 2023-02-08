import React, {useRef, useState} from "react";
import {ShotData} from "../types";
import {url} from "../api/backendApi";
import {drawImageOnCanvas, useWaitForCanvas} from "../api/hooks";
import {CircularProgress, LinearProgress, Typography} from "@mui/material";

export default function CalibrationTarget(
    {
        calibration, imageKey, opacity
    }: {
        calibration: { offsetX: number; offsetY: number; scale: number }
        imageKey: string, opacity: number
    }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [highlightedShot, setHighlightedShot] = useState<
        ShotData | undefined
    >(undefined);

    let scale = 10;
    let imgScale = calibration.scale * scale;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    let w = 160 * scale;
    let h = 120 * scale;

    let imgW = 160 * imgScale;
    let imgH = 120 * imgScale;

    let [loaded, setLoaded] = useState(0);

    useWaitForCanvas(ctx, async (ctx) => {
        ctx.globalAlpha = 1;
        await drawImageOnCanvas(ctx, url+"target-solid.png");

        if (loaded < 1)
            setLoaded(1);

        ctx.globalAlpha = opacity;
        await drawImageOnCanvas(ctx, url+"camera-image?key=" + imageKey);

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