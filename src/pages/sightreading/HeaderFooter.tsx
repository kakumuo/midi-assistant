import { Box, Button, Checkbox, Divider, FormControl, IconButton, Option, Radio, RadioGroup, Select } from "@mui/joy";
import React from "react";
import { StyleSheet } from "../../util";
import { BuildOutlined, RefreshOutlined, SettingsOutlined } from "@mui/icons-material";

export const Header = (props:{style?:React.CSSProperties}) => {
    return <Box style={{...styles.container, ...props.style}}>
        <Button>Something</Button>
        <IconButton sx={styles.settingsButton} children={<SettingsOutlined />} />
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
    }, 
    settingsButton: {
        top: 0, 
        right: 0, 
        position: 'absolute'
    }
}