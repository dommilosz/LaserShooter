import {PNG} from "pngjs";
import * as fs from "fs";
import {config} from "./index";

let parsedBitmap:Uint8Array|undefined = undefined;

fs.createReadStream("./target.png")
    .pipe(
        new PNG({
            filterType: 4,
        })
    )
    .on("parsed", function () {
        let png = this;
        console.log("Bitmap parsed!");
        if(png.width !== config.target.width || png.height !== config.target.height){
            console.log(`Warning: target.png wrong size (should be: ${config.target.width}x${config.target.height}). Found ${png.width}x${png.height} instead`)
        }else{
            parsedBitmap = png.data;
            return;
        }

        let ratioW = png.width / config.target.width;
        let ratioH = png.height / config.target.height;

        if(ratioW === ratioH && Math.floor(ratioW)===ratioW){
            console.log(`Bitmap can be downscaled: Downscaling found bitmap: ${ratioH} times`);
            parsedBitmap = png.data.filter((p,i)=>{
                let idx = i >> 2;
                return idx % ratioW === 0;
            }).filter((p,i)=>{
                let idx = i >> 2;
                return idx % png.width < config.target.width;
            })
            png.data = Buffer.from(parsedBitmap);
            png.width = config.target.width;
            png.height = config.target.height;
        }
    });

export function calcPoints(x:number,y:number){
    if(parsedBitmap === undefined)return -1;
    let idx = (config.target.width * y + x) << 2;
    return parsedBitmap[idx+3];
}