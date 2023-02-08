import React, {useContext, useRef, useState} from "react";
import {ShotData} from "../types";
import {url} from "../api/backendApi";
import Tooltip from "@mui/material/Tooltip";
import {useNavigate} from "react-router-dom";
import {sessionContext} from "../App";

let target_image: HTMLImageElement | undefined = undefined;
let target_image_loaded = false;

export function scalePoint(point: [number, number], scaleFactor: number, canvasSize: [number, number]) {
    const centerX = canvasSize[0] / 2;
    const centerY = canvasSize[1] / 2;

    // Translate point by negative of center
    const translatedX = point[0] - centerX;
    const translatedY = point[1] - centerY;

    // Scale point
    const scaledX = translatedX * scaleFactor;
    const scaledY = translatedY * scaleFactor;

    // Translate point back by center
    return [scaledX + centerX, scaledY + centerY];
}


export default function TargetVisualiser(
    {
        primaryShots,
        primaryColor,
        secondaryShots,
        secondaryColor,
        interactive,
        dotSizeScale,
        calibrationDisabled
    }: {
        primaryShots: ShotData[];
        primaryColor?: string;
        secondaryShots: ShotData[];
        secondaryColor?: string;
        interactive?: boolean;
        dotSizeScale?: number;
        calibrationDisabled?: boolean;
    }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [highlightedShot, setHighlightedShot] = useState<
        ShotData | undefined
    >(undefined);
    let {localCalibration} = useContext(sessionContext);
    if (calibrationDisabled) {
        localCalibration = {offsetX: 0, scale: 100, offsetY: 0, scoreMultiplier: 10, scorePostMultiplier: 10};
    }

    let scale = 10;
    let pscale = localCalibration.scale / 100 * scale;
    const canvas = canvasRef.current;

    let w = 160 * scale;
    let h = 120 * scale;

    if (!dotSizeScale) dotSizeScale = 1;
    if (!primaryColor) primaryColor = "red";
    if (!secondaryColor) secondaryColor = "black";

    if (canvas !== null) {
        let _ctx = canvas.getContext("2d");
        if (_ctx !== null) {
            let ctx: CanvasRenderingContext2D = _ctx;
            ctx.imageSmoothingEnabled = false;
            if (!target_image || target_image.width !== w || target_image.height !== h) {
                target_image = new Image(w, h);
                target_image.src = url + "target-solid.png";
                target_image_loaded = false;
                target_image.onload = () => target_image_loaded = true;
            }

            const drawShot = (_shot: ShotData, dotSize: number) => {
                if (!_shot) return;
                let [sX, sY] = scalePoint([_shot.p.x * scale, _shot.p.y * scale], pscale / 10, [w, h]);
                sX += localCalibration.offsetX;
                sY += localCalibration.offsetY;

                ctx.beginPath();
                ctx.arc(
                    sX, sY,
                    dotSize / 2,
                    0,
                    2 * Math.PI
                );
                ctx.fill();
            };

            if (target_image_loaded) {
                ctx.clearRect(0, 0, w, h);
                ctx.drawImage(target_image, 0, 0, w, h);

                let dotSize = scale * dotSizeScale!;
                ctx.fillStyle = secondaryColor!;
                for (let _shot of secondaryShots) {
                    drawShot(_shot, dotSize);
                }

                dotSize = scale * 2 * dotSizeScale!;
                ctx.fillStyle = primaryColor!;
                for (let _shot of primaryShots) {
                    drawShot(_shot, dotSize);
                }
            }
        }
    }

    return (
        <div style={{width: "100%", height: "100%"}}>
            <ShotTooltip
                highlightedShot={highlightedShot}
                interactive={interactive}
            >
                <canvas
                    style={{maxWidth: "100%", maxHeight: "100%"}}
                    ref={canvasRef}
                    width={w}
                    height={h}
                    onMouseMove={(event) => {
                        if (!canvas) return;
                        let rect = canvas!.getBoundingClientRect(), // abs. size of element
                            scaleX = canvas!.width / rect.width, // relationship bitmap vs. element for x
                            scaleY = canvas!.height / rect.height; // relationship bitmap vs. element for y
                        let x = (event.clientX - rect.left) * scaleX;
                        let y = (event.clientY - rect.top) * scaleY;

                        let minDistance = -1;
                        let minDistanceShot = undefined;
                        const checkShot = (_shot: ShotData) => {
                            if (!_shot || !_shot.p) return;
                            let [sX, sY] = scalePoint([_shot.p.x * scale, _shot.p.y * scale], pscale / 10, [w, h]);
                            sX += localCalibration.offsetX;
                            sY += localCalibration.offsetY;
                            let distance = Math.sqrt(
                                (x - sX) ** 2 + (y - sY) ** 2
                            );

                            if (minDistance < 0 || minDistance > distance) {
                                minDistance = distance;
                                minDistanceShot = _shot;
                            }
                        };


                        for (let _shot of primaryShots) {
                            checkShot(_shot);
                        }
                        if (minDistance > 10) minDistanceShot = undefined;

                        if (minDistanceShot === undefined)
                            for (let _shot of secondaryShots) {
                                checkShot(_shot);
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

export function ShotTooltip(
    {
        highlightedShot,
        children,
        interactive,
    }: {
        highlightedShot: ShotData | undefined;
        children: any;
        interactive?: boolean|undefined;
    }) {
    const navigate = useNavigate();

    if (interactive===false) return <>{children}</>;

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
