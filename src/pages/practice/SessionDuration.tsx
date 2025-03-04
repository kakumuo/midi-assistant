import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/joy";
import { StyleSheet } from "../../util";

const styles:StyleSheet = {
    container: {
        marginLeft: 'auto', 
        width: 200
    }
}

const enum IndicatorState {
    DURATION, TIMER
}

const SessionDurationIndicator = () => {
    const [duration, setDuration] = React.useState(0);
    const [paused, setPaused] = React.useState(false); 
    const [durationInterval, setDurationInterval] = React.useState<NodeJS.Timeout | undefined>(); 
    const [indicatorState, setIndiciatorState] = React.useState<IndicatorState>(IndicatorState.DURATION); 

    const style:React.CSSProperties = {
        backgroundColor: paused ? 'gray' : 'Highlight'
    }

    const displayText = React.useMemo(() => {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = duration % 60;
        let result = '';
        if (hours > 0) result += `${hours}h `;
        if (minutes > 0) result += `${minutes}m `;
        result += `${seconds}s`;
        return result;
    }, [duration])
     
    React.useEffect(() => {
        let interval = setInterval(() => !paused && setDuration(duration + 1), 1000); 
        setDurationInterval(interval); 
        return () => clearInterval(interval); 
    }, [duration, paused]); 

    return (
        <Button onClick={() => setPaused(p => !p)} style={{...styles.container, ...style}}>Duration: {displayText}</Button>
    );
};

export default SessionDurationIndicator; 