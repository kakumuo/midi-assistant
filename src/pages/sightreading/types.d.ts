import { InstrumentNote } from "../../util/midi"


/**
 * potential options: 
 * useFlats                     - boolean (replaces useAccidentals)
 * useSharps                    - boolean (replaces useAccidentals)
 * staff                        - [grand | bass | treble]
 * key                          - [C - B]
 * scale                        - [major, minor, lydian, blues, ...]
 * (min/max)NoteInterval        - [1 - 8] 
 * (min/max)Tempo               - [60 - 120]
 * (min/max)Velocity            - number
 * (min/max)HarmonicNotes       - [1 - 4] (replaces useChords)
 * maxIncorrectNotes            - number
 * duration                     - number
 * numNotes                     - number
 * noteSequence                 - number[] // parse from standard notation
 * showIncorrectNotes           - boolean
 * waitForCorrectNotes          - boolean
 * timeSignature                - [number, number]
 * lookaheadNotes               - number
 * showNoteNames                - boolean
 * showNoteColors               - boolean
 */

export type Scale = 'Major' | 'Minor'
export type Staff = 'Grand' | 'Treble' | 'Bass'

export type TestConfig = {
    name                    : string
    uuid                    : string
    // Basic settings
    staff                   : Staff
    key                     : InstrumentNote['key']
    scale                   : Scale
    useFlats                : boolean
    useSharps               : boolean
    timeSignature           : [number, number]
    
    // Note range and display settings
    noteRange               : [number, number]
    noteIntervalRange       : [number, number]
    useChords               : boolean
    harmonicNotesRange      : [number, number]
    
    // Tempo and timing settings
    tempoRange              : [number, number]
    velocityRange           : [number, number]
    duration                : number
    
    // Test configuration
    numNotes                : number
    lookaheadNotes          : number
    maxIncorrectNotes       : number
    noteSequence            : number[] // parse from standard notation
    
    // Display options
    showIncorrectNotes      : boolean
    showNoteColors          : boolean
    showNoteNames           : boolean
    waitForCorrectNotes     : boolean
    showMetronome           : boolean
    metronome               : [number, number]
    
    createdDate             : number
    updatedDate             : number
}

/**
 * TODO: may want to add grouping type for data elements, 
 * will allow for records to be grouped visually, data is still kept in a flat style. 
 */
export type FormData = {
    field: keyof TestConfig, 
    label: string, 
    desc: string, 
    dataType: 'string' | 'scale' | 'boolean' | 'number' | 'number,number' | 'note,note' | 'array_number' | 'note' | 'key' | 'staff'
} | {
    field: string, 
    label: string, 
    desc: string, 
    dataType: 'group'
}

export type NoteResult = {
    targetNotes: number[], //note values
    missedNotes: number[], //note values
    startAttemptTiming:number, 
    hitTiming:number, 
    hitVelocity:number, 
}
