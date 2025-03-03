import React from "react";
import { ItemPane } from ".";
import { StyleSheet } from "../../util";
import { Box, Button, Checkbox, Input, Typography } from "@mui/joy";


export const StatsView = (props: {style?:React.CSSProperties}) => {
    const [tempoData, setTempoData]         = React.useState({min: 0, max: 0, avg: 0, interval: 4});
    const [velocityData, setVelocityData]   = React.useState({min: 0, max: 0, avg: 0, interval: 4});
    const [metroData, setMetroData]         = React.useState({playing: false, tempo: 80, bpm: 4});
    
    return (
        <ItemPane style={{...props.style, ...styles.container}}>

        {/* Main */}
        <Box style={styles.main}>
            <Box>
                <Typography>Tempo</Typography>
                <Button>Reset</Button>
            </Box>
            <Box style={styles.section}>
                <Typography>Minimum</Typography>        <Typography>{tempoData.min}</Typography>
                <Typography>Maximum</Typography>        <Typography>{tempoData.max}</Typography>
                <Typography>Average</Typography>        <Typography>{tempoData.avg}</Typography>
                <Typography>Note Interval</Typography>  <Input type="number" value={tempoData.interval}></Input>
            </Box>

            <Box>
                <Typography>Velocity</Typography>
                <Button>Reset</Button>
            </Box>
            <Box style={styles.section}>
                <Typography>Minimum</Typography>        <Typography>{velocityData.min}</Typography>
                <Typography>Maximum</Typography>        <Typography>{velocityData.max}</Typography>
                <Typography>Average</Typography>        <Typography>{velocityData.avg}</Typography>
                <Typography>Note Interval</Typography>  <Input type="number" value={velocityData.interval}></Input>
            </Box>

            <Box>
                <Typography>Metrinome</Typography>
                <Button>Reset</Button>
            </Box>
            <Box style={styles.section}>
                <Typography>Toggle</Typography>             <Checkbox checked={metroData.playing}/>
                <Typography>Tempo</Typography>              <Input type="number" value={metroData.tempo} />
                <Typography>Beats Per Measure</Typography>  <Input type="number" value={metroData.bpm} />
            </Box>
        </Box>

        </ItemPane>
    ); 
} 


const styles:StyleSheet = {
    container: {display: 'grid', gridTemplateRows: 'auto 1fr', gridTemplateColumns: '100%', overflow: 'hidden'}, 
    
    header: {
        display: 'flex'
    }, 
    main: {
        display: 'grid', gridTemplateColumns: 'auto auto', gridTemplateRows: 'repeat(auto-fill, 1fr)', overflowY: 'scroll', height: '100%',
        gap: 8, 
        rowGap: 16,
        padding: 8
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