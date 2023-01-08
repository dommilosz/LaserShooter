import React, {useRef, useState} from "react";
import {ShotData} from "../types";
import {url} from "../api/backendApi";
import Tooltip from "@mui/material/Tooltip";
import {useNavigate} from "react-router-dom";

export default function CalibrationTarget(
    {
        offset, imageKey, opacity
    }: {
        offset: [number, number, number]
        imageKey: string, opacity:number
    }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [highlightedShot, setHighlightedShot] = useState<
        ShotData | undefined
    >(undefined);

    let scale = 10;
    let imgScale = offset[2] * (scale/100);

    const canvas = canvasRef.current;

    let w = 160 * scale;
    let h = 120 * scale;

    let imgW = 160 * imgScale;
    let imgH = 120 * imgScale;

    if (canvas !== null) {
        let _ctx = canvas.getContext("2d");
        if (_ctx !== null) {
            let ctx: CanvasRenderingContext2D = _ctx;
            ctx.imageSmoothingEnabled = false;
            let camera_image = new Image(w, h);
            camera_image.src = url + "camera-image?key=" + imageKey;
            let target_image = new Image(w, h);
            target_image.src = url + "target.png";

            const redraw = ()=>{
                ctx.clearRect(0, 0, w, h);

                ctx.globalAlpha = 1;
                ctx.drawImage(target_image, 0, 0, w, h);
                ctx.drawImage(target_image, 0, 0, w, h);
                ctx.drawImage(target_image, 0, 0, w, h);
                ctx.drawImage(target_image, 0, 0, w, h);
                ctx.drawImage(target_image, 0, 0, w, h);
                ctx.drawImage(target_image, 0, 0, w, h);
                ctx.drawImage(target_image, 0, 0, w, h);

                ctx.globalAlpha = opacity;
                ctx.drawImage(camera_image, offset[0]+(canvas.width/2-imgW/2), offset[1]+(canvas.height/2-imgH/2), imgW, imgH);
            }

            camera_image.onload = redraw;

            target_image.onload = redraw;
        }
    }

    return (
        <div style={{width: "100%", height: "100%"}}>
            <canvas
                style={{maxWidth: "100%", maxHeight: "100%"}}
                ref={canvasRef}
                width={w}
                height={h}
            />
        </div>
    );
}

export function ShotTooltip({
                                highlightedShot,
                                children,
                                interactive,
                            }: {
    highlightedShot: ShotData | undefined;
    children: any;
    interactive: boolean;
}) {
    const navigate = useNavigate();

    if (!interactive) return <>{children}</>;

    const content = (
        <div>
            <div>Score: {highlightedShot?.score}</div>
            <div>
                X: {highlightedShot?.p.x} Y: {highlightedShot?.p.x}
            </div>
        </div>
    );

    return (
        <div
            style={{
                cursor: highlightedShot !== undefined ? "pointer" : "crosshair",
                display: "flex",
                height: "100%",
                alignItems: "center",
                justifyContent: "center"
            }}
            onClick={() => {
                if (highlightedShot !== undefined)
                    navigate("/", {state: {selectShot: highlightedShot}});
            }}
        >
            <Tooltip
                open={highlightedShot !== undefined}
                title={highlightedShot !== undefined ? content : <></>}
                followCursor
                disableFocusListener={highlightedShot === undefined}
                disableHoverListener={highlightedShot === undefined}
                disableTouchListener={highlightedShot === undefined}
            >
                {children}
            </Tooltip>
        </div>
    );
}
