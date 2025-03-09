import React from 'react'
import { useActiveNotes } from '../../util/midi/InputManager';
import { InstrumentNoteKey } from '../../util/midi';
import Color from 'colorjs.io';
import { useNoteColors } from '../../App';


export const CoFDisplay = (props:{style?:React.CSSProperties, className?:string, id?:string}) => {
    const [containerDim, setContainerDim] = React.useState({width: 0, height: 0})
    const activeNotes = useActiveNotes(); 
    const canvasRef = React.useRef<HTMLCanvasElement>(null); 
    const containerRef = React.useRef<HTMLDivElement>(null);
    const {noteColors} = useNoteColors();

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
    }, [])

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
                ctx.strokeStyle = noteColors[pos1.note.note];
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
                ctx.lineJoin = 'bevel'
                ctx.rect(x - size/2, y - size/2, size, size);
            }
            
            const color = isPressed ? noteColors[note.note] : 'white';
            const borderColor = isPressed ? 
                new Color(noteColors[note.note]).darken() : 
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

    }, [notePositions, noteColors]);

    return <canvas className={props.className} id={props.id} style={props.style} ref={canvasRef} />
}