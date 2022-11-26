import {PNG} from "pngjs";
import * as fs from "fs";

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
    });

export function calcPoints(x:number,y:number){
    if(parsedBitmap === undefined)return -1;
    let idx = (parsedBitmap.width * y + x) << 2;
    return parsedBitmap.data[idx+3];
}