import React, { KeyboardEvent, useState } from "react"
import { InstrumentEvent, InstrumentEventType, InstrumentKey, InstrumentKeyEvent, InstrumentNote, InstrumentNoteEvent, midiNoteMap } from ".";


const kbdNoteMap:{[key:string]: InstrumentNote} = {
    // Map keyboard keys to notes (2 octaves starting from C4)
    'a': {key: "C", octave: 4},
    'w': {key: "C#", octave: 4},
    's': {key: "D", octave: 4}, 
    'e': {key: "D#", octave: 4},
    'd': {key: "E", octave: 4},
    'f': {key: "F", octave: 4},
    't': {key: "F#", octave: 4},
    'g': {key: "G", octave: 4},
    'y': {key: "G#", octave: 4},
    'h': {key: "A", octave: 4},
    'u': {key: "A#", octave: 4},
    'j': {key: "B", octave: 4},

    'k': {key: "C", octave: 5},
    'o': {key: "C#", octave: 5},
    'l': {key: "D", octave: 5},
    'p': {key: "D#", octave: 5},
    ';': {key: "E", octave: 5},
    "'": {key: "F", octave: 5}
}

export class InstrumentInputManager {
    private listeners: Record<InstrumentEventType, Set<((note:InstrumentEvent)=>void)>>;
    private activeNotesMap: Record<string, Set<InstrumentNote>>; 
    activeNotes: Set<InstrumentNote>; 

    constructor(){
        this.activeNotesMap = {};
        this.activeNotes = new Set(); 
        this.listeners = {
            key: new Set(), 
            note: new Set(), 
            state: new Set()
        }; 

        this.initializeMIDI(); 
        this.initializeKBD(); 
    }

    private initializeMIDI() {
        navigator.requestMIDIAccess()
            .then(access => {
                access.addEventListener('statechange', (e) => this.handleStateChange(e)); 
            
                access.inputs.forEach(input => {
                    input.addEventListener('midimessage', (e) => this.handleMIDIInput(e)); 
                    this.activeNotesMap[input.id] = new Set(); 
                });
            });
    }

    private initializeKBD() {
        document.addEventListener('keydown', (e) => this.handleKBDInput(true, e)); 
        document.addEventListener('keyup', (e) => this.handleKBDInput(false, e)); 
        this.activeNotesMap['kbd'] = new Set(); 
    }

    // TODO: implement
    private handleStateChange(e:WebMidi.MIDIConnectionEvent) {
        // console.log("State change: ", e); 
    }

    private handleMIDIInput(e:WebMidi.MIDIMessageEvent) {
        // console.log("MIDI Input: ", e);
        
        const data = e.data;

        const prefix = data[0];
        const midiNote = data[1];
        let velocity = data[2];

        let note: InstrumentNote = {} as InstrumentNote;
        let key:InstrumentKey = {} as InstrumentKey; 
        let isKey:boolean = true; 
        let isPressed: boolean = false;

        // process note
        if ((prefix == 128 || prefix == 144) && midiNote >= 36 && midiNote <= 96) {
            note = midiNoteMap[midiNote];
            isPressed = prefix == 144;
            velocity = !isPressed ? 0 : velocity;
            isKey = false; 
        }        
        else if (prefix == 176 && midiNote == 64) {
            key = InstrumentKey.PEDAL;
            isPressed = velocity > 0;
            velocity = 0;
        } else if (prefix == 176 && midiNote == 72) {
            key = InstrumentKey.SUS_BUTTON;
            isPressed = velocity == 116;
            velocity = 0;
        } else if (prefix == 224) {
            key = velocity > 64 ? InstrumentKey.NOTE_MOD_UP : InstrumentKey.NOTE_MOD_DOWN;
            isPressed = true;
        }

        const midiTarget = e.target as WebMidi.MIDIInput; 
        if(!isKey) {
            if(isPressed)
                this.activeNotesMap[midiTarget.id].add(note); 
            else
                this.activeNotesMap[midiTarget.id].delete(note); 
    
            this.normalizeInputs(); 

            this.dispatchEvent(InstrumentEventType.NOTE, {
                isPressed, 
                note, 
                source: midiTarget.id, 
                type: InstrumentEventType.NOTE, 
                velocity
            } as InstrumentNoteEvent); 
        } else {
            this.dispatchEvent(InstrumentEventType.KEY, {
                isPressed, 
                key, 
                source: midiTarget.id, 
                type: InstrumentEventType.KEY, 
                velocity
            } as InstrumentKeyEvent); 
        }
    }

    private handleKBDInput(isPressed:boolean, e:globalThis.KeyboardEvent) {
        if(!kbdNoteMap.hasOwnProperty(e.key) || e.repeat) return; 

        e.preventDefault(); 

        const note = kbdNoteMap[e.key] as InstrumentNote; 
        if(isPressed){
            this.activeNotesMap['kbd'].add(note); 
        }else {
            this.activeNotesMap['kbd'].delete(note); 
        }

        this.normalizeInputs(); 

        this.dispatchEvent(InstrumentEventType.NOTE, {
            isPressed, 
            note, 
            source: 'kbd', 
            type: InstrumentEventType.NOTE, 
            velocity: 64
        } as InstrumentNoteEvent); 
    }


    private setEq(a:Set<InstrumentNote>, b:Set<InstrumentNote>) {
        if (a.size !== b.size) return false;

        for (const noteA of a) {
            let found = false;
            for (const noteB of b) {
                if (noteA.key === noteB.key && noteA.octave === noteB.octave) {
                    found = true;
                    break;
                }
            }
            if (!found) return false;
        }
        return true;
    }

    private normalizeInputs() {
        const prevSet = new Set(this.activeNotes);
        this.activeNotes.clear();

        for(const input in this.activeNotesMap){
            for(const note of this.activeNotesMap[input]){
                this.activeNotes.add(note); 
            }
        }

        if(!this.setEq(prevSet, this.activeNotes)){
            const res:string[] = []
            this.activeNotes.forEach(n => res.push(`${n.key}${n.octave}`))
            // console.log(res)
        }

        // // identify changed notes and dispatch 
        // for(const prev of prevSet){
        //     if(!this.activeNotes.has(prev)) this.dispatchEvent(InstrumentEventType.NOTE, {
        //         source: 'kbd', //TODO: add detection for different sources
        //         type: InstrumentEventType.NOTE, 
        //         isPressed: false, 
        //         note: prev, 
        //         velocity: 64 //TODO: pass velocity into the note set
        //     } as InstrumentNoteEvent); 
        // }

        // for(const next of this.activeNotes){
        //     if(!prevSet.has(next))this.dispatchEvent(InstrumentEventType.NOTE, {
        //         source: 'kbd', //TODO: add detection for different sources
        //         type: InstrumentEventType.NOTE, 
        //         isPressed: true, 
        //         note: next, 
        //         velocity: 64 //TODO: pass velocity into the note set
        //     } as InstrumentNoteEvent); 
        // }

    }

    addListener(type: InstrumentEventType, listener:(e:InstrumentEvent)=>void){
        this.listeners[type].add(listener); 
    }

    removeListener(type: InstrumentEventType, listener:(e:InstrumentEvent)=>void){
        this.listeners[type].delete(listener); 
    }

    private dispatchEvent(type: InstrumentEventType, e:InstrumentEvent){
        this.listeners[type].forEach(l => l(e)); 
    }
}

export type InstrumentInputContextData = {
    inputManager:InstrumentInputManager,
    hasMIDI:boolean
}
export const InstrumentInputContext = React.createContext({} as InstrumentInputContextData); 
export const InstrumentInputProvider = (props: {children:any}) => {
    const [inputManager] = useState(() => new InstrumentInputManager());
    const [hasMIDI, setHasMIDI] = React.useState(false); 

    // init input devices and listners
    React.useEffect(() => {
        navigator.requestMIDIAccess()
            .then(() => setHasMIDI(true))
            .catch(() => setHasMIDI(false));
    }, []);

    return (
        <InstrumentInputContext.Provider value={{hasMIDI, inputManager}}>
            {props.children}
        </InstrumentInputContext.Provider>
    )
} 

export const useActiveNotes = () => {
    const [activeNotes, setActiveNotes] = useState(() => new Set<InstrumentNote>());
    const {inputManager} = React.useContext(InstrumentInputContext); 

    React.useEffect(() => {
        const handleNoteChange = () => {
            setActiveNotes(new Set(inputManager.activeNotes));
        };

        inputManager.addListener(InstrumentEventType.NOTE, handleNoteChange); 

        return () => {
            inputManager.removeListener(InstrumentEventType.NOTE, handleNoteChange);
        }
    }, []); 

    return activeNotes;
}