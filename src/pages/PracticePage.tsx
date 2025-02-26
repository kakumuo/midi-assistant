import React from "react";
import { Box } from "@/src/components/ui/box";
import { Pressable, StyleSheet } from "react-native";
import { Text } from "@/src/components/ui/text";
import { Selection } from "../components/Select";
import { HStack } from "../components/ui/hstack";
import { VStack } from "../components/ui/vstack";

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
            <VStack space="md" style={{flex: 1, padding: 8}}>
                <HStack space="md" style={{flex: 1}}>
                    <CardItem />
                    <CardItem />
                </HStack>
                <HStack space="md" style={{flex: 1}}>
                    <CardItem />
                    <CardItem />
                </HStack>
            </VStack>
        </Box>
    </Box>
}

const CardItem = (props:{children?:React.JSX.Element}) => {
    return (
        <Pressable style={styles.card_item}>
            <Text>Item</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    border: {
        borderColor: 'black', borderStyle: 'solid', borderWidth: 10
    },
    container: {
        flexDirection: 'column',
        flex: 1
    },

    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center', 
        gap: 16,
        padding: 16,
        flex: 0, flexBasis: 'auto'
    }, 
        session_dur_container: {
            marginLeft: 'auto'
        },
        session_dur:{
            fontWeight: 'bold'
        }, 
    main:{
        flex: 2, 
        borderColor: 'black', borderStyle: 'solid', borderWidth: 1
    },
    card_item: {
        flex: 1, backgroundColor: 'lightgray', borderRadius: 4
    },
    card_item_long: {
        flex: 2, backgroundColor: 'lightgray', borderRadius: 4
    }
})