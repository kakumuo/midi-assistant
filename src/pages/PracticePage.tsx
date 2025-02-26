import React from "react";
import { Box } from "@/components/ui/box";
import {Selection}  from '../components/Select'
import { Pressable, StyleSheet } from "react-native";
import { Grid, GridItem } from "@/components/ui/grid";
import { Text } from "@/components/ui/text";

export const PracticePage = () => {
    return <Box style={styles.container}>
        
        {/* header */}
        <Box style={styles.header}>
            <Selection options={["C", "D", "E"]} placeholder="Scale"  />
            <Selection options={["Lydian", "Phrygian"]} placeholder="Mode"  />

            <Pressable style={styles.session_dur_container}>
                <Text style={styles.session_dur}>Session Duration: {Date.now()}</Text>
            </Pressable>
        </Box>


        <Box style={styles.main}>
            <Item />
            <Item />
            <Item />
            <Item />
        </Box>
    </Box>
}

const Item = () => {
    return (
        <Box style={styles.main_item} className="bg-primary-200 p-4 rounded-md"><Text>Item 1</Text></Box>
    )
}

const styles = StyleSheet.create({
    container: {
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center', 
        gap: 16,
        padding: 16
    }, 
    session_dur_container: {
        marginLeft: 'auto'
    },
    session_dur:{
        fontWeight: 'bold'
    }, 
    main:{
        padding: 16,
        display: 'flex', 
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    main_item:{
        flex: 1, 
        flexShrink: 1, 
        flexBasis: 1
    }
})