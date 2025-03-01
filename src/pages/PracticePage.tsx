import { Box, Button, Option, Select, Typography } from "@mui/joy";
import { formatDurationString, StyleSheet } from "../util";
import React, { CSSProperties } from "react";
import { MainPage } from "../components/MainPage";
import { AppContext } from "../App";
import { ChordType, InstrumentKey, InstrumentKeyEvent, InstrumentNote, IntervalType } from "../util/midi";
import { identifyChord } from "../util/midi/identifyChord";

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
        setInterval(() => setDurationString(formatDurationString(sessionsStartTS)), 1000)
    }, [])

    return <MainPage style={styles.container}>
        {/* Header */}
        <Box style={styles.header}>
            {/* TODO: see if there is a way to avoid using textContent */}
            <Select value={scale} onChange={(e) => e && e.target && setScale((e.target as any).textContent)}>{scales.map(s => <Option key={s} value={s} label={s} children={s} />)}</Select>
            <Select value={mode} onChange={(e) => e && e.target && setMode((e.target as any).textContent)}>{modes.map(m => <Option key={m} value={m} label={m} children={m} />)}</Select>

            <Button style={styles.sessiondur_button}>Session Duration: {durationString}</Button>
        </Box>

        {/* main content */}
        <Box style={styles.mainContent}>
            <Pane_ScaleView style={{...styles.pane_tl, width: 'auto'}} />
            <ItemPane style={styles.pane_tr} />
            <ItemPane style={styles.pane_bl} />
            <ItemPane style={styles.pane_br} />
        </Box>
    </MainPage>
}

const ItemPane = (props:{style?:React.CSSProperties, children?: React.ReactNode}) => {
    return <Box style={{...props.style, border: 'solid 1px black', borderRadius: 4}}>
        {props.children}
    </Box>
}
const Pane_ScaleView = (props:{style?:React.CSSProperties}) => {
    const [notes, setNotes] = React.useState<InstrumentNote[]>([])
    const [sustain, setSustain] = React.useState(false); 
    const appData = React.useContext(AppContext); 

    React.useEffect(() => {
        if(!appData.instrument) return; 

        const handleMessage = (e:InstrumentKeyEvent) => {
            if(!e.targetNote) return; 
            if(e.isPressed) {
                setNotes(prev => [...prev, e.targetNote!]) 
            } else {
                setNotes(prev => prev.filter(n => n !== e.targetNote))
            }
        }

        appData.instrument.addMessageListener(handleMessage);
    }, [])

    const notesSorted = React.useMemo(() => {
        // Sort notes by pitch for consistent display
        return [...notes].sort((a,b) => {
            if(a.octave !== b.octave) return a.octave - b.octave;
            const keyOrder = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
            return keyOrder.indexOf(a.key) - keyOrder.indexOf(b.key);
        });
    }, [notes]);

    const displayText = React.useMemo(() => identifyChord(notesSorted), [notesSorted])

    return (
        <ItemPane style={{...props.style, ...styles.pane_scale}}>
            <Typography level="h1">{displayText}</Typography>
            <Typography level="body-sm">{notesSorted.map(n => `${n.key}${n.octave}`).join(" - ")}</Typography>
            <Typography level="body-xs">Sustain: {sustain ? "On" : "Off"}</Typography>
        </ItemPane>
    )
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
        gridTemplateAreas: `
        ". . . . . ."
        ". . . . . ."
        ". . . . . ."
        ". . . . . ."
        `, 
        gap: 8, 
        height: '1fr'
    },
    
    pane_tl: {
        gridArea: '1 / 1 / span 2 / span 3', 
    },
    pane_tr: {
        gridArea: '1 / 4 / span 2 / span 3',
    },
    pane_bl: {
        gridArea: '3 / 1 / span 2 / span 3',
    },
    pane_br: {
        gridArea: '3 / 4 / span 2 / span 3',
    }, 

    pane_scale: {
        display: 'grid', 
        gridTemplateColumns: 'auto', 
        gridTemplateRows: 'repeat(auto-fill, 1fr)',
        textAlign: 'center'
    }
}
