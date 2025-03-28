import React from "react";
import { InstrumentEvent, InstrumentEventType, InstrumentNote, InstrumentNoteEvent, InstrumentKey } from "../../util/midi";
import { InstrumentInputContext, useActiveNotes } from "../../util/midi/InputManager";
import shadows from "@mui/material/styles/shadows";
import { generateTest } from "./generateTest";
import { ArrowUpward, FlareSharp, NoteSharp } from "@mui/icons-material";
import { NoteResult, StaffDisplayRange, TestConfig } from "./types";
import { useNoteColors } from "../../App";


// Circle of Fifths
const keySignatureTrebleFlatsList:InstrumentNote[] = [
    new InstrumentNote('B', 4),
    new InstrumentNote('E', 5), 
    new InstrumentNote('A', 4),
    new InstrumentNote('D', 5),
    new InstrumentNote('G', 4),
    new InstrumentNote('C', 5),
    new InstrumentNote('E', 4),
]

const keySignatureBassFlatsList:InstrumentNote[] =[
     new InstrumentNote('B', 2),
     new InstrumentNote('E', 3), 
     new InstrumentNote('A', 2),
     new InstrumentNote('D', 3),
     new InstrumentNote('G', 2),
     new InstrumentNote('C', 3),
     new InstrumentNote('E', 2),
 ]

const keySignatureTrebleSharpsList:InstrumentNote[] = [
    new InstrumentNote('F', 5),
    new InstrumentNote('C', 5),
    new InstrumentNote('G', 5),
    new InstrumentNote('D', 5),
    new InstrumentNote('A', 4),
    new InstrumentNote('E', 5),
    new InstrumentNote('B', 4),
]

const keySignatureBassSharpsList:InstrumentNote[] = [
    new InstrumentNote('F', 3),
    new InstrumentNote('C', 3),
    new InstrumentNote('G', 3),
    new InstrumentNote('D', 3),
    new InstrumentNote('A', 2),
    new InstrumentNote('E', 3),
    new InstrumentNote('B', 2),
]

const sharpOrder:InstrumentNote['key'][] = [
    'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#'
]

const flatOrder:InstrumentKey[] = [
    'C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'
]



const trebleRange: StaffDisplayRange = {
    bars: [
        new InstrumentNote('F', 5),
        new InstrumentNote('D', 5),
        new InstrumentNote('B', 4),
        new InstrumentNote('G', 4),
        new InstrumentNote('E', 4),
    ],
    defaultMax: new InstrumentNote('B', 5),
    defaultMin: new InstrumentNote('C', 4),
}

const bassRange: StaffDisplayRange = {
    bars: [
        new InstrumentNote('A', 3),
        new InstrumentNote('F', 3),
        new InstrumentNote('D', 3),
        new InstrumentNote('B', 2),
        new InstrumentNote('G', 2),
    ],
    defaultMax: new InstrumentNote('E', 4),
    defaultMin: new InstrumentNote('E', 2),
}

const BAR_WIDTH = 2; 
export const TestDisplay = (props:{style?:React.CSSProperties, testNotes:InstrumentNote[], testConfig:TestConfig, onTestComplete:(results:NoteResult[])=>void}) => {
    const ref = React.useRef<SVGSVGElement>(null); 
    const noteColors = useNoteColors()
    const activeNotes = useActiveNotes(); 
    const [containerDim, setCotnainerDim] = React.useState({width: 0, height: 0});
    const [testNotes, setTestNotes] = React.useState<InstrumentNote[]>([]); 
    const [noteResult, setNoteResult] = React.useState<NoteResult[]>([]); 
    const [curNoteI, setCurNoteI] = React.useState<number>(0); 
    const [testStartTS, setTestStartTS] = React.useState(-1)
    const {inputManager} = React.useContext(InstrumentInputContext); 

    React.useEffect(() => {
        setTestNotes(props.testNotes);
        setNoteResult(props.testNotes.map(n => ({
            hitTiming: 0, 
            hitVelocity: 0, 
            missedNotes: [], 
            startAttemptTiming: 0, 
            targetNotes: [n.valueOf()]
        } as NoteResult)))
        setTestStartTS(Date.now())
        setCurNoteI(0)
    }, [props.testNotes]); 


    // Input Manager
    React.useEffect(() => {
        const handleInput = (ev:InstrumentEvent) => {
            if(ev.type != InstrumentEventType.NOTE || !ev.isPressed) return; 
            const e = ev as InstrumentNoteEvent; 
            
            const hitNote = testNotes[curNoteI].valueOf() == e.note.valueOf()
            const curI = curNoteI 
            const tmpResults = [...noteResult]; 
        
            if(tmpResults[curI].startAttemptTiming == 0) tmpResults[curI].startAttemptTiming = Date.now()
            if(!hitNote) tmpResults[curI].missedNotes.push(e.note.valueOf()); 
            else {
                tmpResults[curI].hitTiming = Date.now(); 
                tmpResults[curI].hitVelocity = e.velocity; 
            }

            if(curNoteI == 0) setTestStartTS(ts => ts == -1 ? Date.now() : ts)

            setCurNoteI(i => i + (hitNote ? 1 : 0)); 
            if(curI == testNotes.length - 1 && hitNote) props.onTestComplete(tmpResults)
        }

        inputManager.addListener(InstrumentEventType.NOTE, handleInput)

        return () => inputManager.removeListener(InstrumentEventType.NOTE, handleInput)
    }, [inputManager, testNotes, curNoteI])

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

    const barList = React.useMemo<InstrumentNote[]>(() => {
        const res:InstrumentNote[] = []; 
        let [start, end] = [0, 0]

        if(props.testConfig.staff == 'Bass'){
            start = bassRange.defaultMax.valueOf()
            end = bassRange.defaultMin.valueOf()
        } else if (props.testConfig.staff == 'Treble'){
            start = trebleRange.defaultMax.valueOf(); 
            end = trebleRange.defaultMin.valueOf(); 
        }else {
            start = trebleRange.defaultMax.valueOf(); 
            end = bassRange.defaultMin.valueOf(); 
        }

        for(let i = start; i >= end; i--){
            if(!InstrumentNote.isAccidental(i)) res.push(InstrumentNote.fromValue(i)); 
        }

        return res; 
    }, [props.testConfig])


    // TODO: separate bar, clef and key signature rendering out from note rendering
    const {bars, sharpsFlats, clef, xOffset, noteBarPosMap, barSpacing} = React.useMemo(() => {
        const bars:React.JSX.Element[] = [];
        const keySignature:React.JSX.Element[] = [];
        const clef:React.JSX.Element[] = [];   
        
        const PADDING = 32
        const STAFF_SPACING = 10
        const {width, height} = containerDim; 
        const numLines = barList.length; 
        const barSpacing = (height - (PADDING * 2) - (BAR_WIDTH * numLines) - (props.testConfig.staff == 'Grand' ? STAFF_SPACING : 0)) / (numLines - 1);
        let curY = PADDING
        const noteBarPosMap:{[key: number]: number} = {}

        for(let i = 0; i < numLines; i++){
            const curNoteBar = barList[i]; 

            const isInTrebleStaff = trebleRange.bars.findIndex(b => b.valueOf() == curNoteBar.valueOf()) != -1
                && props.testConfig.staff != 'Bass'
            const isInBassStaff = bassRange.bars.findIndex(b => b.valueOf() == curNoteBar.valueOf()) != -1 && 
                props.testConfig.staff != 'Treble'

            if(isInTrebleStaff || isInBassStaff)
                bars.push(
                    <line key={'bar-' + curNoteBar.toString()} x1={0} x2={width} y1={curY} y2={curY}/>
                )
            
            noteBarPosMap[curNoteBar.valueOf()] = curY; 

            if(props.testConfig.staff == 'Grand' && curNoteBar.equals(new InstrumentNote('C', 4)))
                curY += STAFF_SPACING
            curY += barSpacing; 
        }

        if(props.testConfig.staff != 'Bass'){
            // add clef
            const clefHeight = noteBarPosMap[InstrumentNote.getValue('C',4)] - noteBarPosMap[InstrumentNote.getValue('B',5)]
            + barSpacing + BAR_WIDTH * 2; 
            const clefYPos = noteBarPosMap[InstrumentNote.getValue('B',5)] + BAR_WIDTH * 2; 

            clef.push(
                <image href="treble.webp" y={clefYPos} x={PADDING} height={clefHeight} />
            )
        }

        if(props.testConfig.staff != 'Treble') {
            // add clef
            const clefHeight = noteBarPosMap[InstrumentNote.getValue('C',3)] - noteBarPosMap[InstrumentNote.getValue('A',3)]
            + barSpacing + BAR_WIDTH * 2; 
            const clefYPos = noteBarPosMap[InstrumentNote.getValue('A',3)] + BAR_WIDTH * 2; 

            clef.push(
                <image href="bass.png" y={clefYPos} x={PADDING} height={clefHeight} />
            )
        }

        // add sharps and flats; ignore if scale is not in C
        const SIG_SPACING = 0;
        const ACC_WIDTH = 15; 
        const CLEF_OFFSET = 160; 
        let xOffset = CLEF_OFFSET; 
        const testKey = props.testConfig.key; 

        let targetBassSigList = keySignatureBassSharpsList; 
        let targetTrebleSigList = keySignatureTrebleSharpsList; 
        let targetI = sharpOrder.indexOf(testKey); 
        let accImagePath:string = 'sharp.png'; 

        if(targetI ==  -1) {
            targetI = flatOrder.indexOf(testKey); 
            targetBassSigList = keySignatureBassFlatsList; 
            targetTrebleSigList = keySignatureTrebleFlatsList; 
            accImagePath = 'flat.png'; 
        }

        // since treble and bass keysignature are stored in one list, use pos & pos+7
        for(let sigI = 0; sigI < targetI; sigI++){
            const tmpList = []
            tmpList.push(targetBassSigList[sigI])
            tmpList.push(targetTrebleSigList[sigI])
            console.log(sigI, tmpList)
            for(let sig of tmpList){
                
                if(!noteBarPosMap.hasOwnProperty(sig.valueOf())) continue; 
                const height = barSpacing * 2
                const width = ACC_WIDTH
                const yPos = noteBarPosMap[sig.valueOf()] - (height / 2)
                const xPos = xOffset - (width /2)
                keySignature.push(
                    <image preserveAspectRatio="none" href={accImagePath} width={width} height={height} y={yPos} x={xPos}  />
                )   
            }
            xOffset += SIG_SPACING + ACC_WIDTH
        }
        xOffset += SIG_SPACING + ACC_WIDTH;

        return {bars, sharpsFlats: keySignature, clef, xOffset, noteBarPosMap, barSpacing}
    }, [containerDim, barList])

    const {notes, noteBars} = React.useMemo(() => {
        const notes:React.JSX.Element[] = [];
        const noteBars:React.JSX.Element[] = [];
        // add notes
        const NOTE_HORI_SPACING = 64; 
        let curX = xOffset; 
        const noteRx = barSpacing; 
        const noteRy = noteRx * .75; 

        const remNotes = testNotes.slice(curNoteI); 
        console.log(remNotes);
        for(let i = 0; i < remNotes.length; i++){
            const curNote = remNotes[i]; 

            const normNote = InstrumentNote.fromNote(curNote.toString().replace("#", ""))
            const curY = noteBarPosMap[normNote.valueOf()]
            
            const group = []
            let targetColor = 'black'; 

            if(props.testConfig.showNoteColors)
                targetColor = noteColors[curNote.key]; 

            group.push(
                <ellipse cx={curX} cy={curY} rx={noteRx} ry={noteRy} 
                    fill="white" stroke={targetColor} strokeWidth={2}
                    style={{transform: 'rotate(-15deg)', transformOrigin: `${curX}px ${curY}px`}}
                />
            )

            if(curNote.key.indexOf("#") > 0){
                group.push(
                    <text x={curX - (noteRx * 1.5)} y={curY} children="#" fontSize={noteRx * 1.5}  
                        fontWeight={'bold'}
                        fill={targetColor}
                        textAnchor="middle" dominantBaseline={'middle'} 
                    />
                )
            }

            if(props.testConfig.showNoteNames)
                group.push(
                    <text x={curX} y={curY} textAnchor="middle" dominantBaseline={'middle'} 
                        fontSize={noteRy} fontWeight={'bold'} 
                        fill={targetColor}
                        children={normNote.key}
                    />
                )

            // add lines for out of staff notes
            const normNoteVal = normNote.valueOf(); // use note normalized to get around accidentals
            const tStartVal = trebleRange.bars[0].valueOf(); 
            const tEndVal = trebleRange.bars[4].valueOf(); 
            const bStartVal = bassRange.bars[0].valueOf(); 
            const bEndVal = bassRange.bars[4].valueOf(); 

            const isOutsideTrebleRange = props.testConfig.staff == 'Treble'
                && ((normNoteVal > tStartVal && normNoteVal - tStartVal > 2) || (normNoteVal < tEndVal && tEndVal - normNoteVal > 2))
            const isOutsideBassRange = props.testConfig.staff == 'Bass'
                && ((normNoteVal > bStartVal && normNoteVal - bStartVal > 2) || (normNoteVal < bEndVal && bEndVal - normNoteVal > 2))
            const isOutsideGrandRange = props.testConfig.staff == 'Grand' 
                && (
                    (normNoteVal > tStartVal && normNoteVal - tStartVal > 2)
                    || (normNoteVal < tEndVal && tEndVal - normNoteVal > 2 && normNoteVal > bStartVal && normNoteVal - bStartVal > 2)
                    || (normNoteVal < bEndVal && bEndVal - normNoteVal > 2)
                )

            if(isOutsideBassRange || isOutsideTrebleRange || isOutsideGrandRange) {
                let lineY = curY;
                
                // shift line for notes outside of range
                if(normNoteVal > tStartVal && ((normNoteVal - tStartVal) / 2) % 2 != 0){
                    lineY += noteRx; 
                }

                noteBars.push(
                    <line x1={curX - (noteRx * 2)} x2={curX + (noteRx * 2)} y1={lineY} y2={lineY} />
                ); 
            }

            notes.push(<g key={i}>{group}</g>)
            curX += NOTE_HORI_SPACING + noteRx;
        }
        
        return {notes, noteBars}
    }, [curNoteI, containerDim, testNotes, barList])


    return <svg ref={ref} style={props.style}>
        <g stroke="black" strokeWidth={BAR_WIDTH}>
            {bars}
            {noteBars}
        </g>
        {notes}
        {clef}
        {sharpsFlats}
    </svg>
}