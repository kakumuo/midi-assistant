import React from "react";

export type StyleSheet = {[key:string]: React.CSSProperties}
export const formatDurationString = (startTS:Date) => {
    const diff = Math.floor((Date.now() - startTS.getTime()) / 1000); // Convert to seconds

    const seconds = diff % 60; 
    const minutes = Math.floor(diff / 60)% 60; 
    const hours = Math.floor(diff / 60 / 60) % 60; 

    let res:string[] = [`${seconds} s`]

    if(minutes > 0) res.push(`${minutes} m`)
    if(hours > 0) res.push(`${hours} h`)

    return `${res.reverse().join(" ")}`
}