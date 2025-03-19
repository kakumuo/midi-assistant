import { Box, Button, Checkbox, Divider, FormControl, IconButton, Option, Radio, RadioGroup, Select } from "@mui/joy";
import React from "react";
import { StyleSheet } from "../../util";
import { BuildOutlined, RefreshOutlined } from "@mui/icons-material";
export const ConfigHeader = (props:{style?:React.CSSProperties}) => {
    return <Box style={{...props.style, ...styles.container}}>
        <Box style={styles.checkGroup}>
            <Checkbox label={'Chords'} />
            <Checkbox label={'Accidentals'} />
        </Box>

        <RadioGroup style={styles.group} defaultValue={'time'} orientation="horizontal">
            <Radio value={'time'} label={"Time"} />
            {/* <Radio value={'notes'} label={"Notes"} />
            <Radio value={'sample'} label={"Sample"} />
            <Radio value={'custom'} label={"Custom"}/> */}
        </RadioGroup>

        <IconButton><BuildOutlined /></IconButton>
    </Box>
}

export const Header = (props:{style?:React.CSSProperties}) => {
    return <Box style={{...styles.container, ...props.style}}>
        <Button>Something</Button>
    </Box>
}

export const Footer = (props:{style?:React.CSSProperties}) => {
    return <Box style={{...styles.container, ...props.style}}>
        <IconButton children={<RefreshOutlined />} />
    </Box>
}

const styles:StyleSheet = {
    container: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    }, 
    checkGroup: {
        display: 'flex', 
        gap: 16
    }
}