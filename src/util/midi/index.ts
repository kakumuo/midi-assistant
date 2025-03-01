

export enum InstrumentActionType {
    PRESS, RELEASE
}

export type InstrumentNote = {
    key: "C" | "C#" | "D" | "D#" | "E" | "F" | "F#" | "G" | "G#" | "A" | "A#" | "B",
    octave: number
    isAccidental: boolean
}

export enum InstrumentKey {
    SUS_BUTTON = "SUS",
    PEDAL = "PEDAL",
    NOTE_MOD_UP = "MOD_UP",
    NOTE_MOD_DOWN = "MOD_DOWN",
    DIAL_UP = "DIAL_UP",
    DIAL_DOWN = "DIAL_DOWN",
}

export enum InstrumentType {
    PIANO, 
    DRUM
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

export interface InstrumentKeyEvent  {
    isPressed:boolean, 
    velocity: number, 
    targetKey: InstrumentKey | undefined,
    targetNote: InstrumentNote | undefined
}

export interface InstrumentStateEvent  {
    connected:boolean; 
}

// Map MIDI note numbers to InstrumentKey and octave
const noteMap: {[key: number]: InstrumentNote} = {
    36: {key: "C", octave: 3, isAccidental: false},
    37: {key: "C#", octave: 3, isAccidental: true},
    38: {key: "D", octave: 3, isAccidental: false},
    39: {key: "D#", octave: 3, isAccidental: true},
    40: {key: "E", octave: 3, isAccidental: false},
    41: {key: "F", octave: 3, isAccidental: false},
    42: {key: "F#", octave: 3, isAccidental: true},
    43: {key: "G", octave: 3, isAccidental: false},
    44: {key: "G#", octave: 3, isAccidental: true},
    45: {key: "A", octave: 3, isAccidental: false},
    46: {key: "A#", octave: 3, isAccidental: true},
    47: {key: "B", octave: 3, isAccidental: false},

    48: {key: "C", octave: 4, isAccidental: false},
    49: {key: "C#", octave: 4, isAccidental: true},
    50: {key: "D", octave: 4, isAccidental: false},
    51: {key: "D#", octave: 4, isAccidental: true},
    52: {key: "E", octave: 4, isAccidental: false},
    53: {key: "F", octave: 4, isAccidental: false},
    54: {key: "F#", octave: 4, isAccidental: true},
    55: {key: "G", octave: 4, isAccidental: false},
    56: {key: "G#", octave: 4, isAccidental: true},
    57: {key: "A", octave: 4, isAccidental: false},
    58: {key: "A#", octave: 4, isAccidental: true},
    59: {key: "B", octave: 4, isAccidental: false},

    60: {key: "C", octave: 5, isAccidental: false},
    61: {key: "C#", octave: 5, isAccidental: true},
    62: {key: "D", octave: 5, isAccidental: false},
    63: {key: "D#", octave: 5, isAccidental: true},
    64: {key: "E", octave: 5, isAccidental: false},
    65: {key: "F", octave: 5, isAccidental: false},
    66: {key: "F#", octave: 5, isAccidental: true},
    67: {key: "G", octave: 5, isAccidental: false},
    68: {key: "G#", octave: 5, isAccidental: true},
    69: {key: "A", octave: 5, isAccidental: false},
    70: {key: "A#", octave: 5, isAccidental: true},
    71: {key: "B", octave: 5, isAccidental: false},

    72: {key: "C", octave: 6, isAccidental: false},
    73: {key: "C#", octave: 6, isAccidental: true},
    74: {key: "D", octave: 6, isAccidental: false},
    75: {key: "D#", octave: 6, isAccidental: true},
    76: {key: "E", octave: 6, isAccidental: false},
    77: {key: "F", octave: 6, isAccidental: false},
    78: {key: "F#", octave: 6, isAccidental: true},
    79: {key: "G", octave: 6, isAccidental: false},
    80: {key: "G#", octave: 6, isAccidental: true},
    81: {key: "A", octave: 6, isAccidental: false},
    82: {key: "A#", octave: 6, isAccidental: true},
    83: {key: "B", octave: 6, isAccidental: false},
    
    84: {key: "C", octave: 7, isAccidental: false},
    85: {key: "C#", octave: 7, isAccidental: true},
    86: {key: "D", octave: 7, isAccidental: false},
    87: {key: "D#", octave: 7, isAccidental: true},
    88: {key: "E", octave: 7, isAccidental: false},
    89: {key: "F", octave: 7, isAccidental: false},
    90: {key: "F#", octave: 7, isAccidental: true},
    91: {key: "G", octave: 7, isAccidental: false},
    92: {key: "G#", octave: 7, isAccidental: true},
    93: {key: "A", octave: 7, isAccidental: false},
    94: {key: "A#", octave: 7, isAccidental: true},
    95: {key: "B", octave: 7, isAccidental: false},
    96: {key: "C", octave: 8, isAccidental: false}
};


interface InstrumentContext {
    parseMessage:(e:WebMidi.MIDIMessageEvent)=>InstrumentKeyEvent; 
    parseState:(e:WebMidi.MIDIConnectionEvent)=>InstrumentStateEvent; 
}

class PianoContext implements InstrumentContext {
    constructor() {}
    parseMessage = (e: WebMidi.MIDIMessageEvent) => {
        const data = e.data;

        const prefix = data[0]; 
        const midiNote = data[1];
        let velocity = data[2];

        // Convert MIDI note number to InstrumentKey enum
        let note:InstrumentNote | undefined = undefined; 
        let key:InstrumentKey | undefined = undefined; 
        let isPressed:boolean = false; 
        let isNote:boolean = false; 
        let isAccidental:boolean = false;
        let octave:number = 4;

        // process note
        if((prefix == 128 || prefix == 144) && midiNote >= 36 && midiNote <= 96){
            note = noteMap[midiNote];
            isPressed = prefix == 144;    
            isNote = true; 
            velocity = !isPressed ? 0 : velocity; 
        }else if (prefix == 176 && midiNote == 64){
            key = InstrumentKey.PEDAL;
            isPressed = velocity > 0; 
            velocity = 0; 
        }else if (prefix == 176 && midiNote == 72){
            key = InstrumentKey.SUS_BUTTON;
            isPressed = velocity == 116; 
            velocity = 0; 
        }else if(prefix == 224) {
            key = velocity > 64 ? InstrumentKey.NOTE_MOD_UP : InstrumentKey.NOTE_MOD_DOWN;
            isPressed = true; 
        }

        const event:InstrumentKeyEvent = {
            isPressed,
            velocity,
            targetNote: note,
            targetKey: key,
        };

        return event;
    };

    parseState = (e: WebMidi.MIDIConnectionEvent) => {
        return {
            connected: true,
            type: 'instrumentstate',
        } as InstrumentStateEvent;
    };
}

export class InstrumentController {
    private input:WebMidi.MIDIInput
    private listeners:{
        ['statechange']: Map<CallableFunction, CallableFunction>
        ['midimessage']: Map<CallableFunction, CallableFunction>
    }
    private context:InstrumentContext

    constructor(input:WebMidi.MIDIInput){
        this.listeners = {
            statechange: new Map(), 
            midimessage: new Map()
        } 
        this.input = input; 
        this.context = new PianoContext(); 

        this.setInput(input)
        this.setContext(this.context); 
    }                                                                                                                                                                                                                                                                         


    //TODO: Filter output depending on whether it is 
    addStateListener(listener:(e:InstrumentStateEvent)=>void) {
        const f = (ev:WebMidi.MIDIConnectionEvent) => listener(this.context.parseState(ev)); 
        this.input.addEventListener('statechange', f); 
        (!this.listeners.statechange.has(listener))
            this.listeners.statechange.set(listener, f); 
    }
    addMessageListener(listener:(e:InstrumentKeyEvent)=>void) {
        const f = (ev:WebMidi.MIDIMessageEvent) => listener(this.context.parseMessage(ev));
        this.input.addEventListener('midimessage', f);
        if(!this.listeners.midimessage.has(listener))
            this.listeners.midimessage.set(listener, f);
    }

    removeStateListener(listener:(e:InstrumentStateEvent)=>void) {
        const f:any = this.listeners.statechange.get(listener);
        if(this.listeners.statechange.has(listener)) {
            this.input.removeEventListener('statechange', f);
            this.listeners.statechange.delete(listener);
        }
    }

    removeMessageListener(listener:(e:InstrumentKeyEvent)=>void) {
        const f:any = this.listeners.midimessage.get(listener);
        if(f) {
            this.input.removeEventListener('midimessage', f);
            this.listeners.midimessage.delete(listener);
        }
    }

    setContext(context:InstrumentContext) {
        this.context = context;
    }

    setInput(input:WebMidi.MIDIInput) {
        // transfer state change
        for(const f of this.listeners.statechange.values()) {
            this.input.removeEventListener('statechange', f as any);
            input.addEventListener('statechange', f as any);
        }

        // transfer message change
        for(const f of this.listeners.midimessage.values()) {
            this.input.removeEventListener('midimessage', f as any);
            input.addEventListener('midimessage', f as any);
        }

        this.input = input;
    }
}