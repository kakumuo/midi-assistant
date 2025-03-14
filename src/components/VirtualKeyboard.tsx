import { Box, Button, colors, Typography } from "@mui/joy";
import React from "react";
import { InstrumentNote } from "../util/midi";
import { useActiveNotes } from "../util/midi/InputManager";
import { StyleSheet } from "../util";
import Color from "colorjs.io";
import { useNoteColors } from "../App";


const notes:InstrumentNote[] = [
    {key: 'C', octave: 2},
    {key: 'C#', octave: 2},
    {key: 'D', octave: 2},
    {key: 'D#', octave: 2},
    {key: 'E', octave: 2},
    {key: 'F', octave: 2},
    {key: 'F#', octave: 2},
    {key: 'G', octave: 2},
    {key: 'G#', octave: 2},
    {key: 'A', octave: 2},
    {key: 'A#', octave: 2},
    {key: 'B', octave: 2},
    {key: 'C', octave: 3},
    {key: 'C#', octave: 3},
    {key: 'D', octave: 3},
    {key: 'D#', octave: 3},
    {key: 'E', octave: 3},
    {key: 'F', octave: 3},
    {key: 'F#', octave: 3},
    {key: 'G', octave: 3},
    {key: 'G#', octave: 3},
    {key: 'A', octave: 3},
    {key: 'A#', octave: 3},
    {key: 'B', octave: 3},
    {key: 'C', octave: 4},
    {key: 'C#', octave: 4},
    {key: 'D', octave: 4},
    {key: 'D#', octave: 4},
    {key: 'E', octave: 4},
    {key: 'F', octave: 4},
    {key: 'F#', octave: 4},
    {key: 'G', octave: 4},
    {key: 'G#', octave: 4},
    {key: 'A', octave: 4},
    {key: 'A#', octave: 4},
    {key: 'B', octave: 4},
    {key: 'C', octave: 5},
    {key: 'C#', octave: 5},
    {key: 'D', octave: 5},
    {key: 'D#', octave: 5},
    {key: 'E', octave: 5},
    {key: 'F', octave: 5},
    {key: 'F#', octave: 5},
    {key: 'G', octave: 5},
    {key: 'G#', octave: 5},
    {key: 'A', octave: 5},
    {key: 'A#', octave: 5},
    {key: 'B', octave: 5},
    {key: 'C', octave: 6},
    {key: 'C#', octave: 6},
    {key: 'D', octave: 6},
    {key: 'D#', octave: 6},
    {key: 'E', octave: 6},
    {key: 'F', octave: 6},
    {key: 'F#', octave: 6},
    {key: 'G', octave: 6},
    {key: 'G#', octave: 6},
    {key: 'A', octave: 6},
    {key: 'A#', octave: 6},
    {key: 'B', octave: 6},
    {key: 'C', octave: 7},
    {key: 'C#', octave: 7},
    {key: 'D', octave: 7},
    {key: 'D#', octave: 7},
    {key: 'E', octave: 7},
    {key: 'F', octave: 7},
    {key: 'F#', octave: 7},
    {key: 'G', octave: 7},
    {key: 'G#', octave: 7},
    {key: 'A', octave: 7},
    {key: 'A#', octave: 7},
    {key: 'B', octave: 7},
    {key: 'C', octave: 8},
    {key: 'C#', octave: 8},
    {key: 'D', octave: 8},
    {key: 'D#', octave: 8},
    {key: 'E', octave: 8},
    {key: 'F', octave: 8},
    {key: 'F#', octave: 8},
    {key: 'G', octave: 8},
    {key: 'G#', octave: 8},
    {key: 'A', octave: 8},
    {key: 'A#', octave: 8},
    {key: 'B', octave: 8},
]

export const VirtualKeyboard = (props:{style?:React.CSSProperties, minNote?:InstrumentNote, maxNote?:InstrumentNote}) => {
    const [containerDim, setContainerDim] = React.useState({width: 0, height: 0}); 
    const activeNotes = useActiveNotes(); 
    const containerRef = React.useRef<HTMLDivElement>(null); 
    const {noteColors} = useNoteColors(); 

    React.useEffect(() => {
        if(!containerRef.current) return; 
        const container = (containerRef.current as HTMLDivElement); 
        const handleResize = () => {
            const {width, height} = container.getBoundingClientRect(); 
            setContainerDim({width: Math.min(width, height), height: Math.min(width, height)})
        }

        const observer = new ResizeObserver(handleResize); 
        observer.observe(container); 

        return () => observer.disconnect()
    }, [containerDim]); 

    const visibleNotes = React.useMemo(() => {
        let [l, r] = [0, notes.length]; 

        notes.forEach((n, i) => {
            if(props.minNote && props.minNote.key == n.key && props.minNote.octave == n.octave)
                l = i
            if(props.maxNote && props.maxNote.key == n.key && props.maxNote.octave == n.octave)
                r = i
        })
        return notes.filter((_, i) => l <= i && i <= r); 
    }, [props.minNote, props.maxNote]) 


    const keys = React.useMemo(() => {
        return visibleNotes.map((note, i) => {
            const isAccidental = note.key.includes("#");
            let isPressed = false; 
            
            const noteWidth = 48; 
            const accidentalWidth = noteWidth * .9
            activeNotes.forEach(n => {if(n.key == note.key && n.octave == note.octave) isPressed = true}); 

            const targetStyle:React.CSSProperties = isAccidental ? 
                {
                    color: 'white', 
                    backgroundColor: 'black', 
                    borderColor: 'black', 
                    width: noteWidth * .9,
                    height: '65%',
                    marginLeft: (-noteWidth / 2) + (noteWidth - accidentalWidth) / 2,
                    marginRight: (-noteWidth / 2) + (noteWidth - accidentalWidth) / 2,
                    zIndex: 2
                }
            :
                {
                    color: 'black', 
                    backgroundColor: 'white', 
                    borderColor: 'black', 
                    width: noteWidth,
                    marginLeft: 0, 
                    marginRight: 0
                }

            if(isPressed) {
                targetStyle.color = `${new Color(noteColors[note.key]).darken(2)}`; 
                targetStyle.borderColor = targetStyle.color; 
                targetStyle.backgroundColor = noteColors[note.key]; 
            }
            
            return <Typography key={i} style={{...styles.key, ...targetStyle}}>{note.key}{note.octave}</Typography>
        }); 
    }, [activeNotes, containerDim, visibleNotes]); 

    return (
        <Box style={{...props.style, ...styles.piano}}>
            {keys}
        </Box>
    ); 
}

const styles:StyleSheet = {
    piano: {
        position: "relative", display: 'flex', overflow: 'scroll', scrollbarWidth: 'none',
        justifyContent: 'center'
    }, 
    
    key: {
        borderBottomLeftRadius: 8, borderBottomRightRadius: 8, 
        border: 'solid 2px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', 
        padding: 8
    }, 
}


