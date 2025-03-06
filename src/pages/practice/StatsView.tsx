import React from "react";
import { ItemPane } from ".";
import { StyleSheet } from "../../util";
import { Box, Divider, IconButton, Typography } from "@mui/joy";
import { PlayArrowOutlined, RefreshOutlined } from "@mui/icons-material";
import { InstrumentInputContext } from "../../util/midi/InputManager";
import { InstrumentEventType, InstrumentEvent, InstrumentNoteEvent } from "../../util/midi";

const BUFFER_SIZE = 15; 
export const StatsView = (props: {style?:React.CSSProperties}) => {
    const [notesBuffer, setNotesBuffer] = React.useState<{timing:number, velocity:number}[]>([]); 
    const {inputManager} = React.useContext(InstrumentInputContext); 

    React.useEffect(() => {
        if(!inputManager) return; 

        const handleNoteChange = (event:InstrumentEvent) => {
            const e = event as InstrumentNoteEvent; 
            setNotesBuffer(p => [...p, {timing: Date.now(), velocity: event.velocity}]);
        }; 

        inputManager.addListener(InstrumentEventType.NOTE, handleNoteChange); 

        return () => {
            inputManager.removeListener(InstrumentEventType.NOTE, handleNoteChange); 
        }
    }, [inputManager]); 

    const tempoData = React.useMemo(() => {
        return {
            Min: 0, 
            Max: 0, 
            Avg: 0
        }
    }, [notesBuffer])


    return (
        <ItemPane style={{...props.style, ...styles.container}}>
            <Box style={styles.header}>
                <Typography>Performance</Typography>
                <IconButton><RefreshOutlined /></IconButton>
            </Box>

            <StatDisplay title="Tempo" headerAside={<IconButton children={<RefreshOutlined />}/>}>
                <Box style={styles.threeStatGroup}>
                    {Object.entries(tempoData).map( ([key, val], i) => {
                        return (<>
                            {i != 0 && <Divider orientation="vertical" />}
                            <Box style={styles.statGroup}>
                                <Typography level="body-lg">{key}</Typography>
                                <Typography>{val}</Typography>
                            </Box>
                        </>)
                    })}
                </Box>
                <Divider orientation="vertical" />
            </StatDisplay>

            <StatDisplay title="Velocity" headerAside={<IconButton children={<RefreshOutlined />}/>}>
                <Box>
                    Something
                </Box>
            </StatDisplay>

            <StatDisplay title="Metronome" headerAside={<IconButton children={<PlayArrowOutlined />}/>}>
                <Box>
                    Something
                </Box>
            </StatDisplay>
        </ItemPane>
    ); 
} 

export const StatDisplay = (props:{title:string, headerAside: React.JSX.Element, children?:any}) => {
    return <Box style={styles.statDisplay}>
        <Box style={styles.statDisplayHeader}>
            <Typography level="h4">{props.title}</Typography>
            {props.headerAside}
        </Box>

        {props.children}
    </Box>
}

const styles:StyleSheet = {    
    container: {
        display: 'grid', 
        gridTemplateColumns: 'auto', 
        gridTemplateRows: 'auto 1fr 1fr 1fr', 
        flex: '1 1 0',
        backgroundColor: 'lightgray', 
        gap: 16, 
        padding: 8
    }, 
    header: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between'
    }, 
    statDisplay: {
        backgroundColor: 'white', 
        marginLeft: 8, marginRight: 8, 
        padding: 8, 
        borderRadius: 8, 
        display: 'grid', 
        gridTemplateColumns: 'auto', 
        gridTemplateRows: 'auto 1fr',
    }, 
    statDisplayHeader: {
        display: 'flex', 
        justifyContent: 'space-between'
    }, 

    threeStatGroup:{
        display: 'flex', 
        justifyItems: 'center', 
        justifyContent: 'space-evenly',
        alignSelf: 'center'
    }, 
    statGroup: {
        display: 'grid', 
        gridTemplateColumns: 'auto', 
        gridTemplateRows: '1fr 1fr', 
        alignItems: 'center', 
        justifyItems: 'center'
    }
}