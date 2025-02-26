import { Box } from "@/src/components/ui/box";
import React from "react";
import { StyleSheet } from "react-native";

export const MainView = (props:{children:any}) => {
    return <Box style={styles.main}>{props.children}</Box>
}

const styles = StyleSheet.create({
    main:{
        width: '100%', 
        height: '100%'
    }
})