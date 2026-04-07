import Link from 'next/link'
import React from 'react'
import ArrowBackUpIcon from '../ui/arrow-back-up-icon'

function BackComponent({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex items-center  gap-2 cursor-pointer'>
            <Link href="/" className='flex justify-center'>
                <ArrowBackUpIcon className='' />
            </Link>
            {children}
        </div>
    )
}

export default BackComponent