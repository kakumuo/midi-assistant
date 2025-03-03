import { Box, Button, Option, Select, Typography } from "@mui/joy";
import { formatDurationString, StyleSheet } from "../../util";
import React from "react";
import { MainPage } from "../../components/MainPage";
import { InstrumentEvent, InstrumentEventType, InstrumentNote, InstrumentNoteEvent, InstrumentNoteKey, noteDataMap } from "../../util/midi";
import { identifyChord } from "../../util/midi/identifyChord";
import { InstrumentInputContext, useActiveNotes } from "../../util/midi/InputManager";
import Color from "colorjs.io";
import { ScaleView } from "./ScaleView";
import { HistoryView } from "./HistoryView";
import { CoFView } from "./CoFView";
import { StatsView } from "./StatsView";

const modes = [
    "Major",
    "Natural Minor",
    "Harmonic Minor",
    "Melodic Minor",
    "Dorian",
    "Phrygian", 
    "Lydian",
    "Mixolydian",
    "Locrian",
    "Pentatonic Major",
    "Pentatonic Minor",
    "Blues"
]

const scales = [
    "C",
    "C#/Db",
    "D",
    "D#/Eb", 
    "E",
    "F",
    "F#/Gb",
    "G",
    "G#/Ab",
    "A", 
    "A#/Bb",
    "B"
]

export const PracticePage = () => {
    const [sessionsStartTS, setSessionsStartTS] = React.useState(new Date()); 
    const [durationString, setDurationString] = React.useState(formatDurationString(sessionsStartTS))
    const [scale, setScale] = React.useState(scales[0]); 
    const [mode, setMode] = React.useState(modes[0]); 

    React.useEffect(() => {
        const interval = setInterval(() => setDurationString(formatDurationString(sessionsStartTS)), 1000);
        return () => clearInterval(interval);
    }, [sessionsStartTS]);

    return <MainPage style={styles.container}>
        {/* Header */}
        <Box style={styles.header}>
            <Select value={scale} onChange={(e) => e && e.target && setScale((e.target as any).textContent)}>
                {scales.map(s => <Option key={s} value={s} label={s} children={s} />)}
            </Select>
            <Select value={mode} onChange={(e) => e && e.target && setMode((e.target as any).textContent)}>
                {modes.map(m => <Option key={m} value={m} label={m} children={m} />)}
            </Select>
            <Button style={styles.sessiondur_button}>Session Duration: {durationString}</Button>
        </Box>

        {/* main content */}
        <Box style={styles.mainContent}>
            <ScaleView style={{...styles.pane_tl, width: 'auto'}} />
            <CoFView style={styles.pane_tr} />
            <HistoryView style={styles.pane_bl} />
            <StatsView style={styles.pane_br} />
        </Box>
    </MainPage>
}

export const ItemPane = (props:{style?:React.CSSProperties, ref?:React.Ref<any>, children?: React.ReactNode}) => {
    return <Box ref={props.ref} style={{...props.style, border: 'solid 1px black', borderRadius: 4}}>
        {props.children}
    </Box>
}

const styles:StyleSheet = {
    container: {
        display: 'grid', 
        gridTemplateColumns: 'auto', 
        gridTemplateRows: 'auto 1fr'
    }, 
    page: {
        border: 'solid 1px red',
        backgroundColor: 'lightgray'
    }, 
    header: {
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        padding: 8
    }, 
    sessiondur_button: {
        marginLeft: 'auto', 
    }, 
    mainContent: {
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gridTemplateRows: '1fr 300px',
        height: '100%', 
        gap: 8, 
    },
}
