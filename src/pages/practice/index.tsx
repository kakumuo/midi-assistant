import { Box } from "@mui/joy";
import { StyleSheet } from "../../util";
import React from "react";
import { MainPage } from "../../components/MainPage";
import { VirtualKeyboard } from "../../components/VirtualKeyboard";
import SessionDurationIndicator from "./SessionDuration";
import { ChordView } from "./ChordView";
import { StatsView } from "./StatsView";

import './style.css'

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
            <SessionDurationIndicator />
        </Box>

        <Box id="practice-maincontent">
            <ChordView id="chordview"/>
            {/* <CoFView id="cofview" /> */}
            <StatsView id="statsview" />
        </Box>

        <VirtualKeyboard style={{height: 150}} />

    </MainPage>
}

export const ItemPane = (props:{style?:React.CSSProperties, className?:string, id?:string, ref?:React.Ref<any>, children?: React.ReactNode}) => {
    return <Box ref={props.ref} style={{...props.style, borderRadius: 4}} className={props.className} id={props.id}>
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
}
