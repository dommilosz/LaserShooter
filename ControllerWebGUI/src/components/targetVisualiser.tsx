import React, {useRef} from "react";
import {ShotData} from "../types";
import {useAppSize} from "../api/hooks";

export default function TargetVisualuser(
    {
        shot,
        dotColor,
        shots,
        secondaryColor,
    }: { shot: ShotData, dotColor: string, shots: ShotData[],secondaryColor:string }) {
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
            img.src = "http://localhost:8008/target.png";
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
                for (let _shot of shots) {
                    ctx.beginPath();
                    ctx.arc(_shot.p.x * scale, _shot.p.y * scale, dotSize / 2, 0, 2 * Math.PI);
                    ctx.fill();
                }

                ctx.fillStyle = dotColor;
                dotSize = scale * 2;
                ctx.beginPath();
                ctx.arc(shot.p.x * scale, shot.p.y * scale, dotSize / 2, 0, 2 * Math.PI);
                ctx.fill();
            };
        }
    }

    shot = shot ?? {p: {x: 0, y: 0}};
    return (
        <div style={{width: "100%", height: "100%"}}>
            {/* <p>Points: {shot.score}</p>
      <p>x: {shot.p.x}</p>
      <p>y: {shot.p.y}</p> */}
            <canvas style={{maxWidth: "100%", maxHeight: "100%"}} ref={canvasRef} width={w} height={h}/>
        </div>
    );
}
