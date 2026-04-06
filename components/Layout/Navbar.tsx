import { hasEnvVars } from '@/lib/utils'
import Link from 'next/link'
import React, { Suspense } from 'react'
import { EnvVarWarning } from '../env-var-warning'
import { AuthButton } from '../auth-button'

const Navbar = () => {
    return (
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                <div className="flex gap-5 items-center font-semibold">
                    <h1 className="text-2xl font-bold">
                        <Link href={"/"}>Volto</Link>
                    </h1>
                </div>
                {!hasEnvVars ? (
                    <EnvVarWarning />
                ) : (
                    <Suspense>
                        <AuthButton />
                    </Suspense>
                )}
            </div>
        </nav>
    )
}

export default Navbar