import React from 'react'
import { useActiveNotes } from '../../util/midi/InputManager';
import { InstrumentNote } from '../../util/midi';
import Color from 'colorjs.io';
import { useNoteColors } from '../../App';



const cofList: {note: InstrumentNote['key'], display: string}[] =  [
    {note: 'C', display: 'C'}, 
    {note: 'G', display: 'G'}, 
    {note: 'D', display: 'D'}, 
    {note: 'A', display: 'A'}, 
    {note: 'E', display: 'E'}, 
    {note: 'B', display: 'B'}, 
    {note: 'F#', display: 'Gb/F#'}, 
    {note: 'C#', display: 'Db'}, 
    {note: 'G#', display: 'Ab'}, 
    {note: 'D#', display: 'Eb'}, 
    {note: 'A#', display: 'Bb'},  
    {note: 'F', display: 'F'},
]

export const CoFDisplay = (props:{style?:React.CSSProperties, className?:string, id?:string, rootKey?:InstrumentNote['key']}) => {
    const containerRef = React.useRef<SVGSVGElement>(null); 
    const [containerSize, setContainerSize] = React.useState<{width: number, height: number}>({width: 0, height: 0});
    const activeNotes = useActiveNotes();  
    const {noteColors} = useNoteColors(); 

    React.useEffect(() => {
        if(!containerRef || !containerRef.current) return; 

        const handleResize = () => {
            if(!containerRef.current) return; 
            setContainerSize(containerRef.current.getBoundingClientRect()); 
        }

        const observer = new ResizeObserver(handleResize); 
        observer.observe(containerRef.current); 

        return () => observer.disconnect(); 
    }, [containerRef]); 

    const notePositions = React.useMemo(() => {
        let {width, height} = containerSize
        
        return cofList.map((note, i) => {
            const deg = -Math.PI/2 + ((i * 360 / cofList.length) * Math.PI / 180); 
            const size = Math.min(width, height) / 12;  
            const padding = width / 10; 
            const xBasis = Math.cos(deg);
            const yBasis = Math.sin(deg);
            const x = (xBasis * (width - size - padding) / 2) + width / 2;
            const y = (yBasis * (height - size - padding) / 2) + height / 2;
            const offset = size * 2.25; 
            const xOffset = (xBasis * (width - size - offset - padding) / 2) + width / 2;
            const yOffset = (yBasis * (height - size - offset - padding) / 2) + height / 2;
            let isPressed = false; 
            activeNotes.forEach(n => {if(n.key === note.note) isPressed = true});

            return {note, x, y, isPressed, size, xOffset, yOffset};
        });
    }, [containerSize, activeNotes, cofList]);

    const noteElements = React.useMemo(() => {
        return notePositions.map(({note, x, y, isPressed, size, xOffset, yOffset}, i) =>{
            let bkgColor = "white"; 
            let color = "black"; 

            if(isPressed){
                bkgColor = noteColors[note.note]; 
                color = `${new Color(noteColors[note.note]).darken(.4)}`
            }

            let targetShape = <circle cx={x} cy={y} r={size} stroke={color} strokeWidth={2} fill={bkgColor} />

            if(props.rootKey && note.note == props.rootKey)
                targetShape = <rect width={size * 2} height={size * 2} x={x - size} y={y - size} stroke={color} strokeWidth={2} fill={bkgColor} />

            return <g key={i}>
                {targetShape}
                <text x={x} y={y} dominantBaseline={'middle'} textAnchor='middle' fill={color} stroke={color}>{note.display}</text>
            </g>
        }); 
    }, [notePositions]);

    const noteConnections = React.useMemo(() => {
        const connections:React.JSX.Element[] = []; 
        const activePositions = notePositions.filter(p => p.isPressed)

        const points = activePositions.map(p => `${Math.round(p.xOffset)},${Math.round(p.yOffset)}`)
        
        if(activePositions.length >= 3)
            points.push(points[0])

        return <polygon 
            points={points.join(' ')}
            fill='none'
            stroke='black'
            strokeWidth={4}
            strokeDasharray={'10,10'}
            strokeLinejoin='miter'
        />
    }, [notePositions])

    
    // return <svg ref={containerRef} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${containerSize.width} ${containerSize.height}`} style={style}>
    //     {noteElements}
    //     {noteConnections}
    // </svg>

    return <svg ref={containerRef} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${containerSize.width} ${containerSize.height}`} style={props.style}>
        {noteElements}
        {noteConnections}
    </svg>
}
