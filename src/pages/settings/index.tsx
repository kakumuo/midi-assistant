import React from 'react';
import { Box, Button, Card, Divider, IconButton, Input, Sheet, Typography } from '@mui/joy';
import { MainPage } from '../../components/MainPage';
import { StyleSheet } from '../../util';
import { useNoteColors } from '../../App';
import { InstrumentNote } from '../../util/midi';
import { SideBar } from './sidebar';

type SettingsData = {[key:string]:string}
export const SettingsContext = React.createContext<{
    settingsData: SettingsData, 
    setSettingsData: React.Dispatch<React.SetStateAction<SettingsData>>
}>({} as any); 

export const SettingsPage = () => {
    const {noteColors, setNoteColors} = useNoteColors(); 
    const [settingsData, setSettingsData] = React.useState<SettingsData>({}); 
    const handleNoteColorChange = (note:InstrumentNote['key'], ev:React.ChangeEvent<HTMLInputElement>) => {
        if(!ev || !ev.currentTarget) return; 
        const tmp = Object.assign({}, noteColors); 
        tmp[note] = ev.currentTarget.value; 

        setNoteColors(tmp); 
    }

    return <SettingsContext.Provider value={{settingsData, setSettingsData}}>
        <MainPage style={styles.container}>
            <SideBar />
            <Box style={styles.main}>
                <SettingsSection title='General' label='general'>
                    <Box sx={{
                        display: 'grid', 
                        gridTemplateRows: 'repeat(2, auto)', 
                        gridTemplateColumns: 'repeat(12, 1fr)', 
                        rowGap: 1,
                        columnGap: 4, 
                    }}>
                        {Object.keys(noteColors).map(noteKey => <Typography key={noteKey}>{noteKey}</Typography>)}
                        {(Object.keys(noteColors) as InstrumentNote['key'][]).map(noteKey => 
                            <Input style={styles.colorSelect} key={noteKey} type='color' defaultValue={noteColors[noteKey as InstrumentNote['key']]} onChange={e => handleNoteColorChange(noteKey, e)} />)
                        }
                    </Box>
                </SettingsSection>

                <SettingsSection title='Practice' label='practice'>
                    <Box sx={{
                        display: 'grid', 
                        gridTemplateColumns: '1fr auto',
                        gridTemplateRows: 'repeat(auto-fill ,auto)',
                        rowGap: 1,
                        columnGap: 4, 
                    }}>
                       <Typography>Tempo Poll Rate</Typography> <Input type='number' />
                       <Typography>Velocity Poll Rate</Typography> <Input type='number' />
                       <Typography>Show Keyboard</Typography> <Input type='number' />
                       <Typography>Keyboard Start Note</Typography> <Input type='number' />
                       <Typography>Keyboard End Note</Typography> <Input type='number' />
                    </Box>
                </SettingsSection>
            </Box>
        </MainPage>
    </SettingsContext.Provider>
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