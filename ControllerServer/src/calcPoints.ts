import {PNG} from "pngjs";
import * as fs from "fs";
import {config} from "./index";
import {CalibrationType} from "./types";
import {ReadableStream, WritableStream} from "stream/web";
import {PassThrough} from "stream";

let parsedBitmap: PNG | undefined = undefined;
export let solidBitmap: Buffer | undefined = undefined;

fs.createReadStream("./target.png")
    .pipe(
        new PNG({
            filterType: 4,
        })
    )
    .on("parsed", async function () {
        let png = this;
        if (png.width !== config.target.width || png.height !== config.target.height) {
            console.log(`Warning: target.png wrong size (should be: ${config.target.width}x${config.target.height}). Found ${png.width}x${png.height} instead`)
        } else {
            parsedBitmap = png;
            return;
        }

        let ratioW = png.width / config.target.width;
        let ratioH = png.height / config.target.height;

        if (ratioW === ratioH && Math.floor(ratioW) === ratioW) {
            console.log(`Bitmap will be downscaled: ${ratioH} times`);
            parsedBitmap = png;
        } else {
            console.error("Bitmap cannot be resized to fit");
        }

        let solidPng = new PNG({width:png.width, height:png.height, inputHasAlpha:true});
        solidPng.data = Buffer.from(png.data.map((d,i)=>{
            if(i%4 === 3 && d > 0){
                return 255;
            }
            return d;
        }));

        let stream = new PassThrough();
        solidPng.pack().pipe<any>(stream);
        const chunks = []
        for await (let chunk of stream) {
            chunks.push(chunk)
        }
        solidBitmap = (Buffer.concat(chunks))


        console.log("Bitmap parsed!");
    });

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

export function calcPoints(x: number, y: number, calibration: CalibrationType) {
    if (parsedBitmap === undefined) return -1;
    let ratio = parsedBitmap.width / config.target.width;
    let scale = calibration.scale / 100;

    [x,y] = scalePoint([x*ratio,y*ratio], scale, [parsedBitmap.width,parsedBitmap.height])
    x += calibration.offsetX;
    y += calibration.offsetY;
    x = Math.round(x);
    y = Math.round(y);

    let idx = (parsedBitmap.width * (y) + (x)) << 2;
    if (idx < 0) return 0;
    return parsedBitmap.data[idx + 3];
}