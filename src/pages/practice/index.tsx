import { Box, IconButton, Option, Select, Typography } from "@mui/joy";
import { StyleSheet } from "../../util";
import React from "react";
import { MainPage } from "../../components/MainPage";
import { VirtualKeyboard } from "../../components/VirtualKeyboard";
import SessionDurationIndicator from "./SessionDuration";

import './style.css'
import { CoFDisplay } from "../../components/midi/CircleOfFifthsDisplay";
import { Metronome } from "./Metronome";
import { VelocityView } from "./VelocityView";
import { TempoView } from "./TempoView";
import { ScaleView } from "./ScaleView";
import { InstrumentNote } from "../../util/midi";
import { ChordText } from "./ChordText";

const keyOptions: InstrumentNote['key'][] = [
    "C" , "C#" , "D" , "D#" , "E" , "F" , "F#" , "G" , "G#" , "A" , "A#" , "B"
]

const modeOptions:string[] = [
    'Major', 
    'Relative Minor'
]

export const PracticePage = () => {
    const [modeOption, setModeOption] = React.useState(modeOptions[0]);
    const [keyOption, setKeyOption] = React.useState(keyOptions[0]);

    return <MainPage style={styles.container}>
        {/* Header */}
        <Box style={styles.header}>
            <Select value={keyOption}>{keyOptions.map(k => <Option onClick={e => setKeyOption(k)} label={k} value={k} key={k} children={k} />)}</Select>
            <Select value={modeOption}>{modeOptions.map(m => <Option onClick={e => setModeOption(m)} label={m} value={m} key={m} children={m} />)}</Select>
            <SessionDurationIndicator />
        </Box>

        <Box style={styles.content}>
            <ChordText style={{gridArea: '1 / 1 / span 1 / span 1'}} />
            <ScaleView style={{gridArea: '2 / 1 / span 2 / span 1', height: '100%', width: '100%'}} key={keyOption} />


            <Box style={{gridArea: '1 / 3 / span 1 / span 1'}} />    
            <VelocityView outerStyle={{gridArea: '2 / 3 / span 1 / span 1'}} />
            <TempoView    outerStyle={{gridArea: '3 / 3 / span 1 / span 1'}}  />

            <CoFDisplay style={{gridArea: '1 / 2 / span 3 / span 1', aspectRatio: '1/1', width: '500px', justifySelf: 'center', alignSelf: 'center'}} rootKey={keyOption} mode={modeOption}/>
        </Box>

        <VirtualKeyboard style={{height: 'auto'}} minNote={new InstrumentNote('C', 3)} maxNote={new InstrumentNote('C', 6)} />
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
        gridTemplateRows: 'auto 1fr 15%', 
        maxHeight: '100%',
        height: '100%', 
    }, 
    content: {
        display: 'grid',
        position: 'relative', 
        gridTemplateColumns: '20% auto 20%', 
        gridTemplateRows: '10% auto auto', 
        justifyContent: 'center',
        alignContent: 'center',
        gap: 8,
    },
    metronomeBtn: {
        position: 'absolute', 
        bottom: 0, 
        right: 0, 
        margin: 8, 
        width: '5vw', 
        height: '5vw'
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
