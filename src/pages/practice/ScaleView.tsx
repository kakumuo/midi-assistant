import React from "react";
import { useActiveNotes } from "../../util/midi/InputManager";
import { InstrumentKey, InstrumentNote } from "../../util/midi";
import { useNoteColors } from "../../App";


const noteStaffMap:InstrumentNote[] = [
    new InstrumentNote('B', 5),
    new InstrumentNote('A', 5),
    new InstrumentNote('G', 5),
    new InstrumentNote('F', 5),
    new InstrumentNote('E', 5),
    new InstrumentNote('D', 5),
    new InstrumentNote('C', 5),
    new InstrumentNote('B', 4),
    new InstrumentNote('A', 4),
    new InstrumentNote('G', 4),
    new InstrumentNote('F', 4),
    new InstrumentNote('E', 4),
    new InstrumentNote('D', 4),
    new InstrumentNote('C', 4),

    new InstrumentNote('B', 3),
    new InstrumentNote('A', 3),
    new InstrumentNote('G', 3),
    new InstrumentNote('F', 3),
    new InstrumentNote('E', 3),
    new InstrumentNote('D', 3),
    new InstrumentNote('C', 3),
    new InstrumentNote('B', 2),
    new InstrumentNote('A', 2),
    new InstrumentNote('G', 2),
    new InstrumentNote('F', 2),
    new InstrumentNote('E', 2),
    new InstrumentNote('D', 2),
    new InstrumentNote('C', 2),
]

const trebleRange: {start: InstrumentNote, end:InstrumentNote} = {
    start:  new InstrumentNote('F',5), 
    end:    new InstrumentNote('E',4)
}

const cleffRange: {start: InstrumentNote, end:InstrumentNote} = {
    start:  new InstrumentNote('A',3), 
    end:    new InstrumentNote('G',2)
}

export const ScaleView = (props:{style?:React.CSSProperties, clefType?:'bass'|'treble'|'grand', key:InstrumentNote['key']}) => {
    const ref = React.useRef<SVGSVGElement>(null); 
    const [containerDim, setCotnainerDim] = React.useState({width: 0, height: 0});
    const activeNotes = useActiveNotes(); 
    const noteColors = useNoteColors(); 

    React.useEffect(() => {
        if(!ref.current || !ref.current) return; 

        const handleResize = () => {
            if(!ref.current || !ref.current) return; 
            setCotnainerDim(ref.current.getBoundingClientRect())
        }

        const observer = new ResizeObserver(handleResize); 
        observer.observe(ref.current); 

        return () => {
            observer.disconnect(); 
        }
    }, [ref]); 

    const notesSorted = React.useMemo(() => {
        return [...activeNotes].sort((a, b) => a.valueOf() - b.valueOf())
    }, [activeNotes])


    const {bars, notes, clefs} = React.useMemo(() => {
        const {width, height} = containerDim; 
        const clefWidth = width  * .2;
        
        const padding = height * .05; 
        const grandStaffSpacing = height * .1; 
        const remHeight = height - (padding * 2) - grandStaffSpacing; 
        const barWidth = 2;
        const halfBarSpacing = remHeight / noteStaffMap.length; // moving half step at a time 
        const noteRx = halfBarSpacing; 
        const noteRy = halfBarSpacing * .8; 

        const bars:React.JSX.Element[] = []; 
        const notes:React.JSX.Element[] = []; 
        const clefs:React.JSX.Element[] = []; 

        let curHeight = padding; 
        let inStaff = false; 

        const noteShiftAmount:number[] = []; 
        const notesByLine:string[] = ['C','D', 'E', 'F', 'G', 'A', 'B']
        let lastNotePlace:number[] = [0, 0, 0, 0];  //[0, 1, 2, 3]
        for(let i = 0; i < notesSorted.length; i++){        
            const noteI:number = notesByLine.indexOf(notesSorted[i].key.charAt(0)) + notesSorted[i].octave; 

            for(let j = 0; j < lastNotePlace.length; j++){
                if(noteI - lastNotePlace[j] >= 2){
                    lastNotePlace[j] = noteI; 
                    noteShiftAmount.push(j); 
                    break; 
                }
            }
        }

        
        let trebleBounds:[number, number] = [-1, -1]; 
        let bassBounds:[number, number] = [-1, -1]; 

        for(let i = 0; i < noteStaffMap.length; i++){
            const curNote = noteStaffMap[i];
            if(curNote.equals(trebleRange.start) || curNote.equals(cleffRange.start)) inStaff = true; 
            

            if(curNote.equals(new InstrumentNote('B', 3)))
                curHeight += padding

            if(inStaff && i % 2){
                bars.push(<line key={i} x1={0} x2={width} y1={curHeight} y2={curHeight} strokeWidth={barWidth} stroke="black" />)
                curHeight += barWidth; 
            }

            if(curNote.equals(new InstrumentNote('A', 5)))
                trebleBounds[0] = curHeight; 
            if(curNote.equals(new InstrumentNote('C', 4)))
                trebleBounds[1] = curHeight; 

            if(curNote.equals(new InstrumentNote('A', 3)))
                bassBounds[0] = curHeight; 
            if(curNote.equals(new InstrumentNote('B', 2)))
                bassBounds[1] = curHeight; 
   
            notesSorted.forEach((n, j) => {
                if(!n.equals(curNote, true)) return;  
                
                const [noteX, noteY] = [(width / 2) + (noteShiftAmount[j] * noteRx * 2), curHeight - barWidth / 2]
                if(!inStaff && i % 2) {
                    bars.push(<line key={i} x1={noteX - noteRx * 2} x2={noteX + noteRx * 2} y1={curHeight} y2={curHeight} strokeWidth={barWidth} stroke="black" />)
                }
                
                notes.push(
                    <g>
                        <ellipse key={i} cx={noteX} cy={noteY} 
                            rx={noteRx} ry={noteRy} stroke='black' 
                            strokeWidth={1} fill={noteColors.noteColors[n.key]} 
                            style={{transform: 'rotate(-30deg)', transformOrigin: `${noteX}px ${noteY}px`}}>
                        </ellipse>
                        <text x={noteX} y={noteY} textAnchor="middle" dominantBaseline={'middle'} fontSize={noteRx} fontWeight={'bold'} 
                            style={{mixBlendMode: 'difference', filter: 'grayscale(100%) invert(1)'}}
                        >{n.key}</text>
                    </g>

                )
            })

            if (curNote.equals(trebleRange.end) || curNote.equals(cleffRange.end)) inStaff = false; 

            curHeight += halfBarSpacing; 
        }

        if(trebleBounds[0] > 0) {
            const targetHeight = (trebleBounds[1] - trebleBounds[0]) * 1.05
            const yPos = trebleBounds[0]

            clefs.push(
                <image href="treble.webp" y={yPos} width={"auto"} height={targetHeight} />
            )
        }

        if(bassBounds[0] > 0) {
            const targetHeight = (bassBounds[1] - bassBounds[0]) * 1.05
            const yPos = bassBounds[0]

            clefs.push(
                <image href="bass.png" y={yPos} width={"auto"} height={targetHeight} />
            )
        }


        return {bars, notes, clefs}
    }, [containerDim, activeNotes]); 

    
    return <svg ref={ref} style={props.style}>
        {bars}
        {notes}
        {clefs}
    </svg>
}