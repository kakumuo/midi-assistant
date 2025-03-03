import { Box, Button, Option, Select, Typography } from "@mui/joy";
import { formatDurationString, StyleSheet } from "../util";
import React from "react";
import { MainPage } from "../components/MainPage";
import { InstrumentEvent, InstrumentEventType, InstrumentNote, InstrumentNoteEvent, InstrumentNoteKey, noteDataMap } from "../util/midi";
import { identifyChord } from "../util/midi/identifyChord";
import { InstrumentInputContext, useActiveNotes } from "../util/midi/InputManager";

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
            {/* TODO: see if there is a way to avoid using textContent */}
            <Select value={scale} onChange={(e) => e && e.target && setScale((e.target as any).textContent)}>{scales.map(s => <Option key={s} value={s} label={s} children={s} />)}</Select>
            <Select value={mode} onChange={(e) => e && e.target && setMode((e.target as any).textContent)}>{modes.map(m => <Option key={m} value={m} label={m} children={m} />)}</Select>

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

const ItemPane = (props:{style?:React.CSSProperties, ref?:React.Ref<any>, children?: React.ReactNode}) => {
    return <Box ref={props.ref} style={{...props.style, border: 'solid 1px black', borderRadius: 4}}>
        {props.children}
    </Box>
}

// scale view
const ScaleView = (props:{style?:React.CSSProperties}) => {
    const activeNotes = useActiveNotes();
    const [sustain, setSustain] = React.useState(false);     

    const notesSorted = React.useMemo(() => {
        // Sort notes by pitch for consistent display
        return [...activeNotes].sort((a,b) => {
            if(a.octave !== b.octave) return a.octave - b.octave;
            const keyOrder = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
            return keyOrder.indexOf(a.key) - keyOrder.indexOf(b.key);
        });
    }, [activeNotes]);

    const displayText = React.useMemo(() => identifyChord(notesSorted), [notesSorted]); 

    return (
        <ItemPane style={{...props.style, ...styles.pane_scale}}>
            <Typography level="h1">{displayText}</Typography>
            <Box style={styles.note_list}>
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


// circle of fifths view
const CoFView = (props: {style?:React.CSSProperties}) => {
    const [containerDim, setContainerDim] = React.useState({x:0, y:0})
    const activeNotes = useActiveNotes(); 
    const ref = React.useRef(null); 

    React.useEffect(() => {
        if(!ref.current) return; 

        const resizeObserver = new ResizeObserver(() => {
            const {x, y} = (ref.current  as unknown as HTMLDivElement).getBoundingClientRect()
            setContainerDim({x, y})
        })
        
        resizeObserver.observe(ref.current)

        return () => {
            resizeObserver.disconnect(); 
        }
    }, [ref.current])
    
    const cofList:{note: InstrumentNoteKey, display: string}[] = [
        {note: InstrumentNoteKey.C, display: 'C'}, 
        {note: InstrumentNoteKey.G, display: 'G'}, 
        {note: InstrumentNoteKey.D, display: 'D'}, 
        {note: InstrumentNoteKey.A, display: 'A'}, 
        {note: InstrumentNoteKey.E, display: 'E'}, 
        {note: InstrumentNoteKey.B, display: 'B'}, 
        {note: InstrumentNoteKey.F_SHARP, display: 'Gb/F#'}, 
        {note: InstrumentNoteKey.C_SHARP, display: 'Db'}, 
        {note: InstrumentNoteKey.G_SHARP, display: 'Ab'}, 
        {note: InstrumentNoteKey.D_SHARP, display: 'Eb'}, 
        {note: InstrumentNoteKey.A_SHARP, display: 'Bb'},  
        {note: InstrumentNoteKey.F, display: 'F'},
    ];

    const cofNodes = React.useMemo(() => {
        return cofList.map((note, i) => {
            if(!ref.current) return; 
            const deg = -Math.PI/2 + ((i * 360 / cofList.length) * Math.PI / 180); 

            const {width, height} = (ref.current as HTMLDivElement).getBoundingClientRect(); 
            const dim = Math.min(width / 10, height / 5);  
            const padding = 32; 
            const {xBasis, yBasis} = {xBasis: Math.cos(deg), yBasis: Math.sin(deg)}; 
            let targetColor:string = "white"; 

            activeNotes.forEach(n => {
                if(n.key == note.note) targetColor = noteDataMap[note.note].color; 
            })

            const style:React.CSSProperties = {
                top: (yBasis * (height - dim - padding) / 2) + height / 2, 
                left: (xBasis * (width - dim - padding) / 2) + width / 2, 
                border: 'solid 1px', 
                position: 'absolute', 
                transform: `translate(-50%, -50%)`,
                width: dim, 
                height: dim, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                borderRadius: '50%', 
                backgroundColor: targetColor
            }; 

            return <Box key={note.note} style={style}><Typography>{note.display}</Typography></Box>
        })
    }, [containerDim])

    return (
        <ItemPane ref={ref} style={{...props.style, ...styles.cof_view}}> 
            {cofNodes}
        </ItemPane>
    ); 
}

// history view
const HistoryView = (props: {style?:React.CSSProperties}) => {
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

            setNoteHistory(prev => [ev.targetNote, ...prev].slice(0, historyLength)); 
        }

        inputContext.inputManager.addListener(InstrumentEventType.NOTE, handleInputChange);

        return () => {
            inputContext.inputManager.removeListener(InstrumentEventType.NOTE, handleInputChange);
        }; 
    }, [activeNotes]);

    return (
        <ItemPane style={{...props.style, ...styles.historyView}}>
            
            {/* Header */}
            <Box style={{...styles.historyHeader}}>
                <Button onClick={handleReset}>Reset</Button>
            </Box>

            {/* Main */}
            <Box style={{...styles.historyMain}}>

            </Box>

            {/* footer */}
            <Box style={{...styles.historyFooter}}>
                {noteHistory.map((note, i) => <Typography key={i}>{note.key}{note.octave}</Typography>)}
            </Box>
        </ItemPane>
    ); 
}

// stats view
const StatsView = (props: {style?:React.CSSProperties}) => {
    return (
        <ItemPane style={{...props.style}}>
            Stats View
        </ItemPane>
    ); 
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


// pane scale
    pane_scale: {
        display: 'grid', 
        gridTemplateColumns: 'auto', 
        gridTemplateRows: 'repeat(auto-fill, 1fr)',
        textAlign: 'center'
    }, 

    note_list: {
        display: 'flex',
        justifySelf: 'center', 
        gap: 8
    },

// CoF View
    cof_view:  {
        position: 'relative'
    },

// History View
    historyView: {
        display: 'grid', 
        gridTemplateRows: 'auto 1fr auto',
        gridTemplateColumns: 'auto', 
        gap: 8,
    }, 
    historyHeader: {
        display: 'flex', 
        flexDirection: "row-reverse"
    }, 
    historyFooter: {
        display: 'flex', 
        justifyContent: 'space-evenly',
        flexDirection: 'row-reverse'
    }, 
    historyMain: {

    }
}
