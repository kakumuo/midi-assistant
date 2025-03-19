import { Box, Typography } from '@mui/joy'
import React, { useContext } from 'react'
import { InstrumentInputContext } from '../../util/midi/InputManager';
import { InstrumentEvent, InstrumentEventType, InstrumentNoteEvent } from '../../util/midi';


const MAX_RANGE = 20; 
const CAPTURE_RATE = 500; 
const BUFFER_SIZE = 5; 
export const TempoView = (props:{style?:React.CSSProperties, outerStyle?:React.CSSProperties}) => {
    const ref = React.useRef<SVGSVGElement >(null); 
    const [containerDim, setContainerDim] = React.useState({width: 0, height: 0})
    const [timingBuffer, setTimingBuffer] = React.useState(Array(BUFFER_SIZE).fill(0))
    const [movingAvgs, setMovingAvgs] = React.useState<number[]>(Array(MAX_RANGE).fill(0)); 
    const {inputManager} = useContext(InstrumentInputContext); 

    React.useEffect(() => {
        const inputListener = (e:InstrumentEvent) => {
            if(!e.isPressed) return; 
            const ev:InstrumentNoteEvent = (e as InstrumentNoteEvent); 

            setTimingBuffer(b => {
                const tmp = [...b, Date.now()]
                return tmp.slice(1); 
            })
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
            setContainerDim(ref.current.getBoundingClientRect())
        }

        const observer = new ResizeObserver(handleResize); 
        observer.observe(ref.current); 

        return () => {
            observer.disconnect(); 
        }
    }, [ref]); 

    React.useEffect(() => {
        const handleReset = () => {
            setTimingBuffer(tBuff => {
                let sum = 0; 
                let k = 0; 
                for(let i = 1, j = 0; i < timingBuffer.length; i++, j++){
                    if(tBuff[i] <= 0 || tBuff[j] <= 0) continue; 

                    k++; 
                    sum += tBuff[i] - tBuff[j]; 
                }

                let curAvg = 0; 

                if(k > 0 && (sum / k) > 0)
                    curAvg =  Math.floor(1 * (60 * 1000) / (sum / k))
                setMovingAvgs(avgs => [...avgs,  curAvg].slice(1))

                return tBuff
            })
        }

        const interval = setInterval(handleReset, CAPTURE_RATE); 

        return () => clearInterval(interval); 
    }, [])

    React.useEffect(() => {
        console.log(movingAvgs)
    }, [movingAvgs])

    const graph = React.useMemo(() => {
        const {width, height} = containerDim

        const MAX_BPM = movingAvgs.reduce((acc, cur) => {
            if(acc < cur) return cur; 
            return acc; 
        }, 10) * 60 * (CAPTURE_RATE / 1000);

        const points:{x:number, y:number}[] = movingAvgs.map((n, i) => {
            const avg = n == 0 ? 0 : n * 60 * (CAPTURE_RATE / 1000);; 
            return {x: i * (width / (MAX_RANGE - 1)), y: height * (1 - (avg / MAX_BPM))}; 
        }); 

        points.push({x: width, y: height}); 
        points.push({x: 0, y: height}); 
        points.push(points[0]); 

        const shape = <polyline points={points.map(p => `${p.x},${p.y}`).join(" ")} fill="lightgray" stroke="black" strokeWidth={2} />

        return shape;
    }, [movingAvgs, containerDim]); 

    return <Box sx={props.outerStyle}>
        <Typography>Avg Tempo: {movingAvgs[movingAvgs.length - 1]}</Typography>
        <svg ref={ref} style={props.style}>
            {graph}
        </svg>
    </Box>
}