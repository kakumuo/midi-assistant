import React from "react";

export type StyleSheet = {[key:string]: React.CSSProperties}
export const formatDurationString = (target:number) => {
    const hours = Math.floor(target / 3600);
    const minutes = Math.floor((target % 3600) / 60);
    const seconds = target % 60;
    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    result += `${seconds}s`;
    return result; 
}