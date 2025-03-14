import React from 'react';
import { Box, Button, Card, Divider, IconButton, Sheet, Typography } from '@mui/joy';
import { MainPage } from '../../components/MainPage';
import { StyleSheet } from '../../util';
import { InstrumentNote } from '../../util/midi';
import { useNoteColors } from '../../App';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import Color from 'colorjs.io';

const styles: StyleSheet = {
    container: {
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        height: '100%',
        backgroundColor: '#f8f9fa', 
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 8px'
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        flex: 1,
        overflow: 'auto'
    },
    section: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
    },
    colorGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '16px'
    },
    colorCard: {
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    colorPreview: {
        width: '100%',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    colorInfo: {
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    colorPicker: {
        width: '100%',
        height: '32px',
        padding: 0,
        border: 'none',
        cursor: 'pointer'
    },
    buttonContainer: {
        display: 'flex',
        gap: '8px'
    },
    previewText: {
        color: 'white',
        mixBlendMode: 'difference',
        fontWeight: 'bold',
        fontSize: '2rem'
    }
};

const ColorCard = ({ 
    note, 
    color, 
    onChange 
}: { 
    note: string; 
    color: string; 
    onChange: (color: string) => void; 
}) => {
    return (
        <Card variant="outlined" sx={styles.colorCard}>
            <Box sx={styles.colorPreview} style={{ backgroundColor: color }}>
                <Typography sx={styles.previewText}>{note}</Typography>
            </Box>
            <Box sx={styles.colorInfo}>
                <Typography level="body-sm" fontWeight="bold">
                    {note}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => onChange(e.target.value)}
                        style={styles.colorPicker}
                    />
                    <Typography level="body-xs">
                        {color.toUpperCase()}
                    </Typography>
                </Box>
            </Box>
        </Card>
    );
};

export const SettingsPage = () => {
    const { noteColors, setNoteColors } = useNoteColors();
    const [tempColors, setTempColors] = React.useState(noteColors);
    const [hasChanges, setHasChanges] = React.useState(false);

    React.useEffect(() => {
        const savedColors = localStorage.getItem('noteColors');
        if (savedColors) {
            const colors = JSON.parse(savedColors);
            setNoteColors(colors);
            setTempColors(colors);
        }
    }, []);

    const handleColorChange = (note: InstrumentNote['key'], color: string) => {
        setTempColors((prev:any) => ({
            ...prev,
            [note]: color
        }));
        setHasChanges(true);
    };

    const handleSave = () => {
        setNoteColors(tempColors);
        localStorage.setItem('noteColors', JSON.stringify(tempColors));
        setHasChanges(false);
    };

    const handleReset = () => {
        const defaultColors = {
            'C': '#ff0000',
            'C#': '#ff4000',
            'D': '#ff8000',
            'D#': '#ffbf00',
            'E': '#ffff00',
            'F': '#80ff00',
            'F#': '#00ff00',
            'G': '#00ff80',
            'G#': '#00ffff',
            'A': '#0080ff',
            'A#': '#0000ff',
            'B': '#8000ff'
        };
        setTempColors(defaultColors);
        setNoteColors(defaultColors);
        localStorage.setItem('noteColors', JSON.stringify(defaultColors));
        setHasChanges(false);
    };

    return (
        <MainPage style={{overflow: 'hidden'}}>
            <Box sx={styles.container}>
                <Box sx={styles.header}>
                    <Typography level="h2">Settings</Typography>
                    <Box sx={styles.buttonContainer}>
                        <Button
                            variant="outlined"
                            color="neutral"
                            onClick={handleReset}
                            startDecorator={<RestartAltRoundedIcon />}
                        >
                            Reset
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={!hasChanges}
                            startDecorator={<SaveRoundedIcon />}
                            color="primary"
                        >
                            Save Changes
                        </Button>
                    </Box>
                </Box>

                <Box sx={styles.content}>
                    <Box sx={styles.section}>
                        <Typography level="title-lg" sx={{ mb: 2 }}>Note Colors</Typography>
                        <Typography level="body-sm" sx={{ mb: 3, color: 'neutral.500' }}>
                            Customize the colors for each musical note. Changes will be reflected throughout the application.
                        </Typography>
                        <Box sx={styles.colorGrid}>
                            {Object.entries(tempColors).map(([note, color]) => (
                                <ColorCard
                                    key={note}
                                    note={note}
                                    color={color}
                                    onChange={(newColor) => handleColorChange(note as InstrumentNote['key'], newColor)}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </MainPage>
    );
}; 