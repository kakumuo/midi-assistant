import { CurrencyYenSharp } from "@mui/icons-material";
import { NoteResult } from "./types";

export const calculateResultData = (res:NoteResult[]) => {
    const noteTempos:number[] = []
    const noteMisses:number[] = []
    const noteVelocities:number[] = []
    let avgTempo = 0; 
    let accuracy = 0; 
    let duration = 0; 
    let numMisses = 0; 
    let avgVelocity = 0; // Added to calculate and return avgVelocity

    if(res.length > 0) {
        const n = res.length;
        let prevTiming = res[0].hitTiming; 
        
        res.forEach((curRes, i) => {
            let curTempo = 0; 
            if(i > 0) {
                const timeDiffMs = curRes.hitTiming - prevTiming;
                const timeDiffSec = timeDiffMs / 1000;
                curTempo = Math.round(60 / timeDiffSec);
            }
            prevTiming = curRes.hitTiming;

            noteVelocities.push(curRes.hitVelocity); 
            noteMisses.push(curRes.missedNotes.length); 
            noteTempos.push(curTempo); 
            avgTempo += curTempo; 
            avgVelocity += curRes.hitVelocity;

            numMisses += curRes.missedNotes.length; 
        })

        duration = res[n - 1].hitTiming - res[0].startAttemptTiming;
        duration /= 1000 
        duration = Math.round(duration * 100) / 100
        accuracy = n / (n + numMisses); 
        accuracy = Math.round(accuracy * 10000) / 100
        avgTempo /= Math.max(n - 1, 1); 
        avgTempo = Math.round(avgTempo * 100) / 100
        avgVelocity /= n;

    }

    const output = {    
        avgTempo, 
        accuracy, 
        duration, 
        noteTempos,
        noteVelocities, 
        noteMisses, 
        total: res.length, 
        totalMissed: numMisses, 
        minTempo: noteTempos.slice(1).reduce((p, c) => Math.min(p, c)), 
        maxTempo: noteTempos.reduce((p, c) => Math.max(p, c)), 
        minVelocity: noteVelocities.reduce((p, c) => Math.min(p, c)),
        maxVelocity: noteVelocities.reduce((p, c) => Math.max(p, c)),
        avgVelocity
    }

    console.log(output)

    return output
}