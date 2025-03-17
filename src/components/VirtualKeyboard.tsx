import { Box, Button, colors, Typography } from "@mui/joy";
import React from "react";
import { InstrumentNote } from "../util/midi";
import { useActiveNotes } from "../util/midi/InputManager";
import { StyleSheet } from "../util";
import Color from "colorjs.io";
import { useNoteColors } from "../App";


const notes:InstrumentNote[] = [
    new InstrumentNote('C', 2),
    new InstrumentNote('C#', 2),
    new InstrumentNote('D', 2),
    new InstrumentNote('D#', 2),
    new InstrumentNote('E', 2),
    new InstrumentNote('F', 2),
    new InstrumentNote('F#', 2),
    new InstrumentNote('G', 2),
    new InstrumentNote('G#', 2),
    new InstrumentNote('A', 2),
    new InstrumentNote('A#', 2),
    new InstrumentNote('B', 2),
    new InstrumentNote('C', 3),
    new InstrumentNote('C#', 3),
    new InstrumentNote('D', 3),
    new InstrumentNote('D#', 3),
    new InstrumentNote('E', 3),
    new InstrumentNote('F', 3),
    new InstrumentNote('F#', 3),
    new InstrumentNote('G', 3),
    new InstrumentNote('G#', 3),
    new InstrumentNote('A', 3),
    new InstrumentNote('A#', 3),
    new InstrumentNote('B', 3),
    new InstrumentNote('C', 4),
    new InstrumentNote('C#', 4),
    new InstrumentNote('D', 4),
    new InstrumentNote('D#', 4),
    new InstrumentNote('E', 4),
    new InstrumentNote('F', 4),
    new InstrumentNote('F#', 4),
    new InstrumentNote('G', 4),
    new InstrumentNote('G#', 4),
    new InstrumentNote('A', 4),
    new InstrumentNote('A#', 4),
    new InstrumentNote('B', 4),
    new InstrumentNote('C', 5),
    new InstrumentNote('C#', 5),
    new InstrumentNote('D', 5),
    new InstrumentNote('D#', 5),
    new InstrumentNote('E', 5),
    new InstrumentNote('F', 5),
    new InstrumentNote('F#', 5),
    new InstrumentNote('G', 5),
    new InstrumentNote('G#', 5),
    new InstrumentNote('A', 5),
    new InstrumentNote('A#', 5),
    new InstrumentNote('B', 5),
    new InstrumentNote('C', 6),
    new InstrumentNote('C#', 6),
    new InstrumentNote('D', 6),
    new InstrumentNote('D#', 6),
    new InstrumentNote('E', 6),
    new InstrumentNote('F', 6),
    new InstrumentNote('F#', 6),
    new InstrumentNote('G', 6),
    new InstrumentNote('G#', 6),
    new InstrumentNote('A', 6),
    new InstrumentNote('A#', 6),
    new InstrumentNote('B', 6),
    new InstrumentNote('C', 7),
    new InstrumentNote('C#', 7),
    new InstrumentNote('D', 7),
    new InstrumentNote('D#', 7),
    new InstrumentNote('E', 7),
    new InstrumentNote('F', 7),
    new InstrumentNote('F#', 7),
    new InstrumentNote('G', 7),
    new InstrumentNote('G#', 7),
    new InstrumentNote('A', 7),
    new InstrumentNote('A#', 7),
    new InstrumentNote('B', 7),
    new InstrumentNote('C', 8),
    new InstrumentNote('C#', 8),
    new InstrumentNote('D', 8),
    new InstrumentNote('D#', 8),
    new InstrumentNote('E', 8),
    new InstrumentNote('F', 8),
    new InstrumentNote('F#', 8),
    new InstrumentNote('G', 8),
    new InstrumentNote('G#', 8),
    new InstrumentNote('A', 8),
    new InstrumentNote('A#', 8),
    new InstrumentNote('B', 8),
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
                    fontWeight: note.key == 'C' ? 'bold' : 'normal',
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


