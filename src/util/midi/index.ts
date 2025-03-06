
export type InstrumentNote = {
    key: "C" | "C#" | "D" | "D#" | "E" | "F" | "F#" | "G" | "G#" | "A" | "A#" | "B"
    octave: number
}

export enum InstrumentNoteKey {
    C = "C",
    C_SHARP = "C#",
    D = "D",
    D_SHARP = "D#",
    E = "E",
    F = "F",
    F_SHARP = "F#",
    G = "G",
    G_SHARP = "G#",
    A = "A",
    A_SHARP = "A#",
    B = "B"
}
export const noteDataMap:Record<InstrumentNoteKey, {color:string}> = {
    [InstrumentNoteKey.C]:          { color: "#FF0000" },
    [InstrumentNoteKey.C_SHARP]:    { color: "#FF4500" },
    [InstrumentNoteKey.D]:          { color: "#FFA500" },
    [InstrumentNoteKey.D_SHARP]:    { color: "#FFD700" },
    [InstrumentNoteKey.E]:          { color: "#ADFF2F" },
    [InstrumentNoteKey.F]:          { color: "#32CD32" },
    [InstrumentNoteKey.F_SHARP]:    { color: "#008000" },
    [InstrumentNoteKey.G]:          { color: "#006400" },
    [InstrumentNoteKey.G_SHARP]:    { color: "#4B0082" },
    [InstrumentNoteKey.A]:          { color: "#483D8B" },
    [InstrumentNoteKey.A_SHARP]:    { color: "#000080" },
    [InstrumentNoteKey.B]:          { color: "#0000CD" },
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


export enum ChordType {
    NONE = "",
    MAJOR = "Major",
    MINOR = "Minor", 
    DIMINISHED = "Diminished",
    AUGMENTED = "Augmented",
    MAJOR_7TH = "Major 7th",
    MINOR_7TH = "Minor 7th",
    DOMINANT_7TH = "Dominant 7th", 
    HALF_DIMINISHED_7TH = "Half Diminished 7th",
    DIMINISHED_7TH = "Diminished 7th",
    MAJOR_9TH = "Major 9th",
    MINOR_9TH = "Minor 9th",
    DOMINANT_9TH = "Dominant 9th",
    MAJOR_11TH = "Major 11th",
    MINOR_11TH = "Minor 11th", 
    DOMINANT_11TH = "Dominant 11th",
    MAJOR_13TH = "Major 13th",
    MINOR_13TH = "Minor 13th",
    DOMINANT_13TH = "Dominant 13th",
    SUS2 = "Sus2",
    SUS4 = "Sus4",
    ADD9 = "Add9",
    SIXTH = "6th",
    MINOR_6TH = "Minor 6th"
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



