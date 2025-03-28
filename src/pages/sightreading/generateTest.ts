import { InstrumentNote } from "../../util/midi";
import { TestConfig } from "./types";


export function generateTest(testConfig:TestConfig):InstrumentNote[] {
    const notes:InstrumentNote[] = []

    const [minVal, maxVal] = testConfig.noteRange
    const diff = maxVal - minVal + 1 ; 
    console.log(diff)
    for(let i = 0; i < testConfig.numNotes; i++){
        const v = Math.floor(Math.random() * diff) + minVal; 
        const n = InstrumentNote.fromValue(v); 
        notes.push(n)
    }

    return notes; 
}