import React from 'react';
import { Box, Typography } from '@mui/joy';
import { MainPage } from '../../components/MainPage';
import { StyleSheet } from '../../util';
import { SideBar } from './sidebar';
import { PracticeSection } from './PracticeSection';
import { GeneralSection } from './GeneralSection';

type SettingsData = {[key:string]:string}
export const SettingsContext = React.createContext<{
    settingsData: SettingsData, 
    setSettingsData: React.Dispatch<React.SetStateAction<SettingsData>>
}>({} as any); 

export const SettingsPage = () => {
    const [settingsData, setSettingsData] = React.useState<SettingsData>({}); 

    return (
        <SettingsContext.Provider value={{settingsData, setSettingsData}}>
            <MainPage style={styles.container}>
                <SideBar />
                <Box style={styles.main}>
                    <GeneralSection />
                    <PracticeSection />
                </Box>
            </MainPage>
        </SettingsContext.Provider>
    );
}

export const SettingsSection = (props:{title:string, label:string, description?:string, children?:any}) => {
    const {setSettingsData} = React.useContext(SettingsContext)
    const self = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        setSettingsData(prev => {
            const tmp = Object.assign({}, prev); 
            tmp[props.label] = props.title

            return tmp; 
        })

        return () => {
            setSettingsData(prev => {
                const tmp = Object.assign({}, prev); 
                delete tmp[props.label]
    
                return tmp; 
            })
        }
    }, [props.title, self])

    return <Box ref={self} sx={styles.section}>
        <Box>
            <Typography level='h3'><a style={{textDecoration: 'none', color: 'black'}} href={'#' + props.label}>{props.title}</a></Typography>
            <Typography>{props.description}</Typography>
        </Box>
        {props.children}
    </Box>
}


const styles:StyleSheet = {
    container: {
        overflow: 'hidden',
        display: 'grid', 
        gridTemplateColumns: '20% 1fr',
        gridTemplateRows: 'auto', 
        gap: 8
    }, 
    main: {
        overflow: 'scroll'
    },
    colorSelect: {
        padding: 0, 
        border: 0, 
        boxShadow: 'none'
    }, 
    section: {
        display: 'grid',
        gridTemplateColumns: '20% 1fr', 
        gridTemplateRows: 'auto', 
        width: '100%',
        borderBottom: 'solid 2px lightgray',
        padding: 4
    }
}