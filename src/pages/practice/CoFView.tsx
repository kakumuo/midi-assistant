import React from "react";
import { ItemPane } from ".";
import { StyleSheet } from "../../util";
import { CoFDisplay } from "../../components/midi/CircleOfFifthsDisplay";

const styles:StyleSheet = {
    cof: {
        width: "auto",
        height: "auto", 
        borderRadius: '50%', 
    }
}

export const CoFView = (props: {style?:React.CSSProperties, className?:string, id?:string}) => {
    return (
        <ItemPane style={{...props.style}} className={props.className} id={props.id}> 
            <CoFDisplay style={styles.cof} />
        </ItemPane>
    ); 
} 