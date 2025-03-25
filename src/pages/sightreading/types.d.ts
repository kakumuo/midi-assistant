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
    useFlats                : boolean
    useSharps               : boolean
    staff                   : Staff
    key                     : InstrumentNote['key']
    scale                   : Scale
    noteRange               : [number, number]
    noteIntervalRange       : [number, number]
    tempoRange              : [number, number]
    velocityRange           : [number, number]
    useChords               : boolean
    harmonicNotesRange      : [number, number]
    maxIncorrectNotes       : number
    duration                : number
    numNotes                : number
    noteSequence            : number[] // parse from standard notation
    showIncorrectNotes      : boolean
    waitForCorrectNotes     : boolean
    timeSignature           : [number, number]
    lookaheadNotes          : number
    showNoteNames           : boolean
    showNoteColors          : boolean
}

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

// TODO: add grouping for form data

