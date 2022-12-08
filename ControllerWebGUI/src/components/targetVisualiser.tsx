import React, { useRef } from "react";
import { ShotData } from "../types";
import { useAppSize } from "../api/hooks";
import { url } from "../api/backendApi";

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

                dotSize = scale*2;
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
        <div style={{ width: "100%", height: "100%" }}>
            <canvas
                style={{ maxWidth: "100%", maxHeight: "100%" }}
                ref={canvasRef}
                width={w}
                height={h}
            />
        </div>
    );
}
