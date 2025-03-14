export class InstrumentNote {
    key: "C" | "C#" | "D" | "D#" | "E" | "F" | "F#" | "G" | "G#" | "A" | "A#" | "B" = 'C'; 
    octave: number = 0; 
    velocity?: number = 0
}

export enum InstrumentKey {
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
    key:InstrumentKey, 
}

export interface InstrumentNoteEvent extends InstrumentEvent {
    note: InstrumentNote
}


// Map MIDI note numbers to InstrumentKey and octave
export const midiNoteMap: {[key: number]: InstrumentNote} = {
    36: {key: "C", octave: 3},
    37: {key: "C#", octave: 3},
    38: {key: "D", octave: 3},
    39: {key: "D#", octave: 3},
    40: {key: "E", octave: 3},
    41: {key: "F", octave: 3},
    42: {key: "F#", octave: 3},
    43: {key: "G", octave: 3},
    44: {key: "G#", octave: 3},
    45: {key: "A", octave: 3},
    46: {key: "A#", octave: 3},
    47: {key: "B", octave: 3},

    48: {key: "C", octave: 4},
    49: {key: "C#", octave: 4},
    50: {key: "D", octave: 4},
    51: {key: "D#", octave: 4},
    52: {key: "E", octave: 4},
    53: {key: "F", octave: 4},
    54: {key: "F#", octave: 4},
    55: {key: "G", octave: 4},
    56: {key: "G#", octave: 4},
    57: {key: "A", octave: 4},
    58: {key: "A#", octave: 4},
    59: {key: "B", octave: 4},
    
    60: {key: "C", octave: 5},
    61: {key: "C#", octave: 5},
    62: {key: "D", octave: 5},
    63: {key: "D#", octave: 5},
    64: {key: "E", octave: 5},
    65: {key: "F", octave: 5},
    66: {key: "F#", octave: 5},
    67: {key: "G", octave: 5},
    68: {key: "G#", octave: 5},
    69: {key: "A", octave: 5},
    70: {key: "A#", octave: 5},
    71: {key: "B", octave: 5},

    72: {key: "C", octave: 6},
    73: {key: "C#", octave: 6},
    74: {key: "D", octave: 6},
    75: {key: "D#", octave: 6},
    76: {key: "E", octave: 6},
    77: {key: "F", octave: 6},
    78: {key: "F#", octave: 6},
    79: {key: "G", octave: 6},
    80: {key: "G#", octave: 6},
    81: {key: "A", octave: 6},
    82: {key: "A#", octave: 6},
    83: {key: "B", octave: 6},
    
    84: {key: "C", octave: 7},
    85: {key: "C#", octave: 7},
    86: {key: "D", octave: 7},
    87: {key: "D#", octave: 7},
    88: {key: "E", octave: 7},
    89: {key: "F", octave: 7},
    90: {key: "F#", octave: 7},
    91: {key: "G", octave: 7},
    92: {key: "G#", octave: 7},
    93: {key: "A", octave: 7},
    94: {key: "A#", octave: 7},
    95: {key: "B", octave: 7},
    96: {key: "C", octave: 8}
};



