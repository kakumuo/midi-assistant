import React from "react";
import { useActiveNotes } from "../../util/midi/InputManager";
import { InstrumentKey, InstrumentNote } from "../../util/midi";


export const ScaleView = (props:{style?:React.CSSProperties, clefType?:'bass'|'treble'|'grand'}) => {
    const ref = React.useRef<SVGSVGElement>(null); 
    const [containerDim, setCotnainerDim] = React.useState({width: 0, height: 0});
    const activeNotes = useActiveNotes(); 

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


    const {bars, notes, clef} = React.useMemo(() => {
        const bars:React.JSX.Element[] = []; 
        const notes:React.JSX.Element[] = []; 
        const {width, height} = containerDim; 
        const clefWidth = width  * .2; 

        const TOTAL_BARS = 9;
        const VISIBLE_BARS = 5;  

        for(let i = 0; i < TOTAL_BARS; i++){
            if(i >= (TOTAL_BARS - VISIBLE_BARS) / 2 && i < TOTAL_BARS - ((TOTAL_BARS - VISIBLE_BARS) / 2)){
                const targetHeight = (height * (i / TOTAL_BARS)) + (height / (2 * TOTAL_BARS)); 
                bars.push(<line x1={0} x2={width} y1={targetHeight} y2={targetHeight} stroke="black" strokeWidth={2}/>)
            }
        }

        const clef = <image href="treble.webp" x={0} y={0} width={clefWidth} height={height} />
        
        

        return {bars, notes, clef}
    }, [containerDim]); 

    
    return <svg ref={ref} style={props.style}>
        {bars}
        {clef}
    </svg>
}