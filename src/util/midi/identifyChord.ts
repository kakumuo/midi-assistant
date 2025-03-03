import { ChordType, InstrumentNote, IntervalType } from ".";


// // ex: root: D#, quality: Major 2nd, intervals:2 => (D# -> F) 
// export type ChordData = {
//     root:string,
//     quality:undefined | IntervalType | ChordType, 
//     intervals:number[],
// }

export const identifyChord = (notesSorted:InstrumentNote[]) => {
    let res = ""; 
    
    if(notesSorted.length == 1){
        res = notesSorted[0].key;
    }
    else if (notesSorted.length == 2){
        const root = notesSorted[0]; 
        const other = notesSorted[1]; 
        const keysInOrder = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]; 

        const rootI = keysInOrder.indexOf(root.key);
        const otherI = keysInOrder.indexOf(other.key);  
        const interval = (otherI - rootI + 12) % 12;

        let targetInterval = ""; 
        switch(interval){
            case 0: targetInterval = IntervalType.PERFECT_OCTAVE; break;
            case 1: targetInterval = IntervalType.MINOR_SECOND; break;
            case 2: targetInterval = IntervalType.MAJOR_SECOND; break;
            case 3: targetInterval = IntervalType.MINOR_THIRD; break;
            case 4: targetInterval = IntervalType.MAJOR_THIRD; break;
            case 5: targetInterval = IntervalType.PERFECT_FOURTH; break;
            case 6: targetInterval = IntervalType.TRITONE; break;
            case 7: targetInterval = IntervalType.PERFECT_FIFTH; break;
            case 8: targetInterval = IntervalType.MINOR_SIXTH; break;
            case 9: targetInterval = IntervalType.MAJOR_SIXTH; break;
            case 10: targetInterval = IntervalType.MINOR_SEVENTH; break;
            case 11: targetInterval = IntervalType.MAJOR_SEVENTH; break;
        }

        res = `${root.key} ${targetInterval}`
    }else if(notesSorted.length >= 3 && notesSorted.length <= 7) {
        let targetChord = "";
        const keysInOrder:InstrumentNote['key'][] = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        
        // Try each note as potential root to identify inversions
        let foundChord = false;
        for(let rootIndex = 0; rootIndex < notesSorted.length && !foundChord; rootIndex++) {
            const potentialRoot = notesSorted[rootIndex];
            const intervals:number[] = [];
            
            // Calculate intervals from potential root note
            for(let i = 0; i < notesSorted.length; i++) {
                if(i !== rootIndex) {
                    const note = notesSorted[i];
                    const rootI = keysInOrder.indexOf(potentialRoot.key);
                    const noteI = keysInOrder.indexOf(note.key);
                    const interval = (noteI - rootI + 12) % 12;
                    intervals.push(interval);
                }
            }
            
            // Sort intervals to match standard chord patterns
            intervals.sort((a,b) => a - b);

            // console.log(intervals.join("-"))
            
            // TODO: add inversions and 4+note chords with omitted notes
            switch(intervals.join("-")){
                case "4-7":         targetChord = "maj"; foundChord = true; break;
                case "3-7":         targetChord = "min"; foundChord = true; break;
                case "3-6":         targetChord = "dim"; foundChord = true; break;
                case "4-8":         targetChord = "aug"; foundChord = true; break;
                case "4-7-11":      targetChord = "maj7"; foundChord = true; break;
                case "3-7-10":      targetChord = "min7"; foundChord = true; break;
                case "4-10":        targetChord = "dom7"; foundChord = true; break
                case "4-7-10":      targetChord = "dom7"; foundChord = true; break;
                case "3-6-9":       targetChord = "dim7"; foundChord = true; break;
                case "3-6-10":      targetChord = "half-dim7"; foundChord = true; break;
                case "4-7-9":       targetChord = "maj6"; foundChord = true; break;
                case "3-7-9":       targetChord = "min6"; foundChord = true; break;
                case "4-7-10-11":   targetChord = "maj9"; foundChord = true; break;
                case "3-7-10-11":   targetChord = "min9"; foundChord = true; break;
                case "4-7-8":       targetChord = "maj#5"; foundChord = true; break;
                case "4-7-10-14":   targetChord = "dom9"; foundChord = true; break;
                case "4-7-10-14-17":targetChord = "dom11"; foundChord = true; break;
                case "4-7-11-14-18":targetChord = "maj13"; foundChord = true; break;
                case "3-7-10-14-17":targetChord = "min11"; foundChord = true; break;
            }

            if(foundChord) {
                res = `${potentialRoot.key}${targetChord}`;
                if(potentialRoot.key != notesSorted[0].key){
                    res += ` / ${notesSorted[0].key}`;
                }
                break;
            }
        }

        // If no chord pattern found, fall back to original root note
        if(!foundChord) {
            const notesByKey = [...notesSorted].sort((a, b) => {
                return keysInOrder.indexOf(a.key) - keysInOrder.indexOf(b.key)
            });
            res = `${notesByKey[0].key}${targetChord}`;
            if(notesByKey[0].key != notesSorted[0].key){
                res += ` / ${notesSorted[0].key}`;
            }
        }
    }

    return res; 
}