import { Box, Typography } from "@mui/joy";
import React from "react";
import { identifyChord } from "../../util/midi/identifyChord";
import { useActiveNotes } from "../../util/midi/InputManager";
import { InstrumentNote, InstrumentNoteKey, noteDataMap } from "../../util/midi";
import { ItemPane } from ".";
import { StyleSheet } from "../../util";
import { ScaleDisplay } from "../../components/midi/ScaleDisplay";
import { Chip } from "@mui/material";
import Color from "colorjs.io";


const styles:StyleSheet = {
    notelist: {
        display: 'flex', justifySelf: 'center', gap: 8, 
        justifyContent: 'center'
    }
}

const keyOrder:InstrumentNote['key'][] = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const ChordView = (props:{style?:React.CSSProperties, className?:string, id?:string}) => {
    const activeNotes = useActiveNotes();
    const [sustain, setSustain] = React.useState(false);     

    const notesSorted = React.useMemo(() => {
        return [...activeNotes].sort((a,b) => {
            if(a.octave !== b.octave) return a.octave - b.octave;
            return keyOrder.indexOf(a.key) - keyOrder.indexOf(b.key);
        });
    }, [activeNotes]);

    const displayText = React.useMemo(() => identifyChord(notesSorted), [notesSorted]); 

    const playedNotes = () => {
        return keyOrder.map((key) => {

            let backgroundColor:string = ""; 
            let color:string = "";     
            let hasNote:boolean = false; 

            activeNotes.forEach(note => {if(note.key == key) hasNote = true}); 

            if(!hasNote){
                backgroundColor = 'white'; 
                color = new Color(noteDataMap[key].color).lighten(.05).toString(); 
            }else {
                color = new Color(noteDataMap[key].color).darken(.5).toString(); 
                backgroundColor = noteDataMap[key].color; 
            }

            return <Chip 
                key={key} 
                label={key} 
                style={{
                    color, 
                    backgroundColor, 
                    fontWeight: 'bold', 
                    border: 'solid 2px'
                }} 
        />
        }); 
    }


    return (
        <ItemPane style={{...props.style}} className={props.className} id={props.id}>
            <Typography level="h1">{displayText}</Typography>
            <Box style={styles.notelist}>
                {playedNotes()}
            </Box>
            <ScaleDisplay style={{width: '100%', height: 300, marginTop: 'auto'}} />
        </ItemPane>
    );
}
