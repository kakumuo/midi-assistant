import { Box, formLabelClasses, IconButton, Option, Select, Typography } from "@mui/joy";
import { MainPage } from "../../components/MainPage";
import { StyleSheet } from "../../util";
import { TestDisplay } from "./TestDisplay";
import { InstrumentNote } from "../../util/midi";
import React from "react";
import { generateTest } from "./generateTest";
import { TestConfig } from "./types";
import { VirtualKeyboard } from "../../components/VirtualKeyboard";
import { RefreshOutlined, SettingsOutlined } from "@mui/icons-material";
import { SettingsModal } from "./SettingsModal";
import { InstrumentInputContext } from "../../util/midi/InputManager";
import { v4 as uuidv4 } from "uuid";


const sampleConfig:{[key:string]: TestConfig} = {
    "123": {
        name: "Sample Test", 
        uuid: "123",
        useFlats: false, 
        useSharps: false, 
        numNotes: 25,
        key: 'C', 
        noteRange: [new InstrumentNote('C', 4).valueOf(), new InstrumentNote('F', 5).valueOf()],
        duration: 0, 
        lookaheadNotes: 0, 
        maxIncorrectNotes: 0, 
        noteIntervalRange: [0, 0],
        tempoRange: [0, 0],
        velocityRange: [0, 0],
        useChords: false,
        harmonicNotesRange: [0, 0],
        noteSequence: [], 
        scale: "Major", 
        showIncorrectNotes: false, 
        showNoteColors: false, 
        showNoteNames: false, 
        staff: "Treble", 
        timeSignature: [4, 4], 
        waitForCorrectNotes: false
    }, 
    "456": {
        name: "Other Test", 
        uuid: "456",
        useFlats: false, 
        useSharps: false, 
        numNotes: 25,
        key: 'C', 
        noteRange: [new InstrumentNote('C', 4).valueOf(), new InstrumentNote('F', 5).valueOf()],
        duration: 0, 
        lookaheadNotes: 0, 
        maxIncorrectNotes: 0, 
        noteIntervalRange: [0, 0],
        tempoRange: [0, 0],
        velocityRange: [0, 0],
        useChords: false,
        harmonicNotesRange: [0, 0],
        noteSequence: [], 
        scale: "Major", 
        showIncorrectNotes: false, 
        showNoteColors: false, 
        showNoteNames: false, 
        staff: "Treble", 
        timeSignature: [4, 4], 
        waitForCorrectNotes: false
    }
}

export const SightreadingContext = React.createContext<{
    configs: {[key:string]: TestConfig}, 
    setConfigs: React.Dispatch<React.SetStateAction<{[key:string]: TestConfig}>>, 
    curConfigId: string, 
    setCurConfigId: React.Dispatch<React.SetStateAction<string>>, 
}>({} as any)

export const SightReadingPage = () => {
    const [testNotes, setTestNotes] = React.useState<InstrumentNote[]>([]); 
    const [showSettings, setShowSettings] = React.useState<boolean>(false); 
    const [configs, setConfigs] = React.useState<{[key:string]: TestConfig}>(sampleConfig)
    const [curConfigId, setCurConfigId] = React.useState(Object.keys(sampleConfig)[0]); 
    const {inputManager} = React.useContext(InstrumentInputContext); 

    React.useEffect(() => {
        setTestNotes(generateTest(configs[curConfigId])); 
    }, [curConfigId]); 

    const handleShowSettings = (show:boolean) => {
        inputManager.enableInput(!show); 
        setShowSettings(show)
    }
    
    return (
        <SightreadingContext.Provider value={{configs, setConfigs, curConfigId, setCurConfigId}}>
            <MainPage style={styles.container}>
                    <Box style={styles.main}>
                        {/* header */}
                        <Box sx={styles.header}>
                            <Select value={curConfigId} onChange={(_, id) => id && setCurConfigId(id)}>
                                {Object.values(configs).map(c => <Option key={c.uuid} value={c.uuid} children={c.name}  />)}
                            </Select>
                            <IconButton children={<SettingsOutlined />} onClick={() => handleShowSettings(true)} />
                            <SettingsModal open={showSettings} onClose={() => handleShowSettings(false)} />
                        </Box>

                        <TestDisplay style={styles.readingTest} testNotes={testNotes} />

                        {/* Footer */}
                        <Box sx={styles.footer}>
                            <IconButton children={<RefreshOutlined />} />
                        </Box>
                    </Box>
                    <VirtualKeyboard style={{height: '100px'}} minNote={InstrumentNote.fromValue(configs[curConfigId].noteRange[0])} maxNote={InstrumentNote.fromValue(configs[curConfigId].noteRange[1])} />
                </MainPage>
        </SightreadingContext.Provider>
    )
}

const styles:StyleSheet = {
    container: {
        display: 'grid', 
        gridTemplateRows: '1fr auto', 
        gridTemplateColumns: 'auto', 
        gap: 8
    }, 
    header: {
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, auto)', 
        gridTemplateRows: 'auto', 
        gap: 2
    }, 
    footer: {
    }, 
    main: {
        height: '100%', 
        border: 'dotted',
        display: 'flex',
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 8,
    }, 
    readingTest: {
        width: '80%', 
        height: '50%', 
        border: 'solid'
    }
}