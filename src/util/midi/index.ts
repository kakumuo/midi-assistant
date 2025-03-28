export type InstrumentKey = "C" | "C#" | "D" | "D#" | "E" | "F" | "F#" | "G" | "G#" | "A" | "A#" | "B" | "Db" | "Eb" | "Gb" | "Ab" | "Bb" | "Cb" | 'Fb';

export class InstrumentNote {
    static keyListSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]; 
    static keyListFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "Cb"]; 
    key: InstrumentKey = 'C'; 
    octave: number = 0; 
    velocity?: number = 0

    constructor(key:InstrumentKey, octave:number){
        this.key = key; 
        this.octave = octave; 
    }

    static isAccidental(value: number): boolean {
        const keyIndex = value % 12;
        return keyIndex === 1 || keyIndex === 3 || keyIndex === 6 || keyIndex === 8 || keyIndex === 10;
    }

    static fromValue(value:number) {
        const octave = Math.floor(value / 12);
        const keyIndex = value % 12;
        const key = InstrumentNote.keyListSharp[keyIndex] as InstrumentNote['key'];
        
        return new InstrumentNote(key, octave);
    }

    static fromNote(note:string){
        if (!note || note.length < 2) {
            throw new Error("Invalid note format. Expected format: [key][octave] (e.g., 'C4', 'C#5')");
        }
        
        // Extract the key part (can be one or two characters)
        const keyPart = note.match(/^[A-G](#)?/)?.[0];
        if (!keyPart) {
            throw new Error(`Invalid note key: ${note}`);
        }
        
        // Extract the octave part (remaining digits)
        const octavePart = note.substring(keyPart.length);
        const octave = parseInt(octavePart, 10);
        
        if (isNaN(octave)) {
            throw new Error(`Invalid octave in note: ${note}`);
        }
        
        return new InstrumentNote(keyPart as any, octave);
    }

    public equals(other:InstrumentNote, ignoreAccidentals:boolean=false) {
        if(ignoreAccidentals)
            return this.key.substring(0, 1) == other.key.substring(0, 1) && this.octave == other.octave
        return this.key == other.key && this.octave == other.octave
    }

    public valueOf() {
        return InstrumentNote.keyListSharp.indexOf(this.key) + (this.octave * 12); 
    }


    static getValue(key:InstrumentNote['key'], octave:number) {
        return InstrumentNote.keyListSharp.indexOf(key) + (octave * 12); 
    }

    public toString(){
        return this.key + this.octave
    }
}

export enum InstrumentInputKey {
    SUS_BUTTON = "SUS",
    PEDAL = "PEDAL",
    NOTE_MOD_UP = "MOD_UP",
    NOTE_MOD_DOWN = "MOD_DOWN",
    DIAL_UP = "DIAL_UP",
    DIAL_DOWN = "DIAL_DOWN",
}

export enum IntervalType {
    MINOR_SECOND = "Minor Second",
    MAJOR_SECOND = "Major Second",
    MINOR_THIRD = "Minor Third", 
    MAJOR_THIRD = "Major Third",
    PERFECT_FOURTH = "Perfect Fourth",
    TRITONE = "Tritone",
    PERFECT_FIFTH = "Perfect Fifth",
    MINOR_SIXTH = "Minor Sixth",
    MAJOR_SIXTH = "Major Sixth",
    MINOR_SEVENTH = "Minor Seventh",
    MAJOR_SEVENTH = "Major Seventh",
    PERFECT_OCTAVE = "Octave",
}

export const enum InstrumentEventType {
    NOTE = 'note', 
    KEY = 'key', 
    STATE = 'state'
}

export interface InstrumentEvent {
    isPressed:boolean, 
    velocity:number, 
    source:string, 
    type:InstrumentEventType,
}

export interface InstrumentStateEvent extends InstrumentEvent {
    connected:boolean; 
}

export interface InstrumentKeyEvent extends InstrumentEvent  {
    key:InstrumentInputKey, 
}

export interface InstrumentNoteEvent extends InstrumentEvent {
    note: InstrumentNote
}


// Map MIDI note numbers to InstrumentKey and octave
export const midiNoteMap: {[key: number]: InstrumentNote} = {
    36: new InstrumentNote("C",3),
    37: new InstrumentNote("C#",3),
    38: new InstrumentNote("D",3),
    39: new InstrumentNote("D#",3),
    40: new InstrumentNote("E",3),
    41: new InstrumentNote("F",3),
    42: new InstrumentNote("F#",3),
    43: new InstrumentNote("G",3),
    44: new InstrumentNote("G#",3),
    45: new InstrumentNote("A",3),
    46: new InstrumentNote("A#",3),
    47: new InstrumentNote("B",3),
    48: new InstrumentNote("C",4),
    49: new InstrumentNote("C#",4),
    50: new InstrumentNote("D",4),
    51: new InstrumentNote("D#",4),
    52: new InstrumentNote("E",4),
    53: new InstrumentNote("F",4),
    54: new InstrumentNote("F#",4),
    55: new InstrumentNote("G",4),
    56: new InstrumentNote("G#",4),
    57: new InstrumentNote("A",4),
    58: new InstrumentNote("A#",4),
    59: new InstrumentNote("B",4),
    60: new InstrumentNote("C",5),
    61: new InstrumentNote("C#",5),
    62: new InstrumentNote("D",5),
    63: new InstrumentNote("D#",5),
    64: new InstrumentNote("E",5),
    65: new InstrumentNote("F",5),
    66: new InstrumentNote("F#",5),
    67: new InstrumentNote("G",5),
    68: new InstrumentNote("G#",5),
    69: new InstrumentNote("A",5),
    70: new InstrumentNote("A#",5),
    71: new InstrumentNote("B",5),
    72: new InstrumentNote("C",6),
    73: new InstrumentNote("C#",6),
    74: new InstrumentNote("D",6),
    75: new InstrumentNote("D#",6),
    76: new InstrumentNote("E",6),
    77: new InstrumentNote("F",6),
    78: new InstrumentNote("F#",6),
    79: new InstrumentNote("G",6),
    80: new InstrumentNote("G#",6),
    81: new InstrumentNote("A",6),
    82: new InstrumentNote("A#",6),
    83: new InstrumentNote("B",6),
    84: new InstrumentNote("C",7),
    85: new InstrumentNote("C#",7),
    86: new InstrumentNote("D",7),
    87: new InstrumentNote("D#",7),
    88: new InstrumentNote("E",7),
    89: new InstrumentNote("F",7),
    90: new InstrumentNote("F#",7),
    91: new InstrumentNote("G",7),
    92: new InstrumentNote("G#",7),
    93: new InstrumentNote("A",7),
    94: new InstrumentNote("A#",7),
    95: new InstrumentNote("B",7),
    96: new InstrumentNote("C",8)
};



