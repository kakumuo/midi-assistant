import React from 'react';
import { Box, Select, Switch, Typography, Option } from '@mui/joy';
import { ApplicationConfig, ApplicationContext } from '../../App';
import { InstrumentNote } from '../../util/midi';
import { virtualKeyboardNotes } from '../../components/VirtualKeyboard';
import { SettingsSection } from './index';

export const PracticeSection = () => {
    const { appConfig, setAppConfig } = React.useContext(ApplicationContext);

    const updateConfig_practiceShowKeyboard = (value: boolean) => {
        setAppConfig(config => {
            const tmp = {...config};
            tmp.practice = {...config.practice};
            tmp.practice.showKeyboard = value;
            return tmp;
        });
    }

    const updateConfig_practiceMinKeyboardNote = (value: string) => {
        setAppConfig(config => {
            const tmp = {...config};
            tmp.practice = {...config.practice};
            tmp.practice.keyboardMinNote = InstrumentNote.fromNote(value);
            return tmp;
        });
    }

    const updateConfig_practiceMaxKeyboardNote = (value: string) => {
        setAppConfig(config => {
            const tmp = {...config};
            tmp.practice = {...config.practice};
            tmp.practice.keyboardMaxNote = InstrumentNote.fromNote(value);
            return tmp;
        });
    }

    return (
        <SettingsSection title='Practice' label='practice'>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 20%',
                gridTemplateRows: 'repeat(auto-fill ,auto)',
                rowGap: 1,
                columnGap: 4,
            }}>
                <Typography>Show Keyboard</Typography>
                <Switch
                    checked={appConfig.practice.showKeyboard}
                    onChange={e => updateConfig_practiceShowKeyboard(e.target.checked)}
                />

                <Typography>Keyboard Start Note</Typography>
                <Select
                    value={appConfig.practice.keyboardMinNote.toString()}
                    onChange={(_, newValue) => newValue && updateConfig_practiceMinKeyboardNote(newValue)}
                >
                    {virtualKeyboardNotes
                        .filter(n => n.valueOf() < appConfig.practice.keyboardMaxNote.valueOf())
                        .map(n => <Option key={n.valueOf()} value={n.toString()}>{n.toString()}</Option>)}
                </Select>

                <Typography>Keyboard End Note</Typography>
                <Select
                    value={appConfig.practice.keyboardMaxNote.toString()}
                    onChange={(_, newValue) => newValue && updateConfig_practiceMaxKeyboardNote(newValue)}
                >
                    {virtualKeyboardNotes
                        .filter(n => n.valueOf() > appConfig.practice.keyboardMinNote.valueOf())
                        .map(n => <Option key={n.valueOf()} value={n.toString()}>{n.toString()}</Option>)}
                </Select>
            </Box>
        </SettingsSection>
    );
} 