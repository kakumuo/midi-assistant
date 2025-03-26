import { Box, Checkbox, Stack, Tooltip, Typography } from "@mui/joy";
import React from "react";
import { NoteResult } from "./types";
import { formatDurationString, StyleSheet } from "../../util";
import { LineChart, LineSeriesType } from "@mui/x-charts";
import { calculateResultData } from "./calculateTestResult";
import { MakeOptional } from "@mui/x-charts/internals";


export const ResultsDisplay = (props:{style?:React.CSSProperties, results:NoteResult[]}) => {
    const {
        avgTempo, accuracy, duration, avgVelocity,
        minVelocity, maxVelocity, minTempo, maxTempo,
        total, totalMissed, 
        noteMisses, noteTempos, noteVelocities
    } = React.useMemo(() => calculateResultData(props.results), [props.results])

    return <Box sx={{...props.style, ...styles.container}}>
        <DisplayItem style={styles.bpmItem} label="Tempo" value={avgTempo} tooltip={<>
                <Typography>Min Tempo: {minTempo}</Typography>
                <Typography>Max Tempo: {maxTempo}</Typography>
            </>}/>

        <DisplayItem style={styles.velocityItem} label="Velocity" value={avgVelocity} tooltip={<>
                <Typography>Min Velocity: {minVelocity}</Typography>
                <Typography>Max Velocity: {maxVelocity}</Typography>
            </>}/>

        <DisplayItem style={styles.accuracyItem} label="Accuracy" value={accuracy} tooltip={<>
                <Typography>Total: {total}</Typography>
                <Typography>Missed: {totalMissed}</Typography>
            </>}/>
        <DisplayItem style={styles.durationItem} label="Duration" value={formatDurationString(duration)} tooltip={formatDurationString(duration)}/>
        <ResultsChart style={styles.chartDisplay} noteMisses={noteMisses} noteTempos={[null, ...noteTempos.slice(1)]} noteVelocities={noteVelocities} />
    </Box>
}

const DisplayItem = (props:{style?:React.CSSProperties, label:string, value:any, tooltip:React.ReactNode}) => {
    return  <Tooltip title={props.tooltip}><Box sx={props.style}>
        <Typography level="title-lg">{props.label}</Typography>
        <Typography level="title-sm">{props.value}</Typography>
    </Box></Tooltip>
}

const ResultsChart = (props:{style?:React.CSSProperties, noteTempos:(number|null)[], noteVelocities:number[], noteMisses:number[]}) => {

    const series = React.useMemo(() => {
        const output:MakeOptional<LineSeriesType, "type">[] = []

        output.push({ data: props.noteTempos, label: 'Tempo (bpm)', yAxisId: 'tempo', id: 'tempo'})
        output.push({ data: props.noteVelocities, label: 'Velocity', id: 'velocity'})
        output.push({ data: props.noteMisses, label: 'Misses', yAxisId: 'misses', id: 'misses', color:'red'})

        return output; 
    }, [])


    return <Box style={props.style}>
        <LineChart 
            series={series}
            grid={{
                horizontal: true, 
                vertical: true
            }}
            yAxis={[
                {id: 'tempo'}, 
                {
                    id: 'misses', 
                    min: 0,
                    max: props.noteMisses.every(m => m === 0) ? 1 : undefined,
                    tickMaxStep: 5, 
                    tickMinStep: 1, 
                    label: 'Misses'
                }
            ]}
            rightAxis={{axisId: 'misses', tickInterval: 'auto'}}
            sx={{
                '.MuiLineElement-series-misses': {
                    stroke: 'none'
                }
            }}           
        />
    </Box>
}

const styles:StyleSheet = {
    container: {
        display: 'grid', 
        padding: 2,
        gridTemplate: 'auto auto auto / 10% 1fr',
    }, 
    bpmItem:{
        gridArea: '1 / 1',
        alignSelf: 'center', 
    }, 
    velocityItem:{
        gridArea: '2 / 1',
        alignSelf: 'center', 
    }, 
    accuracyItem:{
        gridArea: '3 / 1',
        alignSelf: 'center', 
    }, 
    durationItem:{
        gridArea: '4 / 1',
        alignSelf: 'center', 
    },
    chartDisplay: {
        gridArea: '1 / 2 / span 4 / span 1'
    }
}