import { Box, Button, Input, Typography } from "@mui/joy";
import React from "react";
import { SettingsContext } from ".";
import { StyleSheet } from "../../util";


export const SideBar = (props:{style?:React.CSSProperties}) => {
    const {settingsData} = React.useContext(SettingsContext); 
    const [filter, setFilter] = React.useState(""); 

    const handleNavSelect = (label:string) => {
        window.location.href = "#" + label; 
    }

    const filteredTitleList = React.useMemo(() => {
        const titleList = Object.keys(settingsData); 
        console.log(titleList)

        return titleList; 
    }, [filter, settingsData])

    return <Box style={props.style}>
        <Input style={style.input} type="text" onBlur={ev => ev && ev.currentTarget && setFilter(ev.currentTarget.value)} />
        <Box style={style.list}>
            {filteredTitleList.map(label => <Button onClick={e => handleNavSelect(label)} key={label}>{settingsData[label]}</Button>)}
        </Box>
    </Box>
}

const style:StyleSheet = {
    input: {
        marginBottom: 8
    }, 
    list: {
        overflow: 'auto', 
        display: 'grid', 
        gap: 8
    }
}