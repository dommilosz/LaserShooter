import {PNG} from "pngjs";
import * as fs from "fs";
import {config} from "./index";

let parsedBitmap:undefined|PNG=undefined;

fs.createReadStream("./target.png")
    .pipe(
        new PNG({
            filterType: 4,
        })
    )
    .on("parsed", function () {
        parsedBitmap = this;
        console.log("Bitmap parsed!");
        if(parsedBitmap.width !== config.target.width || parsedBitmap.height !== config.target.height){
            console.log(`Warning: target.png wrong size (should be: ${config.target.width}x${config.target.height}). Found ${parsedBitmap.width}x${parsedBitmap.height} instead`)
        }
    });

export function calcPoints(x:number,y:number){
    if(parsedBitmap === undefined)return -1;
    let idx = (parsedBitmap.width * x + y) << 2;
    return parsedBitmap.data[idx+3];
}