import React from "react";
import { useActiveChords } from "../../util/midi/InputManager";
import { Box, Typography } from "@mui/joy";


export const ChordText = (props:{style?:React.CSSProperties}) => {
    const activeChords = useActiveChords(); 

    return <Box style={props.style}>
        {activeChords.map(c => <Typography level="h1">{c}</Typography>)}
    </Box>
    }