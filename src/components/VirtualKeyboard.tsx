import { Box } from "@mui/joy";
import React from "react";
import { InstrumentNote } from "../util/midi";
import { useActiveNotes } from "../util/midi/InputManager";


type VirtualKey = {
    key:InstrumentNote, 
}

const VirtualKeyboard = () => {
    const activeNotes = useActiveNotes(); 

    return (
        <Box>
            
        </Box>
    ); 
}