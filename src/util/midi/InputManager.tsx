import React, { KeyboardEvent, useState } from "react"
import { InstrumentEvent, InstrumentEventType, InstrumentKey, InstrumentKeyEvent, InstrumentNote, InstrumentNoteEvent, IntervalType, midiNoteMap } from ".";
import { Chord } from "tonal";


const kbdNoteMap:{[key:string]: InstrumentNote} = {
    // Map keyboard keys to notes (2 octaves starting from C4)
    'a': new InstrumentNote("C",4),
    'w': new InstrumentNote("C#",4),
    's': new InstrumentNote("D",4), 
    'e': new InstrumentNote("D#",4),
    'd': new InstrumentNote("E",4),
    'f': new InstrumentNote("F",4),
    't': new InstrumentNote("F#",4),
    'g': new InstrumentNote("G",4),
    'y': new InstrumentNote("G#",4),
    'h': new InstrumentNote("A",4),
    'u': new InstrumentNote("A#",4),
    'j': new InstrumentNote("B",4),
    'k': new InstrumentNote("C",5),
    'o': new InstrumentNote("C#",5),
    'l': new InstrumentNote("D",5),
    'p': new InstrumentNote("D#",5),
    ';': new InstrumentNote("E",5),
    "'": new InstrumentNote("F",5)
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
        inputManager.addListener(InstrumentEventType.KEY, handleNoteChange); 

        return () => {
            inputManager.removeListener(InstrumentEventType.NOTE, handleNoteChange);
            inputManager.removeListener(InstrumentEventType.KEY, handleNoteChange); 
        }
    }, []); 

    return activeNotes;
}

const keyOrder:InstrumentNote['key'][] = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const useActiveChords = () => {
    const activeNotes = useActiveNotes(); 

    const notesSorted = React.useMemo(() => {
        return [...activeNotes].sort((a,b) => {
            if(a.octave !== b.octave) return a.octave - b.octave;
            return keyOrder.indexOf(a.key) - keyOrder.indexOf(b.key);
        });
    }, [activeNotes]);
    
    const activeChords = React.useMemo(() => {
        let res:string[] = []; 
        
        const noteSet = new Set(notesSorted.map(n => n.key))
    
        if(noteSet.size == 1){
            res = [notesSorted[0].key];
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
    
            res = [`${root.key} ${targetInterval}`]
        }else if(noteSet.size >= 3 && noteSet.size <= 7) {
            res = Chord.detect(notesSorted.map(n => n.key), {assumePerfectFifth: true}); 
        }

        if(notesSorted.length > 0 && res.length == 0)
            res = [notesSorted[0].key + ' n.c']
    
        return res; 
    }, [activeNotes])

    return activeChords; 
}