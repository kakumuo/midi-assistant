import React from "react";
import { StyleSheet } from "../../util";
import { MainPage } from "../../components/MainPage";
import { MoreHorizOutlined } from "@mui/icons-material";
import { Box, BoxProps, Button, ButtonProps, Dropdown, DropdownProps, Menu, MenuButton, MenuItem, Option, Select, Typography } from "@mui/joy";
import { InstrumentNote, midiNoteMap } from "../../util/midi";
import { SightReadingDisplay } from "./SightReadingDisplay";
import { VirtualKeyboard } from "../../components/VirtualKeyboard";


const styles:StyleSheet = {
    container: {
        height: '100%', 
        maxHeight: '100%', 
        position: 'relative',
        padding: 8, 
        display: 'grid', 
        gridTemplateColumns: 'auto', 
        gridTemplateRows: '1fr 150px'
    }, 
    moreButton: {
        position: 'absolute',
        right: 0, 
        top: 0, 
        margin: 8,
    }
}

const scales = ['C' , 'C#/Db' , 'D' , 'D#/Eb' , 'E']
const clefs = ['Treble', 'Bass', 'Grand Staff']

type ConfigData = {
    scale: string // config data
    clef: string, 
    noteRangeMin: InstrumentNote, 
    noteRangeMax: InstrumentNote
}

export const SightReadingPage = () => {
    const [configData, setConfigData] = React.useState({
        scale: scales[0], 
        clef: clefs[0], 
        noteRangeMin: {key: 'C', octave: 4},
        noteRangeMax: {key: 'C', octave: 5},
    } as ConfigData); 

    const handleConfigChange = (target: keyof ConfigData, value:any) => {
        const tmp = Object.assign({}, configData); 
        if(target == 'noteRangeMin' || target == 'noteRangeMax')
            tmp[target] = value as InstrumentNote
        else
            tmp[target] = value

        setConfigData(tmp); 
    }

    return <MainPage style={styles.container}>
        <SRDropdown style={styles.moreButton} configData={configData} onChange={handleConfigChange} />
        <SightReadingDisplay />
        <VirtualKeyboard />
    </MainPage>
}

const SRDropdown = (props:{style:React.CSSProperties, configData:ConfigData, onChange:(target:keyof ConfigData, value:string)=>void}) => {
    const [open, setOpen] = React.useState(false); 
    const selfRef = React.useRef<HTMLButtonElement>(null); 

    const handleRemainOpen = (e: React.SyntheticEvent | null) => {
        if(!e) return; 
        console.log(e)
        // console.log(selfRef)

        e.preventDefault(); 
        setOpen(e.type != 'blur');
    }

    const handleSelectChange = (target:keyof ConfigData, e:React.SyntheticEvent | null) => {
        if(!e || !e.currentTarget || !e.currentTarget.textContent) return; 
        props.onChange(target, e.currentTarget.textContent)
    }

    const handleButtonSelect = (target:keyof ConfigData, value:any) => {
        props.onChange(target, value); 
    }

    return <Dropdown>
        <MenuButton variant="solid" ref={selfRef} style={props.style}><MoreHorizOutlined /></MenuButton>
        <Menu>
            <Typography>Scales</Typography>
                
            <Box>
                {scales.map(i => <Button onClick={(e) => handleButtonSelect('scale', i)} variant={props.configData.scale == i ? 'solid' : 'outlined'} key={i}>{i}</Button>)}
            </Box>

            <Typography>Clefs</Typography>

            <Box>
                {clefs.map(i => <Button onClick={(e) => handleButtonSelect('clef', i)} variant={props.configData.clef == i ? 'solid' : 'outlined'} key={i}>{i}</Button>)}
            </Box>

            <Typography>Note Range</Typography>
            <Box>
                <Typography>Min</Typography>
                <Select value={props.configData.noteRangeMin} onChange={e => handleSelectChange('noteRangeMin', e)}>
                    {Object.values(midiNoteMap).map(n => <Option key={n.key + n.octave} value={n.key + n.octave}  label={n.key + n.octave}/>)}
                </Select>
                <Typography>Max</Typography>
                <Select value={props.configData.noteRangeMax} onChange={e => handleSelectChange('noteRangeMax', e)}>
                    {Object.values(midiNoteMap).map(n => <Option key={n.key + n.octave} value={n.key + n.octave}  label={n.key + n.octave}/>)}
                </Select>
            </Box>

            <Button children={"Reset"} />
        </Menu>
    </Dropdown>
}