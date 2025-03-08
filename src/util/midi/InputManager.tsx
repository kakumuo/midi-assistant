import React, { KeyboardEvent, useState } from "react"
import { InstrumentEvent, InstrumentEventType, InstrumentKey, InstrumentKeyEvent, InstrumentNote, InstrumentNoteEvent, InstrumentNoteKey, midiNoteMap } from ".";
import { ThreeSixty } from "@mui/icons-material";


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

const kbdKeyMap:{[key:string]: InstrumentKey} = {
    ' ': InstrumentKey.PEDAL
}

export class InstrumentInputManager {
    private listeners: Record<InstrumentEventType, Set<((note:InstrumentEvent)=>void)>>;
    private activeNotesMap: Record<string, Set<InstrumentNote>>; 
    private inactiveNotesMap: Record<string, Set<InstrumentNote>>; 
    activeNotes: Set<InstrumentNote>; 
    private sustain:boolean = false; 

    constructor(){
        this.activeNotesMap = {};
        this.activeNotes = new Set(); 
        this.inactiveNotesMap = {}; 
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
            
                /**
                 *  WebMidiBrowser for iOS receives events without target and id
                 *  TODO: find a way to get source id from mulitple devices on iOS through WebMidiBrowser
                 */
                // this.activeNotesMap[input.id] = new Set(); 
                this.activeNotesMap['midi'] = new Set(); 
                this.inactiveNotesMap['midi'] = new Set(); 

                access.inputs.forEach(input => {
                    if(!input.manufacturer) return; 

                    input.addEventListener('midimessage', (e) => this.handleMIDIInput(e)); 
                });
            });
    }

    private initializeKBD() {
        document.addEventListener('keydown', (e) => this.handleKBDInput(true, e)); 
        document.addEventListener('keyup', (e) => this.handleKBDInput(false, e)); 
        this.activeNotesMap['kbd'] = new Set(); 
        this.inactiveNotesMap['kbd'] = new Set(); 
    }

    // TODO: implement
    private handleStateChange(e:WebMidi.MIDIConnectionEvent) {
        // console.log("State change: ", e); 
    }

    private handleInput(
        isPressed: boolean,
        note: InstrumentNote | null,
        key: InstrumentKey | null,
        source: string,
        velocity: number
    ) {
        if (note) {
            // Handle note input
            if (isPressed) {
                note.velocity = velocity;
                this.activeNotesMap[source].add(note);
                this.inactiveNotesMap[source].delete(note);
            } else if (this.sustain) {
                this.inactiveNotesMap[source].add(note);
            } else {
                note.velocity = 0;
                this.activeNotesMap[source].delete(note);
            }

            this.normalizeInputs();

            this.dispatchEvent(InstrumentEventType.NOTE, {
                isPressed,
                note,
                source,
                type: InstrumentEventType.NOTE,
                velocity
            } as InstrumentNoteEvent);
        } else if (key) {
            // Handle key input
            if (key === InstrumentKey.PEDAL) {
                this.setSustain(isPressed);
            }

            this.dispatchEvent(InstrumentEventType.KEY, {
                isPressed,
                key,
                source,
                type: InstrumentEventType.KEY,
                velocity
            } as InstrumentKeyEvent);
        }
    }

    private handleMIDIInput(e: WebMidi.MIDIMessageEvent) {
        const data = e.data;
        const prefix = data[0];
        const midiNote = data[1];
        let velocity = data[2];

        let note: InstrumentNote | null = null;
        let key: InstrumentKey | null = null;
        let isPressed: boolean = false;

        // Process note
        if ((prefix == 128 || prefix == 144) && midiNote >= 36 && midiNote <= 96) {
            note = midiNoteMap[midiNote];
            isPressed = prefix == 144;
            velocity = !isPressed ? 0 : velocity;
        } else if (prefix == 176 && midiNote == 64) {
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

        this.handleInput(isPressed, note, key, 'midi', velocity);
    }

    private handleKBDInput(isPressed: boolean, e: globalThis.KeyboardEvent) {
        if ((!kbdNoteMap.hasOwnProperty(e.key) && !kbdKeyMap.hasOwnProperty(e.key)) || e.repeat) return;

        e.preventDefault();

        let note: InstrumentNote | null = null;
        let key: InstrumentKey | null = null;
        let velocity = isPressed ? 64 : 0;

        if (kbdNoteMap.hasOwnProperty(e.key)) {
            note = kbdNoteMap[e.key];
        } else {
            key = kbdKeyMap[e.key];
        }

        this.handleInput(isPressed, note, key, 'kbd', velocity);
    }

    
    private normalizeInputs() {
        this.activeNotes.clear();

        for(const input in this.activeNotesMap){
            for(const note of this.activeNotesMap[input]){
                this.activeNotes.add(note); 
            }
        }
    }

    private setSustain(sustain:boolean) {
        if(this.sustain == sustain) return; 
        this.sustain = sustain; 

        if(!this.sustain) {
            for(let device in this.inactiveNotesMap) {
                for(let note of this.inactiveNotesMap[device]){
                    this.activeNotesMap[device].delete(note); 
                }
                this.inactiveNotesMap[device].clear(); 
            }

            this.normalizeInputs();    
        }
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
    inputManager:InstrumentInputManager
}
export const InstrumentInputContext = React.createContext({} as InstrumentInputContextData); 
export const InstrumentInputProvider = (props: {children:any}) => {
    const [inputManager] = useState(() => new InstrumentInputManager());

    return (
        <InstrumentInputContext.Provider value={{inputManager}}>
            {props.children}
        </InstrumentInputContext.Provider>
    )
} 

export const useActiveNotes = () => {
    const [activeNotes, setActiveNotes] = useState(() => new Set<InstrumentNote>());
    const {inputManager} = React.useContext(InstrumentInputContext); 

    React.useEffect(() => {
        const handleNoteChange = (e:InstrumentEvent) => {
            setActiveNotes(new Set(inputManager.activeNotes));
        };

        inputManager.addListener(InstrumentEventType.NOTE, handleNoteChange); 
        // TODO: only update when the sustain is changed
        inputManager.addListener(InstrumentEventType.KEY, handleNoteChange); 

        return () => {
            inputManager.removeListener(InstrumentEventType.NOTE, handleNoteChange);
            inputManager.removeListener(InstrumentEventType.KEY, handleNoteChange); 
        }
    }, []); 

    return activeNotes;
}