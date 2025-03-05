import { Box, Button, Typography } from "@mui/joy";
import { StyleSheet } from "../util";

export type NavigationOption = {
    label: string;
    target: React.ReactNode;
}

export const NavigationBar = (props: {options: NavigationOption[], curPageI: number, setCurPageI: (i: number) => void}) => {
    return (
        <Box style={styles.navBar}>
            <Typography level="h2">midi-assist</Typography>
            <Box style={styles.navOptions}>
                {props.options.map((option, optionI) => (
                    <Button variant={props.curPageI === optionI ? "solid" : "outlined"} onClick={() => props.setCurPageI(optionI)} key={option.label}>{option.label}</Button>
                ))}
            </Box>
        </Box>
    )
}

const styles:StyleSheet = {
    navBar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    }, 
    navOptions: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 4,
    }   
}
