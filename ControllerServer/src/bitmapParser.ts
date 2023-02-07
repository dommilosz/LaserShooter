import {PNG} from "pngjs";
import * as fs from "fs";
import {config} from "./index";
import {BitmapData, CalibrationType} from "./types";
import zlib from "zlib";
import {PassThrough} from "stream";

export let originalBitmap: BitmapData | undefined = undefined;
export let solidBitmap: BitmapData | undefined = undefined;

export async function readPNG(path: string): Promise<BitmapData> {
    return await new Promise<BitmapData>((r, j) => {
        fs.createReadStream(path)
            .pipe(
                new PNG({
                    filterType: 4,
                })
            )
            .on("parsed", async function () {
                let png = this;
                r(png);
            });
    })
}

export async function PNGtoBuffer(inputPng: PNG) {
    let stream = new PassThrough();
    inputPng.pack().pipe<any>(stream);
    const chunks = []
    for await (let chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
}

export async function parseBitmap(bitmap: BitmapData): Promise<BitmapData> {
    if (bitmap.width !== config.target.width || bitmap.height !== config.target.height) {
        console.log(`Warning: target.png wrong size (should be: ${config.target.width}x${config.target.height}). Found ${bitmap.width}x${bitmap.height} instead`)
        let ratioW = bitmap.width / config.target.width;
        let ratioH = bitmap.height / config.target.height;

        if (ratioW === ratioH && Math.floor(ratioW) === ratioW) {
            console.log(`Bitmap will be downscaled: ${ratioH} times`);
        } else {
            console.error("Bitmap cannot be resized to fit");
        }
    }

    let solidBitmap = new PNG({width: bitmap.width, height: bitmap.height, inputHasAlpha: true});
    solidBitmap.data = Buffer.from(bitmap.data.map((d, i) => {
        if (i % 4 === 3 && d > 0) {
            return 255;
        }
        return d;
    }));

    return solidBitmap;
}

export async function parser() {
    originalBitmap = await readPNG("./target.png");
    solidBitmap = await parseBitmap(originalBitmap);

    originalBitmap.buffer = await PNGtoBuffer(originalBitmap);
    solidBitmap.buffer = await PNGtoBuffer(solidBitmap);

    solidBitmap.gz = zlib.gzipSync(solidBitmap.buffer);
    originalBitmap.gz = zlib.gzipSync(originalBitmap.buffer);

    console.log("Bitmap parsed!");
}

parser();

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

export function calcScore(x: number, y: number, calibration: CalibrationType) {
    if (originalBitmap === undefined) return -1;
    let ratio = originalBitmap.width / config.target.width;
    let scale = calibration.scale / 100;

    [x, y] = scalePoint([x * ratio, y * ratio], scale, [originalBitmap.width, originalBitmap.height])
    x += calibration.offsetX;
    y += calibration.offsetY;
    x = Math.round(x);
    y = Math.round(y);

    let idx = (originalBitmap.width * (y) + (x)) << 2;
    if (idx < 0) return 0;

    return Math.round((originalBitmap.data[idx + 3] / 255)*(calibration.scoreMultiplier??10))*(calibration.scorePostMultiplier??10);
}