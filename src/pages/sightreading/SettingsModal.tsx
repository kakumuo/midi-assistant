import React from "react";
import { FormData, Scale, Staff, TestConfig } from "./types";
import { Box, Button, Checkbox, Divider, IconButton, Input, Modal, ModalDialog, Option, Select, Textarea, Tooltip, Typography } from "@mui/joy";
import { StyleSheet } from "../../util";
import { AddOutlined, BorderAll, DeleteOutline, InfoOutlined } from "@mui/icons-material";
import { SightreadingContext } from ".";
import { InstrumentKey, InstrumentNote } from "../../util/midi";
import { virtualKeyboardNotes } from "../../components/VirtualKeyboard";
import { v4 as uuidv4 } from "uuid";


const settingsFormData:FormData[] = [

    // Staff and notation settings
    {field: 'staffAndNotation', desc: 'Staff and Notation Settings', label: 'Staff and Notation', dataType: 'group'},
    {field: 'staff', desc: 'The staff to use (treble, bass, etc.)', label: 'Staff', dataType: 'staff'},
    {field: 'key', desc: 'The key of the scale', label: 'Key', dataType: 'key'},
    {field: 'scale', desc: 'The scale to use for the test', label: 'Scale', dataType: 'scale'},
    {field: 'timeSignature', desc: 'Time signature for the test', label: 'Time Signature', dataType: 'number,number'},
    {field: 'useFlats', desc: 'Whether or not to use flats in the field', label: 'Use Flats', dataType: 'boolean'},
    {field: 'useSharps', desc: 'Whether or not to use sharps in the field', label: 'Use Sharps', dataType: 'boolean'},
    
    // Note range and display settings
    {field: 'noteAndRange', desc: 'Note range and display settings', label: 'Note and Range', dataType: 'group'},
    {field: 'noteRange', desc: 'Range of notes to use in the test', label: 'Note Range', dataType: 'note,note'},
    {field: 'noteIntervalRange', desc: 'Range of intervals between consecutive notes', label: 'Note Interval Range', dataType: 'number,number'},
    {field: 'useChords', desc: 'Whether to use chords in the test', label: 'Use Chords', dataType: 'boolean'},
    {field: 'harmonicNotesRange', desc: 'Range of notes played simultaneously', label: 'Harmonic Notes Range', dataType: 'number,number'},
    
    // Tempo and timing settings
    {field: 'tempoAndTiming', desc: 'Tempo and Timing Settings', label: 'Tempo and Timing', dataType: 'group'},
    {field: 'tempoRange', desc: 'Range of tempo in BPM', label: 'Tempo Range', dataType: 'number,number'},
    {field: 'velocityRange', desc: 'Velocity range of notes', label: 'Velocity Range', dataType: 'number,number'},
    {field: 'duration', desc: 'Amount of time time alotted for the test. 0 for infinite time.', label: 'Duration', dataType: 'number'},
    
    // Test configuration
    {field: 'testConfig', desc: 'Test Configuration Settings', label: 'Test Configuration', dataType: 'group'},
    {field: 'numNotes', desc: 'Number of notes to display in the test', label: 'Number of Notes', dataType: 'number'},
    {field: 'lookaheadNotes', desc: 'Number of notes to show ahead of the current note', label: 'Lookahead Notes', dataType: 'number'},
    {field: 'maxIncorrectNotes', desc: 'Maximum number of incorrect notes allowed', label: 'Max Incorrect Notes', dataType: 'number'},
    {field: 'noteSequence', desc: 'Sequence of notes used in ABC notation. ie: GABc dedB|dedB dedB|c2ec B2dB', label: 'Note Sequence', dataType: 'array_number'},
    
    // Display options
    {field: 'display', desc: 'Display Settings', label: 'Display', dataType: 'group'},
    {field: 'showIncorrectNotes', desc: 'Whether to show incorrect notes', label: 'Show Incorrect Notes', dataType: 'boolean'},
    {field: 'showNoteColors', desc: 'Whether to show note colors', label: 'Show Note Colors', dataType: 'boolean'},
    {field: 'showNoteNames', desc: 'Whether to show note names', label: 'Show Note Names', dataType: 'boolean'},
    {field: 'waitForCorrectNotes', desc: 'Whether to wait for correct notes before proceeding', label: 'Wait For Correct Notes', dataType: 'boolean'}
]

const scales:Array<Scale> = ['Major', 'Minor']
const staves:Array<Staff> = ['Grand', 'Treble', 'Bass']

export const SettingsModal = (props:{style?:React.CSSProperties, open:boolean, onClose:()=>void}) => {
    const {configs, setConfigs, curConfigId, setCurConfigId} = React.useContext(SightreadingContext)
    const [nameEdit, setNameEdit] = React.useState(false); 

    const handleNameChange = (name:string) => {
        setNameEdit(false)
        if(name.trim().length != 0) setFormData('name', name, "string")
    }

    const setFormData = (field:keyof TestConfig, value: any, dataType:FormData['dataType']) => {
        const tmp = JSON.parse(JSON.stringify(configs[curConfigId])); 
        console.log(value)
        

        setConfigs(c => {
            const arr = JSON.parse(JSON.stringify(c)); 
            tmp[field] = value;
            arr[curConfigId] = tmp; 
            
            return arr; 
        }); 
    }

    const generateFormData = () => {
        return settingsFormData.map((data, dataI) => {
            let input = <></>

            switch(data.dataType){
                case 'boolean': 
                    input = <Checkbox checked={configs[curConfigId][data.field] as boolean} onChange={e => setFormData(data.field, e.currentTarget.checked, 'boolean')} />; 
                    break; 
                case 'array_number': 
                    input = <Textarea />; 
                    break; 
                case 'number': 
                    input = <Input value={configs[curConfigId][data.field] as number} onChange={e => setFormData(data.field, e.currentTarget.value, 'boolean')} type="number" />
                    break; 
                case 'scale': 
                    input = <Select value={configs[curConfigId][data.field] as Scale} onChange={(_, v) => v && setFormData(data.field, v, 'scale')}>
                        {scales.map(s => <Option key={s} value={s} children={s}/>)}</Select>
                    break; 
                case 'staff': 
                    input = <Select value={configs[curConfigId][data.field] as Staff} onChange={(_, v) => v && setFormData(data.field, v, 'staff')}>
                        {staves.map(s => <Option key={s} value={s} children={s}/>)}</Select>
                    break; 
                case 'key': 
                    input = <Select onChange={(_, val) => setFormData(data.field, val, 'boolean')}
                         value={configs[curConfigId][data.field] as string}>{InstrumentNote.keysList.map(k => <Option key={k} value={k} children={k} />)}</Select>
                    break; 
                case 'note': 
                    input = <Select><Option value={''} /></Select>
                    break; 
                case 'number,number': 
                    input = <>
                        <Input 
                            type="number" 
                            value={(configs[curConfigId][data.field] as [number, number])[0]} 
                            onChange={e => {
                                const currentValue = configs[curConfigId][data.field] as [number, number];
                                setFormData(data.field, [parseInt(e.target.value), currentValue[1]], 'number,number');
                            }}
                        />
                        <Input 
                            type="number" 
                            value={(configs[curConfigId][data.field] as [number, number])[1]} 
                            onChange={e => {
                                const currentValue = configs[curConfigId][data.field] as [number, number];
                                setFormData(data.field, [currentValue[0], parseInt(e.target.value)], 'number,number');
                            }}
                        />
                    </>
                    break; 
                case 'note,note': 
                    const [minVal, maxVal] = configs[curConfigId].noteRange
                    input = <>
                        <Select value={minVal} onChange={(_, v) => v && setFormData('noteRange', [v, maxVal], "note,note")}>
                            {virtualKeyboardNotes.filter(n => n.valueOf() < maxVal)
                            .map(n => <Option key={n.valueOf()} value={n.valueOf()}>{n.toString()}</Option>)}
                        </Select>
                        <Select value={maxVal} onChange={(_, v) => v && setFormData('noteRange', [minVal, v], "note,note")}>
                            {virtualKeyboardNotes.filter(n => n.valueOf() > minVal)
                            .map(n => <Option key={n.valueOf()} value={n.valueOf()}>{n.toString()}</Option>)}
                        </Select>
                    </>
                    break;  
            }

            if(data.dataType == 'group')
                return <Divider sx={{marginTop: dataI != 0 ? 4 : 'auto'}} key={data.field}>
                    <Tooltip title={data.desc}><Typography children={data.label} level="title-lg" /></Tooltip>
                </Divider>
            else if(data.field == 'noteSequence') 
            return <Box key={data.field} sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                <Typography level="title-md">{data.label}</Typography>
                <Typography sx={{gridArea: '1 / 2'}} level="body-sm">{data.desc}</Typography>
                <Textarea sx={{minHeight: 200}} />
                <Button children={"Apply"} sx={{marginLeft: 'auto'}} />
            </Box>
            else
                return <Box sx={styles.settingsFormItem} key={data.field}>
                    <Typography level="title-md">{data.label}</Typography>
                    {
                        data.dataType == 'number,number' || data.dataType == 'note,note' ? 
                        <Box sx={{display: 'grid', gridTemplate: `auto / repeat(2, auto)`, gridArea: '2 / 2 span 2', gap: 2}}>
                            {input}
                        </Box>
                        : 
                        input
                    }
                    <Typography sx={{gridArea: '2 / 1'}} level="body-sm">{data.desc}</Typography>
                </Box>
        })
    }

    return <Modal open={props.open} onClose={props.onClose} style={{...props.style}}>
        <ModalDialog style={{...styles.container}}>
            <Sidebar configs={configs} curConfigId={curConfigId} onSelectConfig={(id) => setCurConfigId(id)} />
            
            <Box sx={styles.settingsMain}>
                {
                    nameEdit ? 
                    <Input defaultValue={configs[curConfigId].name} autoFocus onBlur={(e) => handleNameChange(e.currentTarget.value)} onKeyUp={(e) => e.key == 'Enter' && handleNameChange(e.currentTarget.value)} />: 
                    <Typography level="h3" onDoubleClick={() => setNameEdit(true)}>{configs[curConfigId].name}</Typography> 
                }
                <Box sx={styles.settingsContent}>
                    {generateFormData()}
                </Box>
                <Button sx={{marginLeft: 'auto'}} children={"Close"} onClick={props.onClose} />
            </Box>
        </ModalDialog>
    </Modal>
}   


const Sidebar = (props:{configs:{[key:string]: TestConfig}, curConfigId:string, onSelectConfig:(configId:string)=>void}) => {
    const {configs, setConfigs, setCurConfigId, curConfigId} = React.useContext(SightreadingContext)
    
    const handleAddConfig = () => {
        setConfigs(c => {
            const prev = JSON.parse(JSON.stringify(c))
            const newId = uuidv4(); 
            prev[newId] = {
                name: "Untitled Config", 
                uuid: newId,
                useFlats: false, 
                useSharps: false, 
                numNotes: 20,
                key: 'C', 
                scale: "Major",
                staff: "Treble",
                noteRange: [new InstrumentNote('C', 4).valueOf(), new InstrumentNote('F', 5).valueOf()],
                noteIntervalRange: [0, 0],
                tempoRange: [0, 0],
                velocityRange: [0, 0],
                useChords: false,
                harmonicNotesRange: [0, 0],
                maxIncorrectNotes: 0,
                duration: 0,
                noteSequence: [],
                showIncorrectNotes: false,
                waitForCorrectNotes: false,
                timeSignature: [4, 4],
                lookaheadNotes: 0,
                showNoteNames: false,
                showNoteColors: false
            }

            return prev; 
        })
    }

    const handleDeleteConfig = (id:string) => {
        const configSize = Object.keys(configs).length;
        const keyList = Object.keys(configs); 
        if(configSize <= 1) return; 

        if(curConfigId == id){
            if(id == keyList[0])
                setCurConfigId(keyList[1])
            else if(id == keyList[configSize - 1])
                setCurConfigId(keyList[configSize - 2])
            else 
                setCurConfigId(keyList[keyList.indexOf(id) + 1])
        }

        const tmp = JSON.parse(JSON.stringify(configs))
        delete tmp[id]
        setConfigs(tmp)
    }

    return  <Box style={styles.sidebar}>
        <Button onClick={handleAddConfig} children={<AddOutlined />} />
        <Box style={styles.sidebarMain}>
            {Object.values(props.configs).map(c => <Box key={c.uuid} style={styles.sidebarItem}>
            <Button onClick={() => props.onSelectConfig(c.uuid)} variant={c.uuid == props.curConfigId ? 'solid' : 'outlined'} children={c.name}/>
            <IconButton color="danger"  onClick={() => handleDeleteConfig(c.uuid)} children={<DeleteOutline />} />
            </Box>)}
        </Box>
    </Box>
}


const styles:StyleSheet = {
    container: {
        width: '80%', 
        height: "70%", 
        display: 'grid',
        gridTemplate: 'auto / auto 1fr',
    }, 

    // sidebar
    sidebar: {
        border: 'lightgray solid 1px',
        borderRadius: 8, 
        width: '250px', 
        padding: 8, 
        display: 'grid', 
        gap: 8,
        gridTemplate: 'auto 1fr / auto',
        overflow: 'hidden'
    }, 
    sidebarHead: {
        display: 'grid', 
        gridTemplate: 'auto / auto',
        gap: 4
    }, 
    sidebarMain: {
        display: 'flex', 
        flexDirection: 'column', 
        gap: 8, 
        overflowY: 'auto'
    }, 
    sidebarItem: {
        display: 'grid', 
        gridTemplate: 'auto / 1fr auto auto',
        gap: 8
    },

    // settings
    settingsMain: {
        display: 'grid', 
        gridTemplate: 'auto 1fr / auto',
        overflow: 'hidden', 
        gap: 2
    }, 
    settingsContent: {
        border: 'lightgray solid 1px',
        borderRadius: 8, 

        display: 'flex', 
        flexDirection: 'column', 
        gap: 2,
        overflowY: 'scroll', 
        padding: 2
    }, 
    settingsFormItem: {
        display: 'grid', 
        gridTemplate: 'auto 1fr / 1fr 30%'
    }, 
    settingsMainHeader: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between'
    }
}