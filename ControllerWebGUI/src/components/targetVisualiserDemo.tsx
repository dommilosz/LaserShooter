import {ShotData} from "../types";
import TargetVisualiser from "./targetVisualiser";

const _exampleShots = [
    {"p": {"x": 78, "y": 47}},
    {"p": {"x": 90, "y": 62}},
    {"p": {"x": 110, "y": 34}},
    {"p": {"x": 97, "y": 91}},
    {"p": {"x": 35, "y": 58}},
    {"p": {"x": 44, "y": 77}},
    {"p": {"x": 67, "y": 33}},
    {"p": {"x": 125, "y": 53}},
    {"p": {"x": 53, "y": 86}},
    {"p": {"x": 87, "y": 45}}
];

// @ts-ignore
const exampleShots: ShotData[] = _exampleShots;

export default function TargetVisualiserDemo({showAllShots}: { showAllShots: boolean }) {
    return <TargetVisualiser primaryShots={[exampleShots[0]]} secondaryShots={showAllShots ? exampleShots : []}
                             calibrationDisabled
                             interactive={false} dotSizeScale={3}></TargetVisualiser>
}

export function Target() {
    return <TargetVisualiser primaryShots={[]} secondaryShots={[]}
                             interactive={false} dotSizeScale={3}></TargetVisualiser>
}