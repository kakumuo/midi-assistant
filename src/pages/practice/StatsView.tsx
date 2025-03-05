import React from "react";
import { ItemPane } from ".";
import { StyleSheet } from "../../util";
import { Box, Button, Checkbox, Input, Typography } from "@mui/joy";


export const StatsView = (props: {style?:React.CSSProperties}) => {
    const [tempoCaptureRate, setTempoCaptureRate] = React.useState(0); 
    const [tempoCapture, setTempoCapture] = React.useState();
    
    const tempoData = React.useMemo(() => {

    }, [])

    
    return (
        <ItemPane style={{...props.style, ...styles.container}}>

            {/* <Box>
                <Typography>Tempo</Typography>
                <Button>Reset</Button>
            </Box>
            <Box style={styles.section}>
                <Typography>Minimum</Typography>        <Typography>{tempoData.min}</Typography>
                <Typography>Maximum</Typography>        <Typography>{tempoData.max}</Typography>
                <Typography>Average</Typography>        <Typography>{tempoData.avg}</Typography>
                <Typography>Interval (# notes)</Typography>  <Input type="number" value={tempoData.interval}></Input>
            </Box>

            <Box>
                <Typography>Velocity</Typography>
                <Button>Reset</Button>
            </Box>
            <Box style={styles.section}>
                <Typography>Minimum</Typography>        <Typography>{velocityData.min}</Typography>
                <Typography>Maximum</Typography>        <Typography>{velocityData.max}</Typography>
                <Typography>Average</Typography>        <Typography>{velocityData.avg}</Typography>
                <Typography>Interval (s)</Typography>  <Input type="number" value={velocityData.interval}></Input>
            </Box>

            <Box>
                <Typography>Metrinome</Typography>
                <Button>Reset</Button>
            </Box>
            <Box style={styles.section}>
                <Typography>Toggle</Typography>             <Checkbox checked={metroData.playing}/>
                <Typography>Tempo</Typography>              <Input type="number" value={metroData.tempo} />
                <Typography>Beats Per Measure</Typography>  <Input type="number" value={metroData.bpm} />
            </Box> */}

        </ItemPane>
    ); 
} 


const styles:StyleSheet = {    
    header: {
        display: 'flex', 
    }, 
    container: {
        display: 'grid', gridTemplateColumns: 'auto auto', gridTemplateRows: 'repeat(auto-fill, 1fr)', overflowY: 'scroll',
        gap: 8, 
        rowGap: 16,
        padding: 8, 
        flex: '1 1 0'
    }, 
    resetButton: {
        marginLeft: 'auto'
    }, 
    section: {
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gridTemplateRows: 'repeat(auto-fill, 1fr)', 
        gap: 8, 
        rowGap: 8,
    }
}