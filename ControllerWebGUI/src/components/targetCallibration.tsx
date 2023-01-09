import React, {useRef, useState} from "react";
import {ShotData} from "../types";
import {url} from "../api/backendApi";
import Tooltip from "@mui/material/Tooltip";
import {useNavigate} from "react-router-dom";

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
            target_image.src = url + "target-solid.png";

            const redraw = () => {
                ctx.clearRect(0, 0, w, h);

                ctx.globalAlpha = 1;
                for (let i = 0; i < 50; i++)
                    ctx.drawImage(target_image, 0, 0, w, h);

                ctx.globalAlpha = opacity;
                ctx.drawImage(camera_image, calibration.offsetX + (canvas.width / 2 - imgW / 2), calibration.offsetY + (canvas.height / 2 - imgH / 2), imgW, imgH);
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