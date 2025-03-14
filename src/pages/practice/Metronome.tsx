import React, {useState, useRef, useEffect} from 'react'
import { Box, Button, IconButton, Input, Slider, Typography } from '@mui/joy';
import { StyleSheet } from '../../util';
import { PauseRounded, PlayArrowOutlined } from '@mui/icons-material';



// Metronome Component
export const Metronome = (props:{style?:React.CSSProperties}) => {
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
      <Box sx={{...styles.metronomeCard, ...props.style}}>
        <Typography level="title-md" sx={styles.statTitle}>Metronome</Typography>
        
        <Box sx={styles.metronomeControls}>
          <IconButton 
            onClick={() => setPlaying(!playing)}
            sx={styles.playButton}
          >
            {playing ? <PauseRounded /> : <PlayArrowOutlined />}
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