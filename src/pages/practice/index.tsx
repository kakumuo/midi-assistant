import { Box, Button, Option, Select, Typography } from "@mui/joy";
import { StyleSheet } from "../../util";
import React from "react";
import { MainPage } from "../../components/MainPage";
import { VirtualKeyboard } from "../../components/VirtualKeyboard";
import SessionDurationIndicator from "./SessionDuration";
import { CoFDisplay } from "../../components/midi/CircleOfFifthsDisplay";
import { ChordView } from "./ChordView";
import { StatsView } from "./StatsView";
import { CoFView } from "./CoFView";

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
            {/* <Select value={scale} onChange={(e) => e && e.target && setScale((e.target as any).textContent)}>
                {scales.map(s => <Option key={s} value={s} label={s} children={s} />)}
            </Select>
            <Select value={mode} onChange={(e) => e && e.target && setMode((e.target as any).textContent)}>
                {modes.map(m => <Option key={m} value={m} label={m} children={m} />)}
            </Select> */}
            <SessionDurationIndicator />
        </Box>

        <Box style={styles.mainContent}>
            <CoFView />
            <ChordView />
            <StatsView />
        </Box>

        <VirtualKeyboard style={{height: 150}} />

    </MainPage>
}

export const ItemPane = (props:{style?:React.CSSProperties, ref?:React.Ref<any>, children?: React.ReactNode}) => {
    return <Box ref={props.ref} style={{...props.style, borderRadius: 4}}>
        {props.children}
    </Box>
}

const styles:StyleSheet = {
    container: {
        display: 'grid',
        gridTemplateColumns: 'auto', 
        gridTemplateRows: 'auto 1fr auto', 
        maxHeight: '100%',
        height: '100%', 
    }, 
    page: {
        border: 'solid 1px red',
        backgroundColor: 'lightgray'
    }, 
    header: {
        display: 'flex',
        flexDirection: 'row',
        padding: 8, 
        gap: 16,
    }, 
    mainContent: {
        display: 'flex',
        flexDirection: 'row', 
        gap: 8, 
        padding: 8
    },
}
