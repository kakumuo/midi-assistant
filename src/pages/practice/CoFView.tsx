import { Box } from "@mui/joy";
import React from "react";
import Color from "colorjs.io";
import { InstrumentNoteKey, noteDataMap } from "../../util/midi";
import { useActiveNotes } from "../../util/midi/InputManager";
import { ItemPane } from ".";
import { StyleSheet } from "../../util";
import { CoFDisplay } from "../../components/midi/CircleOfFifthsDisplay";

const styles:StyleSheet = {
    container: {display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '1 1 0'},
    cof: {
        width: "100%",
        height: "auto", 
        borderRadius: '50%', 
    }
}

export const CoFView = (props: {style?:React.CSSProperties}) => {
    return (
        <ItemPane style={{...props.style, ...styles.container}}> 
            <CoFDisplay style={styles.cof} />
        </ItemPane>
    ); 
} 