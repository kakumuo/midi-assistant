import React, { useEffect, useRef, useState } from "react";
import { ItemPane } from ".";
import { StyleSheet } from "../../util";
import { Box, Button, Divider, IconButton, Input, Slider, Typography } from "@mui/joy";
import { InstrumentEvent, InstrumentEventType, InstrumentNoteEvent } from "../../util/midi";
import { InstrumentInputContext } from "../../util/midi/InputManager";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';

// Stat Card Component
const StatCard = ({ title, min, max, avg, unit = "" }: { 
  title: string, 
  min: number, 
  max: number, 
  avg: number,
  unit?: string
}) => (
  <Box sx={styles.statCard}>
    <Typography level="title-md" sx={styles.statTitle}>{title}</Typography>
    <Box sx={styles.statValues}>
      <Box sx={styles.statItem}>
        <Typography level="body-xs" sx={styles.statLabel}>MIN</Typography>
        <Typography level="h4" sx={styles.statValue}>
          {min.toFixed(0)}{unit}
        </Typography>
      </Box>
      <Divider orientation="vertical" />
      <Box sx={styles.statItem}>
        <Typography level="body-xs" sx={styles.statLabel}>AVG</Typography>
        <Typography level="h4" sx={styles.statValue}>
          {avg.toFixed(0)}{unit}
        </Typography>
      </Box>
      <Divider orientation="vertical" />
      <Box sx={styles.statItem}>
        <Typography level="body-xs" sx={styles.statLabel}>MAX</Typography>
        <Typography level="h4" sx={styles.statValue}>
          {max.toFixed(0)}{unit}
        </Typography>
      </Box>
    </Box>
  </Box>
);

// Metronome Component
const Metronome = () => {
  const [playing, setPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [currentBeat, setCurrentBeat] = useState(0);
  const audioContext = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);

  const playClick = (isAccented: boolean) => {
    if (!audioContext.current) {
      audioContext.current = new AudioContext();
    }

    const ctx = audioContext.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Higher pitch for accented beat
    oscillator.frequency.value = isAccented ? 1000 : 800;
    gainNode.gain.value = 0.5;

    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    oscillator.stop(ctx.currentTime + 0.1);
  };

  const startMetronome = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    setCurrentBeat(0);
    const beatDuration = 60000 / tempo;
    
    // Play first beat immediately
    playClick(true);
    
    intervalRef.current = window.setInterval(() => {
      setCurrentBeat(prev => {
        const newBeat = (prev + 1) % beatsPerMeasure;
        playClick(newBeat === 0); // Accent first beat of each measure
        return newBeat;
      });
    }, beatDuration);
  };

  const stopMetronome = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (playing) startMetronome();
    else stopMetronome();
    
    return () => stopMetronome();
  }, [playing, tempo, beatsPerMeasure]);

    return (
    <Box sx={styles.metronomeCard}>
      <Typography level="title-md" sx={styles.statTitle}>Metronome</Typography>
      
      <Box sx={styles.metronomeControls}>
        <IconButton 
          onClick={() => setPlaying(!playing)}
          sx={styles.playButton}
        >
          {playing ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
        </IconButton>
        
        <Box sx={styles.tempoControl}>
          <Typography level="body-sm">Tempo</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Slider
              value={tempo}
              min={40}
              max={208}
              onChange={(_, value) => setTempo(value as number)}
              sx={{ flex: 1 }}
              size="sm"
            />
            <Input
              value={tempo}
              onChange={(e) => setTempo(Number(e.target.value))}
              slotProps={{ input: { min: 40, max: 208 } }}
              sx={{ width: 60 }}
              size="sm"
            />
          </Box>
        </Box>
            </Box>

      <Box sx={styles.beatVisualizer}>
        {Array.from({ length: beatsPerMeasure }).map((_, i) => (
          <Box 
            key={i}
            sx={{
              ...styles.beatIndicator,
              backgroundColor: i === currentBeat ? 
                (i === 0 ? '#ff5252' : '#4caf50') : 
                '#e0e0e0'
            }}
          />
        ))}
                            </Box>
      
      <Box sx={styles.beatsControl}>
        <Typography level="body-sm">Beats per measure</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            size="sm" 
            variant="outlined"
            onClick={() => setBeatsPerMeasure(Math.max(2, beatsPerMeasure - 1))}
            disabled={beatsPerMeasure <= 2}
          >
            -
          </Button>
          <Typography>{beatsPerMeasure}</Typography>
          <Button 
            size="sm" 
            variant="outlined"
            onClick={() => setBeatsPerMeasure(Math.min(12, beatsPerMeasure + 1))}
            disabled={beatsPerMeasure >= 12}
          >
            +
          </Button>
                </Box>
                            </Box>
                </Box>
  );
};

export const StatsView = (props: {style?:React.CSSProperties, className?:string, id?:string}) => {
    const { inputManager } = React.useContext(InstrumentInputContext);
    const [tempoStats, setTempoStats] = useState({ min: Infinity, max: 0, avg: 0, count: 0, sum: 0 });
    const [velocityStats, setVelocityStats] = useState({ min: Infinity, max: 0, avg: 0, count: 0, sum: 0 });
    const lastNoteTimeRef = useRef<number | null>(null);
    
    const handleReset = () => {
        setTempoStats({ min: Infinity, max: 0, avg: 0, count: 0, sum: 0 });
        setVelocityStats({ min: Infinity, max: 0, avg: 0, count: 0, sum: 0 });
        lastNoteTimeRef.current = null;
    };

    useEffect(() => {
        const handleNoteEvent = (event: InstrumentEvent) => {
            const noteEvent = event as InstrumentNoteEvent;
            if (!noteEvent.isPressed) return;
            
            const currentTime = performance.now();
            
            // Update velocity stats
            const velocity = noteEvent.velocity;
            setVelocityStats(prev => {
                const newCount = prev.count + 1;
                const newSum = prev.sum + velocity;
                return {
                    min: Math.min(prev.min, velocity),
                    max: Math.max(prev.max, velocity),
                    avg: newSum / newCount,
                    count: newCount,
                    sum: newSum
                };
            });
            
            // Update tempo stats if we have a previous note time
            if (lastNoteTimeRef.current) {
                const timeDiff = currentTime - lastNoteTimeRef.current;
                const bpm = 60000 / timeDiff; // Convert ms to BPM
                
                if (bpm >= 40 && bpm <= 300) { // Filter out unrealistic values
                    setTempoStats(prev => {
                        const newCount = prev.count + 1;
                        const newSum = prev.sum + bpm;
                        return {
                            min: Math.min(prev.min, bpm),
                            max: Math.max(prev.max, bpm),
                            avg: newSum / newCount,
                            count: newCount,
                            sum: newSum
                        };
                    });
                }
            }
            
            lastNoteTimeRef.current = currentTime;
        };
        
        inputManager.addListener(InstrumentEventType.NOTE, handleNoteEvent);
        return () => inputManager.removeListener(InstrumentEventType.NOTE, handleNoteEvent);
    }, [inputManager]);
    
    return (
        <ItemPane style={{...props.style}} className={props.className} id={props.id}>
            <Box sx={styles.container}>
                <Box sx={styles.header}>
                    <Typography level="h4">Performance Stats</Typography>
                    <IconButton onClick={handleReset} size="sm">
                        <RestartAltRoundedIcon />
                    </IconButton>
    </Box>

                <Box sx={styles.content}>
                    <StatCard 
                        title="Tempo" 
                        min={tempoStats.min === Infinity ? 0 : tempoStats.min} 
                        max={tempoStats.max} 
                        avg={tempoStats.avg}
                        unit=" BPM"
                    />
                    
                    <StatCard 
                        title="Velocity" 
                        min={velocityStats.min === Infinity ? 0 : velocityStats.min} 
                        max={velocityStats.max} 
                        avg={velocityStats.avg}
                    />
                    
                    <Metronome />
        </Box>
    </Box>
        </ItemPane>
    ); 
};

const styles: StyleSheet = {    
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        padding: '12px'
    },
    header: {
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        overflow: 'auto',
        flex: 1,
        paddingRight: '4px' // Add space for scrollbar
    },
    statCard: {
        backgroundColor: 'white', 
        borderRadius: '8px',
        padding: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    statTitle: {
        fontWeight: 'bold',
        color: '#424242'
    },
    statValues: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    statItem: {
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1
    },
    statLabel: {
        color: '#757575',
        fontWeight: 'bold'
    },
    statValue: {
        fontWeight: 'bold',
        fontSize: '1.2rem' // Slightly smaller to fit better
    },
    metronomeCard: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        display: 'flex', 
        flexDirection: 'column',
        gap: '12px'
    },
    metronomeControls: {
        display: 'flex',
        alignItems: 'center', 
        gap: '12px'
    },
    playButton: {
        backgroundColor: '#4caf50',
        color: 'white',
    },
    tempoControl: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    beatVisualizer: {
        display: 'flex', 
        gap: '6px',
        justifyContent: 'center',
        padding: '4px 0'
    },
    beatIndicator: {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        transition: 'background-color 0.1s ease'
    },
    beatsControl: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
};