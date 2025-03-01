import { Box } from "@mui/joy";
import React from "react";

import { NavigationBar, NavigationOption } from "./components/NavigationBar";
import { StyleSheet } from "./util";
import { PracticePage } from "./pages/PracticePage";
import { InstrumentController, InstrumentType } from "./util/midi";


type MidiMap = {[key: string]: WebMidi.MIDIInput}
export type AppData = {
    app: {
        deviceMap: MidiMap, 
    }, 

    instrument: InstrumentController | undefined
}

export const AppContext = React.createContext({} as AppData); 

export const App = () => {
    const [curPageI, setCurPageI] = React.useState(0)
    const [deviceMap, setDeviceMap] = React.useState({} as MidiMap)
    const [instrument, setInstrument] = React.useState<InstrumentController | undefined>(undefined); 

    const appData:AppData = {
        app: {
            deviceMap: deviceMap 
        }, 
        instrument: instrument
    }

    React.useEffect(() => {
        const midiInit = async () => {
            const access = await navigator.requestMIDIAccess(); 
            if(access){
                const tmpMap:MidiMap = {};
                access.inputs.forEach((k, v) => tmpMap[v] = k);
                setDeviceMap(tmpMap); 

                let instrument = new InstrumentController(Object.values(tmpMap)[0])
                setInstrument(instrument); 
            }
        }

        midiInit(); 
    }, [])


    const navOptions:NavigationOption[] = [
        {label: "Practice", target: <PracticePage />},
        {label: "Settings", target: <Box style={styles.page}>Settings Page</Box>}
    ] 

    return(
    <AppContext.Provider value={appData}>
        {instrument && 
            <Box style={styles.container}>
                <NavigationBar options={navOptions} curPageI={curPageI} setCurPageI={setCurPageI} />
                {navOptions[curPageI].target}
            </Box>
        }
    </AppContext.Provider>

    ); 
}

const styles:StyleSheet = {
    container: {
        display: 'grid', 
        gridTemplateColumns: 'auto',
        gridTemplateRows: 'auto 1fr',
        border: 'solid 1px black', 
        height: '100dvh', 
        padding: 8,
        gap: 8
        // width: '100dvw', 
    }, 
    page: { 
        border: 'solid 1px red',
    }
}