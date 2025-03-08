import React from "react";
import { ItemPane } from ".";
import { StyleSheet } from "../../util";
import { Box, Divider, IconButton, Input, Slider, Typography } from "@mui/joy";
import { Pause, PauseOutlined, PlayArrowOutlined, RefreshOutlined, VolumeMute, VolumeMuteOutlined, VolumeUpOutlined } from "@mui/icons-material";
import { InstrumentInputContext, useActiveNotes } from "../../util/midi/InputManager";
import { InstrumentEventType, InstrumentEvent, InstrumentNoteEvent } from "../../util/midi";
import Color from "colorjs.io";

const BUFFER_SIZE = 15; 
const BUFFER_TIMING_THRESH = 2000; // filter everything enterd over 1 second in the past
export const StatsView = (props: {style?:React.CSSProperties, className?:string, id?:string}) => {
    const [notesBuffer, setNotesBuffer] = React.useState<{timing:number, velocity:number}[]>([{timing: Date.now(), velocity: 0}]); 
    const [tempoData, setTempoData] = React.useState({Min: Infinity, Max: 0, Avg: 0}); 
    const [velocityData, setVelocityData] = React.useState({Min: Infinity, Max: 0, Avg: 0}); 
    const [timingRefresh, setTimingRefresh] = React.useState(false); 
    const [avgVelocity, setAvgVelocity] = React.useState(0); 
    const {inputManager} = React.useContext(InstrumentInputContext); 

    React.useEffect(() => {
        if(!inputManager) return; 

        const handleNoteChange = (e:InstrumentEvent) => {
            let avg = 0; 
            if(inputManager.activeNotes.size > 0)
                avg = [...inputManager.activeNotes].reduce((acc, cur) => acc + cur.velocity!, 0) / inputManager.activeNotes.size; 
            setAvgVelocity(avg); 

            console.log(e.velocity)
            if(!e.isPressed) return; 
            setNotesBuffer(prev => [...prev, {timing: Date.now(), velocity: e.velocity}]);
        }; 

        inputManager.addListener(InstrumentEventType.NOTE, handleNoteChange); 
        inputManager.addListener(InstrumentEventType.KEY, handleNoteChange)

        return () => {
            inputManager.removeListener(InstrumentEventType.NOTE, handleNoteChange);
            inputManager.removeListener(InstrumentEventType.KEY, handleNoteChange); 
        }
    }, [inputManager]); 

    const updateTempoData = React.useCallback((notesBuffer: {timing:number, velocity:number}[]) => {
        let [Min, Max, Avg] = [Infinity, 0, 0]; 
        let prev = notesBuffer[0]; 

        if(notesBuffer.length > 1){
            for(let i = 1; i < notesBuffer.length; i++){
                let cur = notesBuffer[i]; 
                const tempoDiff = cur.timing - prev.timing; 
                Min = Math.min(Min, tempoDiff); 
                Max = Math.max(Max, tempoDiff); 
                Avg += tempoDiff; 
                prev = cur; // Update previous note for next iteration
            }
            Avg /= (notesBuffer.length - 1); // Divide by number of intervals, not notes

            // convert to bpm (60 seconds / time in seconds)
            Min = Math.round(60000 / Min); // Convert ms to bpm
            Max = Math.round(60000 / Max); // Convert ms to bpm
            Avg = Math.round(60000 / Avg); // Convert ms to bpm
        }

        setTempoData(t => ({
            Min: Min === Infinity ? t.Min : (t.Min === 0 ? Min : Math.min(t.Min, Min)), 
            Max: Max === 0 ? t.Max : Math.max(t.Max, Max), 
            Avg: Avg === Infinity || isNaN(Avg) ? t.Avg : Avg
        })); 
    }, []); 

    const upateVelocityData = React.useCallback((notesBuffer: {timing:number, velocity:number}[]) => {
        let [Min, Max, Avg] = [Infinity, 0, 0]; 

        let pressCount = 0; 
        for(let note of notesBuffer){
            if(note.velocity <= 0) continue; 

            Min = Math.min(Min, note.velocity); 
            Max = Math.max(Max, note.velocity); 
            Avg += note.velocity;
            
            pressCount++; 
        }

        if(pressCount > 0) Avg = Math.round(Avg / pressCount);   

        setVelocityData(v => ({Min, Max, Avg})); 
    }, []); 

    const velocityDisplayStyle = React.useMemo(() => {
        const MAX_VAL = 128; 
        const percent = 100 * avgVelocity / MAX_VAL; 
        const style:React.CSSProperties = {
            border: 'solid', 
            height: '20px', 
            background: `linear-gradient(to right, green ${percent}%, lightgray ${percent}%)`,
            transition: 'background 1s', 
            borderImage: `linear-gradient(to right, ${new Color('green').darken(.2)} ${percent}%, ${new Color('lightgray').darken(.2)} ${percent}%) 1`, 
        }

        return style; 
    }, [avgVelocity])

    React.useEffect(() => {
         // Handle timing recording
         const interval = setInterval(() => {
            setNotesBuffer(notesBuffer => {
                updateTempoData(notesBuffer); 
                upateVelocityData(notesBuffer);                 
                return [{timing: Date.now(), velocity: 0}]
            }); 

            setTimingRefresh(t => !t); 
        }, BUFFER_TIMING_THRESH);

        return () => clearTimeout(interval);  
    }, []); 

    const handleResetTempoData = () => {
        setTempoData({Min: Infinity, Max: 0, Avg: 0}); 
    }

    const handleResetVelocityData = () => {
        setVelocityData({Min: Infinity, Max: 0, Avg: 0}); 
    }


    return (
        <ItemPane style={{...props.style}} className={props.className} id={props.id}>
            <Box style={styles.header}>
                <Typography  level="h4">Performance</Typography>
                <IconButton><RefreshOutlined onClick={() => {handleResetTempoData(); handleResetVelocityData(); }}/></IconButton>
            </Box>

            <StatDisplay title="Tempo (bpm)" headerAside={<IconButton children={<RefreshOutlined onClick={handleResetTempoData} />}/>}>
                <Box style={styles.threeStatGroup}>
                    {Object.entries(tempoData).map( ([key, val], i) => {
                        return (<>
                            {i != 0 && <Divider orientation="vertical" />}
                            <Box key={i} style={styles.statGroup}>
                                <Typography level="body-lg">{key}</Typography>
                                <Typography>{val === Infinity ? 0 : val}</Typography>
                            </Box>
                        </>)
                    })}
                </Box>
                <Divider orientation="vertical" />
            </StatDisplay>

            <StatDisplay title="Velocity" headerAside={<IconButton children={<RefreshOutlined onClick={handleResetVelocityData} />}/>}>
                <Box style={styles.threeStatGroup}>
                    {Object.entries(velocityData).map( ([key, val], i) => {
                        return (<>
                            {i != 0 && <Divider orientation="vertical" />}
                            <Box key={i} style={styles.statGroup}>
                                <Typography level="body-lg">{key}</Typography>
                                <Typography>{val === Infinity ? 0 : val}</Typography>
                            </Box>
                        </>)
                    })}
                </Box>
                <Box style={velocityDisplayStyle} />
                <Divider orientation="vertical" />
            </StatDisplay>

            <Metronome />
        </ItemPane>
    ); 
} 

const MAX_VOL = 100; 

const SPEED_MIN = 20;
const SPEED_MAX = 240; 
const soundBlockHigh = new Audio("/sounds/dry-wood-block.wav");
const soundBlockLow = new Audio("/sounds/wood-block-b.wav");
const Metronome = () => {
    const [isPlaying, setIsPlaying] = React.useState(false); 
    const [metroSpeed, setMetroSpeed] = React.useState((SPEED_MIN + SPEED_MAX) / 2); 
    const [metroBeats, setMetroBeats] = React.useState(4); 
    const [volume, setVolume] = React.useState(50); 
    const [curBeat, setCurBeat] = React.useState(-1); 

    const handlePlayPause = () => {
        setIsPlaying(p => !p); 
    }

    const handleSpeedChange = (v:number) => {
        setMetroSpeed(v); 
    }

    const handleBeatChange = (v: number) => {
        setMetroBeats(v); 
    }

    React.useEffect(() => {
        if (!isPlaying) {
            setCurBeat(-1);
            return;
        }

        // Calculate interval in milliseconds from BPM
        // 60000ms / BPM = ms per beat
        const intervalMs = 60000 / metroSpeed;
        
        // Create audio context and oscillator for metronome sound
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        const playSound = (frequency: number, duration: number) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.value = frequency;
            gainNode.gain.value = volume / MAX_VOL;
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start();
            
            // Stop the sound after duration
            setTimeout(() => {
                oscillator.stop();
                oscillator.disconnect();
                gainNode.disconnect();
            }, duration);
        };
        
        const interval = setInterval(() => {
            // Update current beat
            setCurBeat(prevBeat => {
                const nextBeat = (prevBeat + 1) % metroBeats;
                
                // Play different ding sounds for first beat vs other beats
                if (nextBeat === metroBeats - 1) {
                    soundBlockLow.play(); 
                } else {
                    soundBlockHigh.play(); 
                }
                
                return nextBeat;
            });
        }, intervalMs);

        return () => {
            clearInterval(interval);
            audioContext.close();
        };
    }, [isPlaying, metroSpeed, metroBeats, volume]);

    const handleVolumeChange = (v:number) => {
        setVolume(v); 

        const targetVolume = v / 100; 
        soundBlockLow.volume = targetVolume; 
        soundBlockHigh.volume = targetVolume; 
    }

    const createBeatsDisplay = () => {
        const beatIcons = []; 
        for(let i = 0; i < metroBeats; i++){
            let bgColor = i == metroBeats - 1 ? 'palegoldenrod' : 'lightgray'
            if(i == curBeat)
                bgColor = i == metroBeats - 1 ? 'goldenrod' : 'green'
            beatIcons.push(
                <Box style={{...styles.metroBeatDisplayIcon, backgroundColor: bgColor }} key={i}/>
            ); 
        }
        return beatIcons; 
    }

    const aside = <Box style={{display: 'flex', paddingLeft: 16, alignItems: 'center', gap: 8}}>
        {volume == 0 ? <VolumeMuteOutlined /> : <VolumeUpOutlined />}
        <Input type="range" value={volume} onChange={e => handleVolumeChange(Number.parseInt(e.target.value))} />
        <IconButton color={isPlaying ? 'warning' : 'success'} onClick={handlePlayPause} children={isPlaying ? <PauseOutlined /> : <PlayArrowOutlined />}/>
    </Box>

    return <StatDisplay title="Metronome" headerAside={aside}>
        <Box style={styles.metroDisplayMain}>
            <Input type="number" value={metroSpeed} onChange={(e) => handleSpeedChange(Number.parseInt(e.currentTarget.value))} />
            <Input type="number" value={metroBeats} onChange={(e) => handleBeatChange(Number.parseInt(e.currentTarget.value))} />
            <Box style={styles.metroBeatDisplay}>
                {createBeatsDisplay()}
            </Box>
            
        </Box>
    </StatDisplay>
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
    header: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between'
    }, 
    statDisplay: {
        backgroundColor: 'white', 
        marginLeft: 8, marginRight: 8, 
        padding: 8, 
        gap: 8,
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
    }, 

    metroDisplayMain: {
        display: 'grid', 
        gridTemplateColumns: 'auto auto', 
        gridTemplateRows: '1fr 1fr', 
        rowGap: 16, 
        gap: 8,
    }, 

    metroBeatDisplay: {
        display: 'flex', 
        border: 'solid lightgray 1px',
        borderRadius: 4,
        justifyContent: 'space-evenly', 
        padding: 8, 
        gridArea: '2 / 1 / span 1 / span 2', 
    }, 
    metroBeatDisplayIcon: {
        borderRadius: 4, width: 'auto', height: 'auto', aspectRatio: '1/2', 
    }
}