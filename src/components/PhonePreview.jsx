'use client'
import React, { useEffect, useRef, useState } from 'react'
import { AspectRatio } from './ui/aspect-ratio'
import { cn } from '@/lib/utils'

const PhonePreview = ({croppedImageUrl,color}) => {
    const ref = useRef(null)
    const [renderedDim,setRenderedDim] = useState({
        height:0,
        width:0,
    })
    const handleRezise = () => {
        if(!ref.current) return 
        const {width,height} = ref.current.getBoundingClientRect()
        setRenderedDim({width,height})
    }
    useEffect(()=>{
        handleRezise()
        window.addEventListener('resize',handleRezise)
        return () => {
            window.removeEventListener('resize',handleRezise)
        }
    },[ref.current])
    let caseBackgroundColor = 'bg-zinc-950'
    if(color === 'blue') caseBackgroundColor = 'bg-blue-950'
    if(color === 'rose') caseBackgroundColor = 'bg-rose-950'
    return (
        <AspectRatio ref={ref} ratio={3000/2001} className='relative'>
            <div className='absolute z-20 scale-[1.0352]' style={{
                left:renderedDim.width/2 - renderedDim.width/(1216/121),
                top:renderedDim.height/6.22,
            }}>
                <img src={croppedImageUrl} width={renderedDim.width/(3000/637)} className={cn('phone-skew relative z-20 rounded-t-[15px] rounded-b-[10px] md:rounded-t-[30px] md:rounded-b-[20px]',caseBackgroundColor)} />
            </div>
            <div className='relative h-full w-full z-40'>
                <img src="/clearphone.png" alt="phone" className='pointer-events-none h-full w-full antialiased rounded-md' />
            </div>
        </AspectRatio>
    )
}

export default PhonePreview