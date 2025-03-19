import React from 'react';
import { Box, Input, Typography } from '@mui/joy';
import { ApplicationContext, useNoteColors } from '../../App';
import { InstrumentNote } from '../../util/midi';
import { SettingsSection } from './index';

export const GeneralSection = () => {
    const { appConfig, setAppConfig } = React.useContext(ApplicationContext);
    const noteColors = useNoteColors();

    const updateConfig_generalColor = (note: InstrumentNote['key'], value: string) => {
        setAppConfig(config => {
            const tmp = JSON.parse(JSON.stringify(config));
            tmp.general.noteColors[note] = value;
            return tmp;
        });
    }

    return (
        <SettingsSection title='General' label='general'>
            <Box sx={{
                display: 'grid',
                gridTemplateRows: 'repeat(2, auto)',
                gridTemplateColumns: 'repeat(12, 1fr)',
                rowGap: 1,
                columnGap: 4,
            }}>
                {Object.keys(noteColors).map(noteKey => 
                    <Typography key={noteKey}>{noteKey}</Typography>
                )}
                {(Object.keys(noteColors) as InstrumentNote['key'][]).map(noteKey =>
                    <Input
                        sx={{
                            padding: 0,
                            border: 0,
                            boxShadow: 'none'
                        }}
                        key={noteKey}
                        type='color'
                        value={noteColors[noteKey as InstrumentNote['key']]}
                        onChange={(e) => updateConfig_generalColor(noteKey, e.currentTarget.value)}
                    />
                )}
            </Box>
        </SettingsSection>
    );
} 