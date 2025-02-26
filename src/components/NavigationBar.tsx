import React from "react";
import { Box } from "@/src/components/ui/box";
import { Pressable, StyleSheet, Text } from "react-native";
import { Button } from "@/src/components/ui/button";


export type NavigationOption = {
    label:string, 
    value:string, 
    target:React.JSX.Element
}

export const NavigationBar = (props:{navOptions:NavigationOption[], curNavOption:string, onNavSelect:(navVal:string)=>void}) => {
    return <Box style={styles.container}>
        <Text style={styles.title}>midi-assistant</Text>
        {props.navOptions.map(option => 
            <Pressable key={option.value} style={styles.nav} onPress={() => props.onNavSelect(option.value)}>
                <Text style={{...styles.nav, fontStyle: option.value == props.curNavOption ? 'italic' : 'normal'}}>{option.label}</Text>
            </Pressable>
        )}
    </Box>
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center', 
        gap: 16
    }, 
    title: {
        fontWeight: 'bold',
        fontSize: 30,
        marginRight: 'auto'
    }, 
    nav: {
        backgroundColor: 'none', 
        fontWeight: 'bold',
    },
    nav_select: {
        fontStyle: 'italic'
    }
})