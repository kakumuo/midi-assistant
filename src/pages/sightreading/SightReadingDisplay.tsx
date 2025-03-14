import { Box } from "@mui/joy";
import React from "react";
import { StyleSheet } from "../../util";

const styles:StyleSheet = {
    container: {
        border: 'solid', 
    }
}

type HitData = {
    time: number, 
    success: 0 | 1 | -1,
}

export const SightReadingDisplay = (props: { style?: React.CSSProperties }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    return <Box>
        <div id="output" ref={containerRef} style={{...styles.container, ...props.style }} />
    </Box>
}
