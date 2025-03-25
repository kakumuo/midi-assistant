import React from "react";
import { InstrumentEvent, InstrumentEventType, InstrumentNote, InstrumentNoteEvent } from "../../util/midi";
import { InstrumentInputContext } from "../../util/midi/InputManager";
import shadows from "@mui/material/styles/shadows";
import { generateTest } from "./generateTest";
import { ArrowUpward, NoteSharp } from "@mui/icons-material";


const noteBarList:InstrumentNote[] = [
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

    // new InstrumentNote('B', 3),
    // new InstrumentNote('A', 3),
    // new InstrumentNote('G', 3),
    // new InstrumentNote('F', 3),
    // new InstrumentNote('E', 3),
    // new InstrumentNote('D', 3),
    // new InstrumentNote('C', 3),
    // new InstrumentNote('B', 2),
    // new InstrumentNote('A', 2),
    // new InstrumentNote('G', 2),
    // new InstrumentNote('F', 2),
    // new InstrumentNote('E', 2),
    // new InstrumentNote('D', 2),
    // new InstrumentNote('C', 2),
]

const trebleRange: {start: InstrumentNote, end:InstrumentNote} = {
    start:  new InstrumentNote('F',5), 
    end:    new InstrumentNote('E',4)
}

const cleffRange: {start: InstrumentNote, end:InstrumentNote} = {
    start:  new InstrumentNote('A',3), 
    end:    new InstrumentNote('G',2)
}

const BAR_WIDTH = 2; 
export const TestDisplay = (props:{style?:React.CSSProperties, testNotes:InstrumentNote[]}) => {
    const ref = React.useRef<SVGSVGElement>(null); 
    const [containerDim, setCotnainerDim] = React.useState({width: 0, height: 0});
    const [testNotes, setTestNotes] = React.useState<InstrumentNote[]>([]); 
    const {inputManager} = React.useContext(InstrumentInputContext); 

    React.useEffect(() => {
        setTestNotes(props.testNotes)
    }, [props.testNotes])

    // Input Manager
    React.useEffect(() => {
        const handleInput = (ev:InstrumentEvent) => {
            if(ev.type != InstrumentEventType.NOTE || !ev.isPressed) return; 
            const e = ev as InstrumentNoteEvent; 

            setTestNotes(t => {
                if(t[0].valueOf() == e.note.valueOf())
                    return t.slice(1); 
            
                return t; 
            })
        }

        inputManager.addListener(InstrumentEventType.NOTE, handleInput)

        return () => inputManager.removeListener(InstrumentEventType.NOTE, handleInput)
    }, [inputManager])

    // Resize Handler
    React.useEffect(() => {
        if(!ref.current || !ref.current) return; 

        const handleResize = () => {
            if(!ref.current || !ref.current) return; 
            setCotnainerDim(ref.current.getBoundingClientRect())
        }

        const observer = new ResizeObserver(handleResize); 
        observer.observe(ref.current); 

        return () => observer.disconnect(); 
    }, [ref]); 

    const {notes, bars, cursor, clef} = React.useMemo(() => {
        const notes:React.JSX.Element[] = [];
        const bars:React.JSX.Element[] = [];
        const cursor:React.JSX.Element[] = [];
        const clef:React.JSX.Element[] = [];   
        
        const PADDING = 32
        const {width, height} = containerDim; 
        const numLines = noteBarList.length; 
        const barSpacing = (height - (PADDING * 2) - (BAR_WIDTH * numLines)) / (numLines - 1);
        let curY = PADDING
        const noteBarPosMap:{[key: number]: number} = {}

        for(let i = 0; i < numLines; i++){
            const curNoteBar = noteBarList[i]; 

            if(curNoteBar.valueOf() >= trebleRange.end.valueOf() && curNoteBar.valueOf() <= trebleRange.start.valueOf() && i % 2)
                bars.push(
                    <line key={'bar-' + curNoteBar.toString()} x1={0} x2={width} y1={curY} y2={curY}/>
                )
            
            noteBarPosMap[curNoteBar.valueOf()] = curY; 
            curY += barSpacing; 
        }

        // add clef
        const clefHeight = noteBarPosMap[InstrumentNote.getValue('C',4)] - noteBarPosMap[InstrumentNote.getValue('B',5)]
        + barSpacing + BAR_WIDTH * 2; 
        const clefYPos = noteBarPosMap[InstrumentNote.getValue('B',5)] + BAR_WIDTH * 2; 
        clef.push(
            <image href="treble.webp" y={clefYPos} x={PADDING} height={clefHeight} />
        )


        // add notes
        const NOTE_HORI_SPACING = 64; 
        const CLEF_OFFSET = 200; 
        let curX = CLEF_OFFSET; 
        const noteRx = barSpacing; 
        const noteRy = noteRx * .75; 

        for(let i = 0; i < testNotes.length; i++){
            const curNote = testNotes[i]; 

            const normNote = InstrumentNote.fromNote(curNote.toString().replace("#", ""))
            const curY = noteBarPosMap[normNote.valueOf()]
            
            const group = []
            group.push(
                <ellipse cx={curX} cy={curY} rx={noteRx} ry={noteRy} 
                    fill="white" stroke="black" strokeWidth={2}
                    style={{transform: 'rotate(-15deg)', transformOrigin: `${curX}px ${curY}px`}}
                />
            )

            if(curNote.key.indexOf("#") > 0){
                group.push(
                    <text x={curX - (noteRx * 1.5)} y={curY} children="#" fontSize={noteRx * 1.5}  
                        fontWeight={'bold'}
                        textAnchor="middle" dominantBaseline={'middle'} 
                    />
                )
            }

            group.push(
                <text x={curX} y={curY} textAnchor="middle" dominantBaseline={'middle'} 
                    fontSize={noteRy} fontWeight={'bold'} 
                    children={normNote.key}
                />
            )

            // add lines for out of staff notes
            const cVal = normNote.valueOf(); // use note normalized to get around accidentals
            const tStartVal = trebleRange.start.valueOf(); 
            const tEndVal = trebleRange.end.valueOf(); 
            if((cVal < tEndVal && tEndVal - cVal > 2) || (cVal > tStartVal && cVal - tStartVal > 2) ) {
                let lineY = curY;
                
                if(cVal > tStartVal && ((cVal - tStartVal) / 2) % 2 != 0){
                    lineY += noteRx; 
                }

                bars.push(
                    <line x1={curX - (noteRx * 2)} x2={curX + (noteRx * 2)} y1={lineY} y2={lineY} />
                ); 
            }

            notes.push(<g key={i}>{group}</g>)
            curX += NOTE_HORI_SPACING + noteRx;
        }
        
        return {notes, bars, cursor, clef}
    }, [containerDim, testNotes])

    return <svg ref={ref} style={props.style}>
        <g stroke="black" strokeWidth={BAR_WIDTH}>
            {bars}
        </g>
        {notes}
        {clef}
    </svg>
}