import { Box } from "@mui/joy";
import React from "react";

import { NavigationBar, NavigationOption } from "./components/NavigationBar";
import { StyleSheet } from "./util";
import { PracticePage } from "./pages/practice";
import { InstrumentInputProvider } from "./util/midi/InputManager";
import { InstrumentNote } from "./util/midi";
import { SettingsPage } from "./pages/settings";
import { SightReadingPage } from "./pages/sightreading";

export type ApplicationConfig = {
    general: {
        noteColors: Record<InstrumentNote['key'], string>
    }, 
    practice: {
        showKeyboard: boolean, 
        keyboardMinNote: InstrumentNote, 
        keyboardMaxNote: InstrumentNote
    }
}

export const ApplicationContext = React.createContext<{
    appConfig: ApplicationConfig, 
    setAppConfig: React.Dispatch<React.SetStateAction<ApplicationConfig>>
}>({} as any); 

export const useNoteColors = () => {
    const {appConfig} = React.useContext(ApplicationContext); 
    return appConfig.general.noteColors;
}

export const App = () => {
    const [curPageI, setCurPageI] = React.useState(0); 
    const [appConfig, setAppConfig] = React.useState<ApplicationConfig>({
        general: {
            noteColors: {
                "C": '#FF0000',
                "C#": '#FF7F00',
                "D": '#FFFF00',
                "D#": '#00FF00',
                "E": '#0000FF',
                "F": '#4B0082',
                "F#": '#9400D3',
                "G": '#FF1493',
                "G#": '#00FFFF',
                "A": '#FFD700',
                "A#": '#00BA33',
                "B": '#8A2BE2',
            }
        }, 
        practice: {
            keyboardMinNote: new InstrumentNote('C', 3), 
            keyboardMaxNote: new InstrumentNote('C', 6), 
            showKeyboard: true
        }
    })

    React.useEffect(() => {
        console.log(appConfig); 
    }, [appConfig])

    const navOptions:NavigationOption[] = [
        {label: "Sight Reading", target: <SightReadingPage />},
        {label: "Practice", target: <PracticePage />},
        {label: "Settings", target: <SettingsPage />},
    ] 

    return(
        <ApplicationContext value={{appConfig, setAppConfig}}>
            <InstrumentInputProvider>
                <Box style={styles.container}>
                    <NavigationBar options={navOptions} curPageI={curPageI} setCurPageI={setCurPageI} />
                    {navOptions[curPageI].target}
                </Box>
            </InstrumentInputProvider>
        </ApplicationContext>
    );
}

const styles:StyleSheet = {
    container: {
        display: 'grid', 
        gridTemplateColumns: 'auto',
        gridTemplateRows: 'auto 1fr', 
        border: 'solid 1px black', 
        height: '100dvh',
        minHeight: '100dvh', 
        maxHeight: '100dvh',
        padding: 8,
    }, 
    page: {
        border: 'solid 1px red',
    }
}