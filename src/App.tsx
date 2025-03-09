import { Box } from "@mui/joy";
import React from "react";

import { NavigationBar, NavigationOption } from "./components/NavigationBar";
import { StyleSheet } from "./util";
import { PracticePage } from "./pages/practice";
import { InstrumentInputProvider } from "./util/midi/InputManager";
import { InstrumentKey, InstrumentNote } from "./util/midi";
import { SettingsPage } from "./pages/settings";



export type ApplicationData = {
    noteColors: Record<InstrumentNote['key'], string>
    setNoteColors: React.Dispatch<React.SetStateAction<Record<InstrumentNote['key'], string>>>
}
export const ApplicationContext = React.createContext({} as ApplicationData); 

export const useNoteColors = () => {
    const {noteColors, setNoteColors} = React.useContext(ApplicationContext); 
    return {noteColors, setNoteColors};
}

export const App = () => {
    const [curPageI, setCurPageI] = React.useState(0); 
    const [noteColors, setNoteColors] = React.useState<Record<InstrumentNote['key'], string>>({
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
    }); 

    const navOptions:NavigationOption[] = [
        {label: "Practice", target: <PracticePage />},
        {label: "Settings", target: <SettingsPage />}
    ] 

    return(
        <ApplicationContext value={{noteColors, setNoteColors}}>
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
        gridTemplateRows: 'auto auto', 
        border: 'solid 1px black', 
        height: '100vh',
        minHeight: '100vh', 
        maxHeight: '100vh',
        padding: 8,
    }, 
    page: {
        border: 'solid 1px red',
    }
}