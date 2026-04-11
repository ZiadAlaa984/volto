"use client";

import React from 'react'
import { useRouter } from 'next/navigation'
import ArrowBackUpIcon from '../ui/arrow-back-up-icon'

function BackComponent({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    return (
        <div className='flex items-center gap-2 cursor-pointer' onClick={() => router.back()}>
            <ArrowBackUpIcon />
            {children}
        </div>
    )
}

export default BackComponent