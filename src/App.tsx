import { Box } from "@mui/joy";
import React from "react";

import { NavigationBar, NavigationOption } from "./components/NavigationBar";
import { StyleSheet } from "./util";
import { PracticePage } from "./pages/practice";
import { InstrumentInputProvider } from "./util/midi/InputManager";


export const App = () => {
    const [curPageI, setCurPageI] = React.useState(0)

    const navOptions:NavigationOption[] = [
        {label: "Practice", target: <PracticePage />},
        // {label: "Settings", target: <Box style={styles.page}>Settings Page</Box>}
    ] 

    return(
        <InstrumentInputProvider>
            <Box style={styles.container}>
                <NavigationBar options={navOptions} curPageI={curPageI} setCurPageI={setCurPageI} />
                {navOptions[curPageI].target}
            </Box>
        </InstrumentInputProvider>
    );
}

const styles:StyleSheet = {
    container: {
        display: 'flex', 
        flexDirection: 'column', 
        border: 'solid 1px black', 
        height: '100vh',
        padding: 8,
    }, 
    page: {
        border: 'solid 1px red',
    }
}