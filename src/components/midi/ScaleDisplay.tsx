import React from 'react'
import { useActiveNotes } from '../../util/midi/InputManager';
import { InstrumentNote, InstrumentNoteKey, noteDataMap } from '../../util/midi';
import Color from 'colorjs.io';

const NOTE_RAD = 3; 
const NOTE_SPACING = 4; 
const BAR_SPACING = 4; 

export const ScaleDisplay = (props:{style?:React.CSSProperties}) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null); 
    const clefImgRef = React.useRef<HTMLImageElement>(null); 
    const activeNotes = useActiveNotes(); 

    React.useEffect(() => {
        if(!clefImgRef.current) return; 
        if(!canvasRef.current) return; 
        const ctx = canvasRef.current.getContext('2d'); 
        if(!ctx) return; 

        const {width, height} = canvasRef.current.getBoundingClientRect(); 
        canvasRef.current.width = width; 
        canvasRef.current.height = height; 

        // Clear the canva
        ctx.clearRect(0, 0, width, height); 

        const numBars = 7; 
        const barWidth = 3; 
        const barSpacing = height / numBars / 1.5; 
        const barOffset = 60; 


        // draw staff
        ctx.strokeStyle = 'black'; 
        ctx.lineWidth = barWidth; 
        for(let i = 0; i < numBars; i++){
            if(i >= 1 && i <= 5){
                const yPos = (i * (barSpacing + barWidth)) + barOffset; 
                ctx.moveTo(0, yPos); 
                ctx.lineTo(width, yPos); 
                ctx.stroke(); 
            }
        }

        // draw clef
        const clefWidth = 100; 
        ctx.drawImage(clefImgRef.current, 0, 0, clefWidth, height); 

        // draw notes + bars outside of staff
        const noteRad = barSpacing * .9 / 2; 
        const noteSpacing = noteRad * 2; 
        const noteHoriOffset = noteSpacing + clefWidth + noteRad / 2; 
        let j = 0; 

        const noteMap:InstrumentNote['key'][] = ['C','D','E','F','G','A','B','C','D','E','F','G']; 

        for(const note of activeNotes){
            // Get the base note without any accidentals
            const baseNote = note.key.replace('#', '') as InstrumentNote['key'];
            // Check if this note is already being pressed by looking at previous notes in activeNotes
            // const isLowerOctavePressed = [...activeNotes].slice(0, [...activeNotes].indexOf(note)).some(n => 
            //     n.key.replace('#', '') === baseNote
            // );
            // // If a lower octave of this note is already pressed, use the next higher position
            // const noteI = noteMap.indexOf(baseNote) + (isLowerOctavePressed ? noteMap.length / 2 + 1 : 0);
            
            const noteI = noteMap.indexOf(baseNote)

            const {x, y} = {
                x: noteHoriOffset + (j * (noteSpacing + noteRad)), 
                y: height - barOffset - (noteI * (barWidth + barSpacing)) / 2 + ((barWidth + noteRad) / 2)
            }

            if(!(noteI >= 1 && noteI <= 5)){
                ctx.beginPath(); 
                ctx.moveTo(x - noteRad / 2, y); 
                ctx.lineTo(x + noteRad / 2, y); 
                ctx.closePath(); 
            }

            const spaceOffset = 0;
            // const spaceOffset = noteI % 2 ? -1 * noteRad / 2 : 0; 
            ctx.beginPath();
            ctx.fillStyle = noteDataMap[note.key].color; 
            ctx.arc(x, y + spaceOffset, noteRad, 0, Math.PI * 2); 
            ctx.fill(); 
            ctx.textAlign = 'center', 
            ctx.fillStyle = new Color(noteDataMap[note.key].color).darken(.5) + ""; 
            ctx.font = `${noteRad}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(note.key, x, y);
            ctx.closePath(); 
            j++; 
        }



    }, [activeNotes, clefImgRef.current]); // Re-render when active notes change

    return <canvas ref={canvasRef} style={props.style}>
        <img ref={clefImgRef} src='treble.webp'></img>
    </canvas>
}