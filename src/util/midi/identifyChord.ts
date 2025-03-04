import { ChordType, InstrumentNote, IntervalType } from ".";
import {Chord}  from 'tonal'


// // ex: root: D#, quality: Major 2nd, intervals:2 => (D# -> F) 
// export type ChordData = {
//     root:string,
//     quality:undefined | IntervalType | ChordType, 
//     intervals:number[],
// }

export const identifyChord = (notesSorted:InstrumentNote[]) => {
    let res = ""; 
    
    const noteSet = new Set(notesSorted.map(n => n.key))

    if(noteSet.size == 1){
        res = notesSorted[0].key;
    }
    else if (noteSet.size == 2){
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
    }else if(noteSet.size >= 3 && noteSet.size <= 7) {
        res = Chord.detect(notesSorted.map(n => n.key), {assumePerfectFifth: true})[0]
    }

    return res; 
}