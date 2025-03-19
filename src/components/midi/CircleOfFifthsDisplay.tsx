import React from 'react'
import { useActiveNotes } from '../../util/midi/InputManager';
import { InstrumentNote } from '../../util/midi';
import Color from 'colorjs.io';
import { useNoteColors } from '../../App';



const cofList: {note: InstrumentNote['key'], sharpDisplay: string, flatDisplay: string}[] =  [
    {note: 'C',  sharpDisplay: 'C'  , flatDisplay: 'C'}, 
    {note: 'G',  sharpDisplay: 'G'  , flatDisplay: 'G'}, 
    {note: 'D',  sharpDisplay: 'D'  , flatDisplay: 'D'}, 
    {note: 'A',  sharpDisplay: 'A'  , flatDisplay: 'A'}, 
    {note: 'E',  sharpDisplay: 'E'  , flatDisplay: 'E'}, 
    {note: 'B',  sharpDisplay: 'B'  , flatDisplay: 'Cb'}, 
    {note: 'F#', sharpDisplay: 'F#' , flatDisplay: 'Gb'}, 
    {note: 'C#', sharpDisplay: 'C#' , flatDisplay: 'Db'}, 
    {note: 'G#', sharpDisplay: 'B#' , flatDisplay: 'Ab'}, 
    {note: 'D#', sharpDisplay: 'Eb' , flatDisplay: 'Eb'}, 
    {note: 'A#', sharpDisplay: 'Bb' , flatDisplay: 'Bb'},  
    {note: 'F',  sharpDisplay: 'F'  , flatDisplay: 'F'},
]
const keys = ["C" , "C#" , "D" , "D#" , "E" , "F" , "F#" , "G" , "G#" , "A" , "A#" , "B"]

export const CoFDisplay = (props:{style?:React.CSSProperties, className?:string, id?:string, rootKey:InstrumentNote['key'], mode:string}) => {
    const containerRef = React.useRef<SVGSVGElement>(null); 
    const [containerSize, setContainerSize] = React.useState<{width: number, height: number}>({width: 0, height: 0});
    const activeNotes = useActiveNotes();  
    const noteColors = useNoteColors(); 

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
            const size = Math.min(width, height) / 14;  
            const padding = width / 10; 
            const xBasis = Math.cos(deg);
            const yBasis = Math.sin(deg);
            const x = (xBasis * (width - size - padding) / 2) + width / 2;
            const y = (yBasis * (height - size - padding) / 2) + height / 2;
            const offset = size * 3.25; 
            const xOffset = (xBasis * (width - size - offset - padding) / 2) + width / 2;
            const yOffset = (yBasis * (height - size - offset - padding) / 2) + height / 2;
            let isPressed = false; 
            activeNotes.forEach(n => {if(n.key === note.note) isPressed = true});

            return {note, x, y, isPressed, size, xOffset, yOffset};
        });
    }, [containerSize, activeNotes, cofList]);

    const noteElements = React.useMemo(() => {
        const rootI = keys.indexOf(props.rootKey)

        return notePositions.map(({note, x, y, isPressed, size, xOffset, yOffset}, i) =>{
            let bkgColor = "white"; 
            let color = "black"; 
            let sWidth = 2; 

            if(isPressed){
                bkgColor = noteColors[note.note]; 
                color = `${new Color(noteColors[note.note]).darken(.4)}`
            }

            let curNotePos = (keys.indexOf(note.note) + (12 - rootI)) % keys.length; 
            
            let targetShape = <circle cx={x} cy={y} r={size} stroke={color} strokeWidth={sWidth} fill={bkgColor} />

            if(curNotePos == 0 || curNotePos == 7 || curNotePos == 5){
                const r = size * .85; 
                targetShape = <rect width={r * 2} height={r * 2} x={x - r} y={y - r} stroke={color} strokeWidth={sWidth * (curNotePos ? 1 : 2)} fill={bkgColor} />
            }
            else if (curNotePos == 2 || curNotePos == 4 || curNotePos == 9){
                const pts:[number, number][] = [
                    [x - size, y + size / 2],
                    [x, (y + size) - size  * Math.sqrt(3) - size /2],
                    [x + size, y + size / 2],
                ]; 
                targetShape = <polygon points={pts.map(p => p.join(',')).join(' ')} stroke={color} strokeWidth={sWidth} fill={bkgColor} />
            }
            else if (curNotePos == 11) {
                const pts: [number, number][] = [
                    [x, y - size],
                    [x + size * Math.sqrt(3) / 2, y - size / 2],
                    [x + size * Math.sqrt(3) / 2, y + size / 2],
                    [x, y + size],
                    [x - size * Math.sqrt(3) / 2, y + size / 2],
                    [x - size * Math.sqrt(3) / 2, y - size / 2],
                ];
                
                targetShape = <polygon points={pts.map(p => p.join(',')).join(' ')} stroke={color} strokeWidth={sWidth} fill={bkgColor} />
            }


            let targetLabel:string = note.note;
            
            if(props.mode == 'Relative Minor')
                targetLabel = keys[(keys.indexOf(note.note) + 9) % 12].toLowerCase(); 


            return <g key={i}>
                {targetShape}
                <text x={x} y={y} dominantBaseline={'middle'} textAnchor='middle' fill={color} stroke={color}>{targetLabel}</text>
            </g>
        }); 
    }, [notePositions, props.rootKey, props.mode]);

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
