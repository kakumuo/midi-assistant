import React, { useEffect, useState } from "react";
import { Box, Button, colors, Dropdown, IconButton, ListDivider, Menu, MenuButton, MenuItem, Typography } from "@mui/joy";
import { formatDurationString, StyleSheet } from "../../util";
import { LockClockOutlined, MoreTime, PlusOne, Timer, Timer10, Timer3SelectSharp, TimerOutlined } from "@mui/icons-material";
import { duration } from "@mui/material";
import Color from "colorjs.io";

const styles:StyleSheet = {
    container: {
        marginLeft: 'auto', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-evenly', 
        gap: 8
    }
}

const enum IndicatorState {
    DURATION, TIMER
}

const SessionDurationIndicator = () => {
    const [duration, setDuration] = React.useState(0);
    const [paused, setPaused] = React.useState(false); 
    const [indicatorState, setIndiciatorState] = React.useState<IndicatorState>(IndicatorState.DURATION); 
    const [timerTimeout, setTimerTimeout] = React.useState<NodeJS.Timeout | undefined>(); 
    const [timerRemainingMax, setTimerRemainingMax] = React.useState(0); 
    const [timerRemaining, setTimerRemaining] = React.useState(0); 

    const style = React.useMemo<React.CSSProperties>(() => {
        const progress = (timerRemaining / timerRemainingMax) * 100;
        let background = ""; 

        const isLow = timerRemaining / timerRemainingMax < .3;
        const targetColor = paused ? 'gray' : isLow ? 'red' : 'green'
        const bkgColor = new Color(targetColor).lighten(.2); 
        
        if(indicatorState == IndicatorState.DURATION)
            background = paused ? 'gray' : 'blue'
        else {
            // FIXME: gradient stops half way
            background = `linear-gradient(to left, ${targetColor} ${progress}%, ${bkgColor} ${progress}%)`;
        }
        
        return {
            background,
            width: 200, 
            transition: 'background-color background .2s'
        };
    }, [timerRemaining, timerRemainingMax, paused]);
    
   const handleTimerIncrease = (dur:number) => {
        setIndiciatorState(IndicatorState.TIMER); 

        const timeout = setTimeout(() => {
            setIndiciatorState(IndicatorState.DURATION); 
            setTimerTimeout(undefined);            
        }, (timerRemaining + dur) * 1000); 

        setTimerRemaining(t => t + dur); 
        setTimerRemainingMax(timerRemaining + dur); 

        setTimerTimeout(timeout); 

        return () => {
            if(!timerTimeout) return; 
            clearTimeout(timerTimeout); 
            setTimerTimeout(undefined); 
        }
   }

   const handleReset = () => {
        if(indicatorState == IndicatorState.DURATION) setDuration(0); 
        else {
            setIndiciatorState(IndicatorState.DURATION); 
            setTimerRemaining(0); 
            setTimerRemainingMax(0); 
            clearTimeout(timerTimeout); 
            setTimerTimeout(undefined); 
        }
   }

    React.useEffect(() => {
        let interval = setInterval(() => {
            if(paused) return; 

            if(indicatorState == IndicatorState.TIMER)
                setTimerRemaining(t => t - 1); 
            setDuration(d => d + 1); 

        }, 1000); 
        return () => clearInterval(interval); 
    }, [duration, paused, indicatorState]); 

    
    const displayText = React.useMemo(() => {
        const target = indicatorState == IndicatorState.DURATION ? duration : timerRemaining; 
        return (indicatorState == IndicatorState.TIMER ? "Timer: " : "Duration: ") + formatDurationString(target);
    }, [duration, timerRemaining]); 
     

    return (
        <Box style={styles.container}>
            <Button onClick={() => setPaused(p => !p)} onDoubleClick={handleReset} style={style} >{displayText}</Button>
            <Dropdown>
                <MenuButton>{indicatorState == IndicatorState.DURATION ? <TimerOutlined /> : <MoreTime />}</MenuButton>
                <Menu onChange={(e) => console.log(e)}>
                    {[.5, 5, 10, 15, 20].map(n => <MenuItem key={n} onClick={() => handleTimerIncrease(n * 60)}>{n} minutes</MenuItem>)}
                </Menu>
            </Dropdown>
        </Box>
    );
};

export default SessionDurationIndicator; 