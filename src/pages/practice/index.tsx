import { Box, Button, Option, Select, Typography } from "@mui/joy";
import { formatDurationString, StyleSheet } from "../../util";
import React from "react";
import { MainPage } from "../../components/MainPage";
import { InstrumentEvent, InstrumentEventType, InstrumentNote, InstrumentNoteEvent, InstrumentNoteKey, noteDataMap } from "../../util/midi";
import { identifyChord } from "../../util/midi/identifyChord";
import { InstrumentInputContext, useActiveNotes } from "../../util/midi/InputManager";
import Color from "colorjs.io";
import { ChordView } from "./ChordView";
import { HistoryView } from "./HistoryView";
import { CoFView } from "./CoFView";
import { StatsView } from "./StatsView";
import { VirtualKeyboard } from "../../components/VirtualKeyboard";
import SessionDurationIndicator from "./SessionDuration";

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
    const [scale, setScale] = React.useState(scales[0]); 
    const [mode, setMode] = React.useState(modes[0]); 

    return <MainPage style={styles.container}>
        {/* Header */}
        <Box style={styles.header}>
            <Select value={scale} onChange={(e) => e && e.target && setScale((e.target as any).textContent)}>
                {scales.map(s => <Option key={s} value={s} label={s} children={s} />)}
            </Select>
            <Select value={mode} onChange={(e) => e && e.target && setMode((e.target as any).textContent)}>
                {modes.map(m => <Option key={m} value={m} label={m} children={m} />)}
            </Select>
            <SessionDurationIndicator />
        </Box>

        {/* main content */}
        <Box style={styles.mainContent}>
            <ChordView style={{...styles.pane_tl, width: 'auto'}} />
            <StatsView style={styles.pane_br} />
            <HistoryView style={styles.pane_bl} />
            <CoFView style={styles.pane_tr} />
        </Box>

        {/* <VirtualKeyboard /> */}
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
        gridTemplateRows: 'auto 1fr 1fr', 
        overflow: 'auto'
    }, 
    page: {
        border: 'solid 1px red',
        backgroundColor: 'lightgray'
    }, 
    header: {
        display: 'flex',
        flexDirection: 'row',
        padding: 8
    }, 
    mainContent: {
        display: 'grid',
        gridTemplateColumns: '50% 50%', 
        gridTemplateRows: 'minmax(auto, 50%) minmax(auto, 50%)',
        gap: 8, 
    },
}
