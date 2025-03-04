import { Box } from "@mui/joy";
import React from "react";
import Color from "colorjs.io";
import { InstrumentNoteKey, noteDataMap } from "../../util/midi";
import { useActiveNotes } from "../../util/midi/InputManager";
import { ItemPane } from ".";
import { StyleSheet } from "../../util";

const styles:StyleSheet = {
    container: {display: 'flex', alignItems: 'center', justifyContent: 'center'}
}

export const CoFView = (props: {style?:React.CSSProperties}) => {
    const [containerDim, setContainerDim] = React.useState({width: 0, height: 0})
    const activeNotes = useActiveNotes(); 
    const canvasRef = React.useRef<HTMLCanvasElement>(null); 
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if(!canvasRef.current) return; 
        const container = (canvasRef.current as HTMLCanvasElement); 
        const handleResize = () => {
            const {width, height} = container.getBoundingClientRect()
            setContainerDim({width: Math.min(width, height), height: Math.min(width, height)})
        }

        const observer = new ResizeObserver(handleResize); 
        observer.observe(container); 

        return () => observer.disconnect()
    })

    const cofList = React.useMemo(() => [
        {note: InstrumentNoteKey.C, display: 'C'}, 
        {note: InstrumentNoteKey.G, display: 'G'}, 
        {note: InstrumentNoteKey.D, display: 'D'}, 
        {note: InstrumentNoteKey.A, display: 'A'}, 
        {note: InstrumentNoteKey.E, display: 'E'}, 
        {note: InstrumentNoteKey.B, display: 'B'}, 
        {note: InstrumentNoteKey.F_SHARP, display: 'Gb/F#'}, 
        {note: InstrumentNoteKey.C_SHARP, display: 'Db'}, 
        {note: InstrumentNoteKey.G_SHARP, display: 'Ab'}, 
        {note: InstrumentNoteKey.D_SHARP, display: 'Eb'}, 
        {note: InstrumentNoteKey.A_SHARP, display: 'Bb'},  
        {note: InstrumentNoteKey.F, display: 'F'},
    ], []);

    const notePositions = React.useMemo(() => {
        if(!canvasRef.current) return [];
        const canvas = canvasRef.current;
        const {width, height} = containerDim

        canvas.width = width; 
        canvas.height = height; 

        return cofList.map((note, i) => {
            const deg = -Math.PI/2 + ((i * 360 / cofList.length) * Math.PI / 180); 
            const size = Math.min(width, height) / 7;  
            const padding = width / 10; 
            const xBasis = Math.cos(deg);
            const yBasis = Math.sin(deg);
            const x = (xBasis * (width - size - padding) / 2) + width / 2;
            const y = (yBasis * (height - size - padding) / 2) + height / 2;
            const offset = size * 1.25; 
            const xOffset = (xBasis * (width - size - offset - padding) / 2) + width / 2;
            const yOffset = (yBasis * (height - size - offset - padding) / 2) + height / 2;
            let isPressed = false; 
            activeNotes.forEach(n => {if(n.key === note.note) isPressed = true});

            return {note, x, y, isPressed, size, xOffset, yOffset};
        });
    }, [containerDim, activeNotes, cofList]);

    React.useEffect(() => {
        if (!canvasRef.current || notePositions.length === 0) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const activePositions = notePositions.filter(pos => pos.isPressed);
        ctx.globalAlpha = 0.3;
        for (let i = 0; i < activePositions.length; i++) {
            for (let j = i + 1; j < activePositions.length; j++) {
                const pos1 = activePositions[i];
                const pos2 = activePositions[j];
                ctx.beginPath();
                ctx.moveTo(pos1.xOffset, pos1.yOffset);
                ctx.lineTo(pos2.xOffset, pos2.yOffset);
                ctx.strokeStyle = noteDataMap[pos1.note.note].color;
                ctx.lineWidth = 4;
                ctx.stroke();
            }
        }

        ctx.globalAlpha = 1;
        notePositions.forEach((pos, i) => {
            const {x, y, size, isPressed, note} = pos;
            
            ctx.beginPath();
            if (i % 2) {
                ctx.arc(x, y, size/2, 0, Math.PI * 2);
            } else {
                ctx.rect(x - size/2, y - size/2, size, size);
            }
            
            const color = isPressed ? noteDataMap[note.note].color : 'white';
            const borderColor = isPressed ? 
                new Color(noteDataMap[note.note].color).darken() : 
                'black';
            
            ctx.fillStyle = color;
            ctx.fill();
            ctx.lineWidth = 4;
            ctx.strokeStyle = `${borderColor}`;
            ctx.stroke();

            ctx.fillStyle = isPressed ? `${borderColor}` : 'black';
            ctx.font = `${size/3}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(note.display, x, y);
        });

    }, [notePositions]);

    return (
        <ItemPane ref={containerRef} style={{...props.style, ...styles.container}}> 
            <canvas 
                ref={canvasRef}
                style={{
                    width: "300px",
                    height: "300px", 
                    borderRadius: '50%', 
                }}
            />
        </ItemPane>
    ); 
} 