import { Box } from "@mui/joy";
import { StyleSheet } from "../util/types.d";
import React from "react";

type MainPageProps = {
    children?: React.ReactNode;
    style?: React.CSSProperties;
}

export const MainPage = (props: MainPageProps) => {
    return (
        <Box style={{
            ...styles.container,
            ...props.style
        }}>
            {props.children}
        </Box>
    )
}

const styles: StyleSheet = {
    container: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#fff',
        height: '100%',
        width: '100%',
        border: 'solid lightgray 1px'
    }
}
