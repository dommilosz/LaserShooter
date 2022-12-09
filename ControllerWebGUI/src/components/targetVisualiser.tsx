import React, {useContext, useRef, useState} from "react";
import {ShotData} from "../types";
import {useAppSize} from "../api/hooks";
import {url} from "../api/backendApi";
import Tooltip from "@mui/material/Tooltip";
import {sessionContext} from "../App";
import { useNavigate } from 'react-router-dom';

export default function TargetVisualuser({
                                             primaryShots,
                                             primaryColor,
                                             secondaryShots,
                                             secondaryColor,
                                         }: {
    primaryShots: ShotData[];
    primaryColor: string;
    secondaryShots: ShotData[];
    secondaryColor: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [highlightedShot, setHighlightedShot] = useState<ShotData | undefined>(undefined);

    let scale = 10;
    const canvas = canvasRef.current;

    let w = 160 * scale;
    let h = 120 * scale;

    if (canvas !== null) {
        let _ctx = canvas.getContext("2d");
        if (_ctx !== null) {
            let ctx: CanvasRenderingContext2D = _ctx;
            ctx.imageSmoothingEnabled = false;
            let img = new Image(w, h);
            img.src = url + "target.png";
            img.onload = function () {
                ctx.clearRect(0, 0, w, h);
                ctx.drawImage(img, 0, 0, w, h); // Or at whatever offset you like
                ctx.drawImage(img, 0, 0, w, h); // Or at whatever offset you like
                ctx.drawImage(img, 0, 0, w, h); // Or at whatever offset you like
                ctx.drawImage(img, 0, 0, w, h); // Or at whatever offset you like
                ctx.drawImage(img, 0, 0, w, h); // Or at whatever offset you like
                ctx.drawImage(img, 0, 0, w, h); // Or at whatever offset you like
                ctx.drawImage(img, 0, 0, w, h); // Or at whatever offset you like

                let dotSize = scale;
                ctx.fillStyle = secondaryColor;
                for (let _shot of secondaryShots) {
                    ctx.beginPath();
                    ctx.arc(
                        _shot.p.x * scale,
                        _shot.p.y * scale,
                        dotSize / 2,
                        0,
                        2 * Math.PI
                    );
                    ctx.fill();
                }

                dotSize = scale * 2;
                ctx.fillStyle = primaryColor;
                for (let _shot of primaryShots) {
                    ctx.beginPath();
                    ctx.arc(
                        _shot.p.x * scale,
                        _shot.p.y * scale,
                        dotSize / 2,
                        0,
                        2 * Math.PI
                    );
                    ctx.fill();
                }
            };
        }
    }

    return (
        <div style={{width: "100%", height: "100%"}}>
            <ShotTooltip highlightedShot={highlightedShot}>
                <canvas
                    style={{maxWidth: "100%", maxHeight: "100%"}}
                    ref={canvasRef}
                    width={w}
                    height={h}
                    onMouseMove={(event) => {
                        let rect = canvas!.getBoundingClientRect(), // abs. size of element
                            scaleX = canvas!.width / rect.width,    // relationship bitmap vs. element for x
                            scaleY = canvas!.height / rect.height;  // relationship bitmap vs. element for y
                        let x = (event.clientX - rect.left) * scaleX;
                        let y = (event.clientY - rect.top) * scaleY;

                        let minDistance = -1;
                        let minDistanceShot = undefined;
                        for (let _shot of primaryShots) {
                            let sx = _shot.p.x * scale;
                            let sy = _shot.p.y * scale;
                            let distance = Math.sqrt((x - sx) ** 2 + (y - sy) ** 2);

                            if (minDistance < 0 || minDistance > distance) {
                                minDistance = distance;
                                minDistanceShot = _shot;
                            }
                        }
                        if (minDistance > 10) minDistanceShot = undefined;

                        if (minDistanceShot === undefined)
                            for (let _shot of secondaryShots) {
                                let sx = _shot.p.x * scale;
                                let sy = _shot.p.y * scale;
                                let distance = Math.sqrt((x - sx) ** 2 + (y - sy) ** 2);

                                if (minDistance < 0 || minDistance > distance) {
                                    minDistance = distance;
                                    minDistanceShot = _shot;
                                }
                            }

                        if (minDistance > 10) minDistanceShot = undefined;
                        if (highlightedShot === minDistanceShot) return;

                        setHighlightedShot(minDistanceShot);
                    }}
                />
            </ShotTooltip>
        </div>
    );
}

export function ShotTooltip({highlightedShot, children}: { highlightedShot: ShotData | undefined, children: any }) {
    let { sessionInfo, sessionData, users } = useContext(sessionContext);
    const navigate = useNavigate();

    const content = <div>
        <div>{highlightedShot?.idPacket.shotId}</div>
        <div>Score: {highlightedShot?.score}</div>
        <div>X: {highlightedShot?.p.x} Y: {highlightedShot?.p.x}</div>
    </div>

    return <div
        style={{cursor: highlightedShot !== undefined ? "pointer" : "",display:"flex",height:"100%",alignItems:"center"}}
        onClick={()=>{
            navigate("/",{state:{selectShot:highlightedShot}})
        }}
    ><Tooltip
        open={highlightedShot !== undefined}
        title={highlightedShot !== undefined ? content : <></>}
        followCursor
        disableFocusListener={highlightedShot === undefined}
        disableHoverListener={highlightedShot === undefined}
        disableTouchListener={highlightedShot === undefined}
    >
        {children}
    </Tooltip></div>
}