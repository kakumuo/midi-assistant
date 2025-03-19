import { Box, Typography } from "@mui/joy";
import { MainPage } from "../../components/MainPage";
import { Footer, ConfigHeader, Header } from "./HeaderFooter";
import { StyleSheet } from "../../util";
import { ReadingTest } from "./ReadingTest";
import { InstrumentNote } from "../../util/midi";

const testNotes = [
    new InstrumentNote('C', 4),
    new InstrumentNote('E', 4),
    new InstrumentNote('G', 4),
    new InstrumentNote('B', 4),
    new InstrumentNote('D', 5),
    new InstrumentNote('F', 5),
    new InstrumentNote('A', 5),
    new InstrumentNote('C', 5),
    new InstrumentNote('E', 5),
    new InstrumentNote('G', 5),
    new InstrumentNote('B', 5),
    new InstrumentNote('A', 4),
    new InstrumentNote('F', 4),
    new InstrumentNote('D', 4),
    new InstrumentNote('G', 5),
    new InstrumentNote('E', 5),
    new InstrumentNote('C', 5),
    new InstrumentNote('A', 4),
    new InstrumentNote('F', 4),
    new InstrumentNote('D', 5)
]
export const SightReadingPage = () => {
    return <MainPage style={styles.container}>
        <ConfigHeader style={styles.header} />
        <Box style={styles.main}>
            <Header />
            <ReadingTest style={styles.readingTest} notes={testNotes} />
            <Footer />
        </Box>


    </MainPage>
}


const styles:StyleSheet = {
    container: {
        display: 'grid', 
        gridTemplateRows: 'auto 1fr', 
        gridTemplateColumns: 'auto', 
        gap: 8
    }, 
    header: {
        display: 'flex',
        width: '70%', 
        justifySelf: 'center',
        border: 'solid lightgray', 
        padding: 8, 
        borderRadius: 8, 
        justifyContent: 'space-evenly'
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