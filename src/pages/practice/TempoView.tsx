import { Box, Typography } from '@mui/joy'
import React, { useContext } from 'react'
import { InstrumentInputContext } from '../../util/midi/InputManager';
import { InstrumentEvent, InstrumentEventType, InstrumentNoteEvent } from '../../util/midi';
import { Rectangle, VerticalShadesClosedOutlined } from '@mui/icons-material';


const MAX_RANGE = 20; 
const MAX_VELOCITY = 128; 
const CAPTURE_RATE = 500; 
export const TempoView = (props:{style?:React.CSSProperties, outerStyle?:React.CSSProperties}) => {
    const ref = React.useRef<SVGSVGElement >(null); 
    const [containerDim, setCotnainerDim] = React.useState({width: 0, height: 0})
    const [numInputs, setNumInputs] = React.useState<number[]>(Array(MAX_RANGE).fill(0)); 
    const {inputManager} = useContext(InstrumentInputContext); 

    React.useEffect(() => {
        const inputListener = (e:InstrumentEvent) => {
            if(!e.isPressed) return; 
            const ev:InstrumentNoteEvent = (e as InstrumentNoteEvent); 

            setNumInputs(v => {
                const tmp = [...v]; 
                tmp[tmp.length - 1] += 1;     
                return tmp; 
            }); 
        }

        inputManager.addListener(InstrumentEventType.NOTE, inputListener); 

        return () => {
            inputManager.removeListener(InstrumentEventType.NOTE, inputListener); 
        }
    }, []); 

    React.useEffect(() => {
        if(!ref || !ref.current) return; 

        const handleResize = () => {
            if(!ref || !ref.current) return; 
            setCotnainerDim(ref.current.getBoundingClientRect())
        }

        const observer = new ResizeObserver(handleResize); 
        observer.observe(ref.current); 

        return () => {
            observer.disconnect(); 
        }
    }, [ref])

    React.useEffect(() => {
        const handleReset = () => {
            setNumInputs(v => {
                let tmp = [...v]; 
                tmp.push(0);

                if(tmp.length > MAX_RANGE)
                    tmp = tmp.slice(tmp.length - MAX_RANGE); 

                return tmp; 
            }); 
        }

        const interval = setInterval(handleReset, CAPTURE_RATE); 

        return () => {
            clearInterval(interval); 
        }
    }, [])


    const graph = React.useMemo(() => {
        const {width, height} = containerDim

        const MAX_BPM = numInputs.reduce((acc, cur) => {
            if(acc < cur) return cur; 
            return acc; 
        }, 10) * 60 * (CAPTURE_RATE / 1000);

        const points:{x:number, y:number}[] = numInputs.map((n, i) => {
            const avg = n == 0 ? 0 : n * 60 * (CAPTURE_RATE / 1000);; 
            return {x: i * (width / (MAX_RANGE - 1)), y: height * (1 - (avg / MAX_BPM))}; 
        }); 

        points.push({x: width, y: height}); 
        points.push({x: 0, y: height}); 
        points.push(points[0]); 

        const shape = <polyline points={points.map(p => `${p.x},${p.y}`).join(" ")} fill="lightgray" stroke="black" strokeWidth={2} />

        return shape;
    }, [numInputs, containerDim]); 

    const curAvg = React.useMemo(() => {
        return Math.round(3600 * numInputs[numInputs.length - 1] / CAPTURE_RATE)
    }, [numInputs]); 

    return <Box sx={props.outerStyle}>
        <Typography>Avg Tempo: {curAvg}</Typography>
        <svg ref={ref} style={props.style}>
            {graph}
        </svg>
    </Box>
}