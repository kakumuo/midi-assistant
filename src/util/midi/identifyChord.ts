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
        
        const notesByKey = [...notesSorted].sort((a, b) => {
            return keysInOrder.indexOf(a.key) - keysInOrder.indexOf(b.key)
        }); 

        

        res = `${notesByKey[0].key}${targetChord}`
        if(notesByKey[0].key != notesSorted[0].key){
            res += ` / ${notesSorted[0].key}`
        }
    }

    return res; 
}