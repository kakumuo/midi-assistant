

export enum InstrumentActionType {
    PRESS, RELEASE
}

export enum InstrumentKey {
    //Notes: C2 to C7
    C_2,
    C_SHARP_2,
    D_2,
    D_SHARP_2,
    E_2,
    F_2,
    F_SHARP_2,
    G_2,
    G_SHARP_2,
    A_2,
    A_SHARP_2,
    B_2,

    C_3,
    C_SHARP_3,
    D_3,
    D_SHARP_3,
    E_3,
    F_3,
    F_SHARP_3,
    G_3,
    G_SHARP_3,
    A_3,
    A_SHARP_3,
    B_3,

    C_4,
    C_SHARP_4,
    D_4,
    D_SHARP_4,
    E_4,
    F_4,
    F_SHARP_4,
    G_4,
    G_SHARP_4,
    A_4,
    A_SHARP_4,
    B_4,

    C_5,
    C_SHARP_5,
    D_5,
    D_SHARP_5,
    E_5,
    F_5,
    F_SHARP_5,
    G_5,
    G_SHARP_5,
    A_5,
    A_SHARP_5,
    B_5,

    C_6,
    C_SHARP_6,
    D_6,
    D_SHARP_6,
    E_6,
    F_6,
    F_SHARP_6,
    G_6,
    G_SHARP_6,
    A_6,
    A_SHARP_6,
    B_6,
    C_7,

    SUS_BUTTON, 
    PEDAL, 
    NOTE_MOD_UP,
    NOTE_MOD_DOWN, 
    DIAL_UP,
    DIAL_DOWN
}

export enum InstrumentType {
    PIANO, 
    DRUM
}

export interface InstrumentKeyEvent extends Event {
    downOrUp:boolean, 
    velocity: number, 
    key: InstrumentKey
}

export interface InstrumentStateEvent extends Event {
    connected:boolean; 
}

// Map MIDI note numbers to InstrumentKey enum values
const noteMap: {[key: number]: InstrumentKey} = {
    48: InstrumentKey.C_4,
    49: InstrumentKey.C_SHARP_4,
    50: InstrumentKey.D_4,
    51: InstrumentKey.D_SHARP_4,
    52: InstrumentKey.E_4,
    53: InstrumentKey.F_4,
    54: InstrumentKey.F_SHARP_4,
    55: InstrumentKey.G_4,
    56: InstrumentKey.G_SHARP_4,
    57: InstrumentKey.A_4,
    58: InstrumentKey.A_SHARP_4,
    59: InstrumentKey.B_4,
    60: InstrumentKey.C_5,
    61: InstrumentKey.C_SHARP_5,
    62: InstrumentKey.D_5,
    63: InstrumentKey.D_SHARP_5,
    64: InstrumentKey.E_5,
    65: InstrumentKey.F_5,
    66: InstrumentKey.F_SHARP_5,
    67: InstrumentKey.G_5,
    68: InstrumentKey.G_SHARP_5,
    69: InstrumentKey.A_5,
    70: InstrumentKey.A_SHARP_5,
    71: InstrumentKey.B_5,
    72: InstrumentKey.C_6,
    73: InstrumentKey.C_SHARP_6,
    74: InstrumentKey.D_6,
    75: InstrumentKey.D_SHARP_6,
    76: InstrumentKey.E_6,
    77: InstrumentKey.F_6,
    78: InstrumentKey.F_SHARP_6,
    79: InstrumentKey.G_6,
    80: InstrumentKey.G_SHARP_6,
    81: InstrumentKey.A_6,
    82: InstrumentKey.A_SHARP_6,
    83: InstrumentKey.B_6,
    84: InstrumentKey.C_7,
};


interface InstrumentContext {
    parseMessage:(e:WebMidi.MIDIMessageEvent)=>InstrumentKeyEvent; 
    parseState:(e:WebMidi.MIDIConnectionEvent)=>InstrumentStateEvent; 
}

class PianoContext implements InstrumentContext {
    constructor() {}
    parseMessage = (e: WebMidi.MIDIMessageEvent) => {
        const data = e.data;
        const downOrUp = data[0] === 144; // 144 = note on, 128 = note off
        const velocity = data[2];
        const midiNote = data[1];
        
        // Convert MIDI note number to InstrumentKey enum
        let key = InstrumentKey.C_4; // Default fallback
        

        if (midiNote in noteMap) {
            key = noteMap[midiNote];
        }

        return {
            downOrUp,
            velocity,
            key,
            type: 'instrumentkey'
        } as InstrumentKeyEvent;
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