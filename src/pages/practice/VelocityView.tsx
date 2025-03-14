import { Box, Typography } from '@mui/joy'
import React, { useContext } from 'react'
import { InstrumentInputContext } from '../../util/midi/InputManager';
import { InstrumentEvent, InstrumentEventType, InstrumentNoteEvent } from '../../util/midi';
import { Rectangle, VerticalShadesClosedOutlined } from '@mui/icons-material';


const MAX_RANGE = 10; 
const MAX_VELOCITY = 128; 
const VELOCITY_CAPTURE_RATE = 500; 
export const VelocityView = (props:{style?:React.CSSProperties}) => {
    const ref = React.useRef<SVGSVGElement >(null); 
    const [containerDim, setCotnainerDim] = React.useState({width: 0, height: 0})
    const [velocities, setVelocities] = React.useState<{sumVel:number, numInput:number}[]>(
        Array(MAX_RANGE).fill({}).map(i => ({numInput: 0, sumVel: 0}))
    ); 
    const {inputManager} = useContext(InstrumentInputContext); 

    React.useEffect(() => {
        const inputListener = (e:InstrumentEvent) => {
            if(!e.isPressed) return; 
            const ev:InstrumentNoteEvent = (e as InstrumentNoteEvent); 

            setVelocities(v => {
                const tmp = [...v]; 

                if(tmp.length > 0){
                    const last = tmp[tmp.length - 1]; 
                    tmp[tmp.length - 1].numInput += 1; 
                    tmp[tmp.length - 1].sumVel += ev.velocity; 
                }
    
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
            setVelocities(v => {
                let tmp = [...v]; 
                tmp.push({numInput: 0, sumVel: 0});

                if(tmp.length > MAX_RANGE)
                    tmp = tmp.slice(tmp.length - MAX_RANGE); 

                // console.log(tmp.map(t => `${t.numInput}-${t.sumVel}`).join(' '));
                return tmp; 
            }); 
        }

        const interval = setInterval(handleReset, VELOCITY_CAPTURE_RATE); 

        return () => {
            clearInterval(interval); 
        }
    }, [])


    const graph = React.useMemo(() => {
        const {width, height} = containerDim

        const points:{x:number, y:number}[] = velocities.map((v, i) => {
            const avg = v.numInput == 0 ? 0 : v.sumVel / v.numInput; 
            return {x: i * (width / (MAX_RANGE - 1)), y: height * (1 - (avg / MAX_VELOCITY))}; 
        })

        points.push({x: width, y: height}); 
        points.push({x: 0, y: height}); 
        points.push(points[0]); 

        const shape = <polyline points={points.map(p => `${p.x},${p.y}`).join(" ")} fill="lightgray" stroke="black" strokeWidth={2} />

        return shape;
    }, [velocities, containerDim]); 

    const curAvg = React.useMemo(() => {
        const {numInput, sumVel} = velocities[velocities.length - 1]; 

        if(numInput == 0) return 0; 
        return Math.round(sumVel / numInput); 
    }, [velocities]); 

    return <Box>
        <Typography>Avg Velocity: {curAvg}</Typography>
        <svg ref={ref} style={props.style}>
            {graph}
        </svg>
    </Box>
}