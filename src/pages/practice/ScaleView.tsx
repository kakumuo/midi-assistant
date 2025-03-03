import { Box, Typography } from "@mui/joy";
import React from "react";
import { identifyChord } from "../../util/midi/identifyChord";
import { useActiveNotes } from "../../util/midi/InputManager";
import { noteDataMap } from "../../util/midi";
import { ItemPane } from ".";
import { StyleSheet } from "../../util";


const styles:StyleSheet = {
    container: {
        display: 'grid', gridTemplateColumns: 'auto', gridTemplateRows: 'repeat(auto-fill, 1fr)', textAlign: 'center'
    }, 
    main: {
        display: 'flex', justifySelf: 'center', gap: 8
    }
}

export const ScaleView = (props:{style?:React.CSSProperties}) => {
    const activeNotes = useActiveNotes();
    const [sustain, setSustain] = React.useState(false);     

    const notesSorted = React.useMemo(() => {
        return [...activeNotes].sort((a,b) => {
            if(a.octave !== b.octave) return a.octave - b.octave;
            const keyOrder = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
            return keyOrder.indexOf(a.key) - keyOrder.indexOf(b.key);
        });
    }, [activeNotes]);

    const displayText = React.useMemo(() => identifyChord(notesSorted), [notesSorted]); 

    return (
        <ItemPane style={{...props.style, ...styles.container}}>
            <Typography level="h1">{displayText}</Typography>
            <Box style={styles.main}>
                {notesSorted.map((note) => (
                    <Typography key={note.key + note.octave} level="body-xs" style={{ color: noteDataMap[note.key].color, fontWeight: 'bold' }}>
                        {`${note.key}${note.octave}`}
                    </Typography>
                ))}
            </Box>
            <Typography level="body-xs">Sustain: {sustain ? "On" : "Off"}</Typography>
        </ItemPane>
    );
}
