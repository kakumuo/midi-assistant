import { Box, Button, Typography } from "@mui/joy";
import React from "react";
import { InstrumentEvent, InstrumentEventType, InstrumentNote, InstrumentNoteEvent } from "../../util/midi";
import { InstrumentInputContext, useActiveNotes } from "../../util/midi/InputManager";
import { ItemPane } from ".";
import { StyleSheet } from "../../util";

const styles:StyleSheet = {
    container: {display: 'grid', gridTemplateRows: 'auto 1fr auto', gridTemplateColumns: 'auto', gap: 8}, 
    header: {display: 'flex', flexDirection: "row-reverse"}, 
    main: {}, 
    footer: {display: 'flex', gap: 16, flexDirection: 'row-reverse'}
}

export const HistoryView = (props: {style?:React.CSSProperties}) => {
    const historyLength = 10; 
    const [noteHistory, setNoteHistory] = React.useState<InstrumentNote[]>([]); 
    const activeNotes = useActiveNotes(); 
    const inputContext = React.useContext(InstrumentInputContext);

    const handleReset = () => {
        setNoteHistory([])
    }

    React.useEffect(() => {
        const handleInputChange = (e:InstrumentEvent) => {
            const ev = (e as InstrumentNoteEvent); 
            if(!ev.isPressed) return; 
            setNoteHistory(prev => [ev.note, ...prev].slice(0, historyLength)); 
        }

        inputContext.inputManager.addListener(InstrumentEventType.NOTE, handleInputChange);
        return () => {
            inputContext.inputManager.removeListener(InstrumentEventType.NOTE, handleInputChange);
        }; 
    }, [activeNotes]);

    return (
        <ItemPane style={{...props.style, ...styles.container}}>
            <Box style={styles.header}>
                <Button onClick={handleReset}>Reset</Button>
            </Box>

            <Box style={styles.main}>
                {/* Main content */}
            </Box>

            <Box style={styles.footer}>
                {noteHistory.map((note, i) => <Typography key={i}>{note.key}{note.octave}</Typography>)}
            </Box>
        </ItemPane>
    ); 
} 