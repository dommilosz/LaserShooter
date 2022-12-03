import React, { useRef } from "react";
import { ShotData } from "../types";

export default function TargetVisualuser({
  shot,
  scale,
  dotSize,
}: {
  shot: ShotData;
  scale: number;
  dotSize: number;
}) {
  const canvasRef: React.LegacyRef<HTMLCanvasElement> = useRef(null);
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
        ctx.fillRect(
          shot.p.x * scale - dotSize / 2,
          shot.p.y * scale - dotSize / 2,
          dotSize,
          dotSize
        );
      };
    }
  }

  shot = shot ?? { p: { x: 0, y: 0 } };
  return (
    <div>
      {/* <p>Points: {shot.score}</p>
      <p>x: {shot.p.x}</p>
      <p>y: {shot.p.y}</p> */}
      <div style={{ width: w, height: h }}>
        <canvas ref={canvasRef} width={w} height={h} />
      </div>
    </div>
  );
}
