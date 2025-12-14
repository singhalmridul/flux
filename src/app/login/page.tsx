
"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import Link from "next/link"

// Simple Apple Icon Component since lucide doesn't have a filled one
const AppleIcon = (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
        {/* Just using generic social icon for now as placeholder for apple structure */}
        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-.38-.18-1.07-.48-1.99-.48-.84 0-1.6.3-1.95.46-1.15.53-2.16.51-3.08-.25-1.99-1.63-2.9-4.57-1.18-7.56C6.73 11.2 8.45 10.4 9.68 10.4c.85 0 1.57.49 2.11.49.53 0 1.42-.51 2.37-.51 1.01 0 2.26.43 3 1.51-.06.03-1.8 1.03-1.8 3.12 0 2.5 2.17 3.33 2.27 3.37-.02.09-.34 1.18-1.14 2.36-.67.99-1.37 1.97-2.44 1.97zM11.96 10.3c-.05-.82.35-1.6.87-2.12.55-.56 1.34-.89 2.15-.89.07.87-.33 1.64-.84 2.17-.58.6-1.37.96-2.18.84z" />
    </svg>
)

const GoogleIcon = (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.667s3.773-8.667 8.6-8.667c2.613 0 4.52 1.027 5.96 2.387l2.32-2.32c-1.7-1.573-4.32-3.333-8.28-3.333-6.64 0-12 5.36-12 12s5.36 12 12 12c3.453 0 6.373-1.147 8.353-3.227 2.153-2.153 2.767-5.58 2.56-7.307H12.48z" />
    </svg>
)

export default function LoginPage() {
    const [loading, setLoading] = useState<string | null>(null)

    const handleLogin = async (provider: string) => {
        setLoading(provider)
        await signIn(provider, { callbackUrl: "/ideation" })
    }

    return (
        <div className="h-screen w-full flex items-center justify-center bg-[#F5F5F7] dark:bg-black p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[400px] bg-white dark:bg-[#1C1C1E] rounded-3xl p-8 shadow-2xl shadow-black/5 flex flex-col items-center text-center"
            >
                <div className="w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>

                <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white mb-2">Welcome to Flux</h1>
                <p className="text-[#86868B] text-base mb-8">Sign in to sync your workspace.</p>

                <div className="flex flex-col gap-3 w-full">
                    <button
                        onClick={() => handleLogin('apple')}
                        disabled={!!loading}
                        className="w-full h-12 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 rounded-full font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading === 'apple' ? <Loader2 className="w-5 h-5 animate-spin" /> : <AppleIcon className="w-5 h-5 mb-0.5" />}
                        <span>Continue with Apple</span>
                    </button>

                    <button
                        onClick={() => handleLogin('google')}
                        disabled={!!loading}
                        className="w-full h-12 bg-white text-[#1D1D1F] border border-[#D2D2D7] hover:bg-[#F5F5F7] dark:bg-[#2C2C2E] dark:text-white dark:border-transparent dark:hover:bg-[#3A3A3C] rounded-full font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading === 'google' ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon className="w-5 h-5" />}
                        <span>Continue with Google</span>
                    </button>

                    {process.env.NODE_ENV === 'development' && (
                        <button
                            onClick={() => handleLogin('credentials')}
                            disabled={!!loading}
                            className="w-full h-12 mt-2 bg-transparent text-muted-foreground hover:text-foreground text-sm font-medium flex items-center justify-center gap-2 transition-all"
                        >
                            {loading === 'credentials' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            <span>Developer Login</span>
                        </button>
                    )}
                </div>

                <div className="mt-8 text-xs text-[#86868B]">
                    By continuing, you verify that you are authorized to access this workspace.
                </div>
            </motion.div>
        </div>
    )
}
