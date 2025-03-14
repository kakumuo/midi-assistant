import { Box, IconButton, Typography } from "@mui/joy";
import { StyleSheet } from "../../util";
import React from "react";
import { MainPage } from "../../components/MainPage";
import { VirtualKeyboard } from "../../components/VirtualKeyboard";
import SessionDurationIndicator from "./SessionDuration";

import './style.css'
import { CoFDisplay } from "../../components/midi/CircleOfFifthsDisplay";
import { useActiveChords } from "../../util/midi/InputManager";
import { Metronome } from "./Metronome";
import { VelocityView } from "./VelocityView";
import { TempoView } from "./TempoView";
import { ScaleView } from "./ScaleView";


export const PracticePage = () => {
    const activeChords = useActiveChords(); 

    return <MainPage style={styles.container}>
        {/* Header */}
        <Box style={styles.header}>
            <SessionDurationIndicator />
        </Box>

        <Box style={styles.content}>
            <Typography level="h1">{activeChords.join(" or ")}</Typography>
            <CoFDisplay style={{width: '100%', aspectRatio: '1/1'}} rootKey="C"  />
            <Metronome />    
            <VelocityView style={{border: 'solid'}} />   
            <TempoView style={{border: 'solid'}}  />
            <ScaleView style={{border: 'solid'}} />
        </Box>

        <VirtualKeyboard style={{height: 'auto'}} minNote={{key: 'C', octave: 3}} maxNote={{key: 'C', octave: 6}} />
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
        gridTemplateRows: '10% 70% 20%', 
        maxHeight: '100%',
        height: '100%', 
    }, 
    content: {
        display: 'grid',
        position: 'relative', 
        gridTemplateColumns: '1fr 1fr 1fr', 
        gridTemplateRows: 'auto auto', 
        justifyContent: 'center',
        alignItems: 'center',
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
