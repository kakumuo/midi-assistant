import { Box, Typography } from "@mui/joy";
import React from "react";
import { identifyChord } from "../../util/midi/identifyChord";
import { useActiveNotes } from "../../util/midi/InputManager";
import { noteDataMap } from "../../util/midi";
import { ItemPane } from ".";
import { StyleSheet } from "../../util";
import { ScaleDisplay } from "../../components/midi/ScaleDisplay";
import { Chip } from "@mui/material";
import Color from "colorjs.io";


const styles:StyleSheet = {
    container: {
        textAlign: 'center',
        display: 'flex', 
        flexDirection: 'column',
        flex: '1 1', 
        padding: 8,
    }, 
    notelist: {
        display: 'flex', justifySelf: 'center', gap: 8, 
        justifyContent: 'center'
    }
}

export const ChordView = (props:{style?:React.CSSProperties}) => {
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
            <Box style={styles.notelist}>
                {notesSorted.map((note) => <Chip 
                    key={note.key + note.octave} 
                    label={`${note.key}${note.octave}`} 
                    style={{
                        color: new Color(noteDataMap[note.key].color).darken(.5) + "", 
                        backgroundColor: noteDataMap[note.key].color, 
                        fontWeight: 'bold', 
                        border: 'solid 2px'
                    }} 
                />)}
            </Box>
            <ScaleDisplay style={{width: '100%', height: 300, marginTop: 'auto'}} />
        </ItemPane>
    );
}
