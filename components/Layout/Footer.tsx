import React from 'react'
import { ThemeSwitcher } from '../theme-switcher'

const Footer = () => {
    return (
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
            <p>
                Created By
                <a
                    href="https://ziad-alaa.vercel.app/"
                    target="_blank"
                    className="font-bold ml-2 hover:underline"
                    rel="noreferrer"
                >
                    Ziad Alaa
                </a>
            </p>
            <ThemeSwitcher />
        </footer>
    )
}

export default Footer