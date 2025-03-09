import { Box, Button, Typography } from "@mui/joy";
import React from "react";
import { InstrumentNote, noteDataMap } from "../util/midi";
import { useActiveNotes } from "../util/midi/InputManager";
import { StyleSheet } from "../util";
import Color from "colorjs.io";
import { useNoteColors } from "../App";


type VirtualKey = {
    key:InstrumentNote, 
}

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
]

export const VirtualKeyboard = (props:{style?:React.CSSProperties}) => {
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


    const keys = React.useMemo(() => {
        return notes.map((note, i) => {
            const isAccidental = note.key.includes("#");
            let isPressed = false; 
            const {width, height} = containerDim; 

            const noteWidth = 48
            const accidentalWidth = noteWidth / 1.25

            const colors = {color: "", backgroundColor: "", borderColor: ""}
            
            activeNotes.forEach(n => {if(n.key == note.key && n.octave == note.octave) isPressed = true}); 

            if(isPressed) {
                colors.color = `${new Color(noteColors[note.key]).darken(2)}`; 
                colors.borderColor = colors.color; 
                colors.backgroundColor = noteColors[note.key]; 
            }else if (isAccidental) {
                colors.color = 'white'; 
                colors.backgroundColor = 'black'; 
                colors.borderColor = 'black';
            }else {
                colors.color = 'black'; 
                colors.backgroundColor = 'white'; 
                colors.borderColor = 'black';
            }
            

            const keyStyle:React.CSSProperties = {
                ...colors, 
                height: height / (isAccidental ? 1.75 : 1), 
                marginLeft: isAccidental ? (-1 * accidentalWidth / 2) : i == 0 ? 0 : -1,
                marginRight: isAccidental ? (-1 * accidentalWidth / 2) : -1,
                zIndex: isAccidental ? 1 : 0,
                position: 'relative', 
                minWidth: isAccidental ? accidentalWidth : noteWidth
            }

            return <Typography key={i} style={{...styles.key, ...keyStyle}}>{note.key}{note.octave}</Typography>
        }); 
    }, [activeNotes, containerDim]); 

    return (
        <Box ref={containerRef} style={{...styles.container, ...props.style}}>
            {/* keyboard */}
            <Box style={styles.piano}>
                {keys}
            </Box>
        </Box>
    ); 
}

const styles:StyleSheet = {
    container: {
        display: 'grid', gridTemplateColumns: '1fr auto', gridTemplateRows: 'auto', 
    }, 

    piano: {
        position: "relative", display: 'flex', overflow: 'scroll', scrollbarWidth: 'none'
    }, 
    
    key: {
        borderBottomLeftRadius: 8, borderBottomRightRadius: 8, border: 'solid 2px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', 
        padding: 8
    }, 

    aside: {

    }, 
}


