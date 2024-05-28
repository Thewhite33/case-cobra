'use client'
import React, { useEffect, useRef, useState } from 'react'
import MaxWidthWrapper from './MaxWidthWrapper'
import { useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import Phone from './Phone'

const PHONES = [
    '/testimonials/1.jpg',
    '/testimonials/2.jpg',
    '/testimonials/3.jpg',
    '/testimonials/4.jpg',
    '/testimonials/5.jpg',
    '/testimonials/6.jpg',
]

function splitArray(array, numParts) {
    const result = Array.from({ length: numParts }, () => [])
    for (let i = 0; i < array.length; i++) {
        result[i % numParts].push(array[i])
    }
    return result
}

function ReviewColumn({ reviews, className, reviewClassName, msPerPixel = 0 }) {
    const columnRef = useRef(null)
    const [columnHeight, setColumnHeight] = useState(0)
    const duration = `${columnHeight * msPerPixel}ms`

    useEffect(() => {
        if (!columnRef.current) return

        const resizeObserver = new window.ResizeObserver(() => {
            setColumnHeight(columnRef.current?.offsetHeight ?? 0)
        })
        resizeObserver.observe(columnRef.current)

        return () => {
            resizeObserver.disconnect()
        }
    }, [])
    return (
        <div ref={columnRef} className={cn("animate-marquee space-y-8 py-4", className)} style={{ '--marquee-duration': duration }}>
            {reviews.concat(reviews).map((imgSrc, reviewIndex) => (
                <Review key={reviewIndex} className={reviewClassName?.(reviewIndex % reviews.length)} imgSrc={imgSrc} />
            ))}
        </div>
    )
}

function Review({ imgSrc, className, ...props }) {
    const possible_animations_delays = ['0s',
        '0.1s',
        '0.2s',
        '0.3s',
        '0.4s',
        '0.5s',]

    const animationDelay =
        possible_animations_delays[
        Math.floor(Math.random() * possible_animations_delays.length)
        ]

    return <div style={{ animationDelay }} className={cn('animate-fade-in rounded-[2.25rem] bg-white p-6 opacity-0 shadow-xl shadow-slate-900/5', className)} {...props}>
        <Phone imgSrc={imgSrc} />
    </div>
}

function ReviewGrid() {
    const containerRef = useRef()
    const isinView = useInView(containerRef, { once: true, amount: 0.4 })
    const columns = splitArray(PHONES, 3)
    const col1 = columns[0]
    const col2 = columns[1]
    const col3 = splitArray(columns[2], 2)
    return (
        <div ref={containerRef} className='relative -mx-4 mt-16 grid h-[49rem] max-h-[150vh] grid-cols-1 items-start gap-8 overflow-hidden px-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3'>
            {isinView ? <>
                <ReviewColumn reviews={[...col1, ...col3.flat(), ...col2]} reviewClassName={(reviewIndex) =>
                    cn({
                        'md:hidden': reviewIndex >= col1.length + col3[0].length,
                        'lg:hidden': reviewIndex >= col1.length,
                    })}
                    msPerPixel={10} />
                <ReviewColumn reviews={[...col2, ...col3[1]]}
                    reviewClassName={(reviewIndex) => reviewIndex >= col2.length ? 'lg:hidden' : ""}
                    msPerPixel={15} className='hidden md:block' />
                <ReviewColumn reviews={col3.flat()}
                    msPerPixel={10} className='hidden md:block' />
            </> : null}
            <div className='pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-100'></div>
            <div className='pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-100'></div>
        </div>
    )
}

const Reviews = () => {
    return (
        <MaxWidthWrapper className='relative max-w-5xl'>
            <img aria-hidden="true" src="/what-people-are-buying.png" className='absolute select-none hidden xl:block -left-32 top-1/3' />
            <ReviewGrid />
        </MaxWidthWrapper>
    )
}

export default Reviews