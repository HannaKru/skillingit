'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function PublicHeader() {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <div className="relative">
                    <Link
                        href="/"
                        className="flex items-center gap-2"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                    >

                        <div className="relative w-8 h-8 flex items-center justify-center">

                            <img
                                src="/images/Vector84.svg"
                                alt=""
                                className="absolute -top-1 right-0 w-4 h-5"
                            />
                            <img
                                src="/images/Vector85.svg"
                                alt=""
                                className="absolute -bottom-1 left-0 w-4 h-5"
                            />
                        </div>

                        <img
                            src="/images/Skillinit.svg"
                            alt="Skillinit"
                            className="h-8 w-auto"
                        />
                    </Link>

                    {showTooltip && (
                        <div className="absolute left-0 top-full mt-3 w-80 rounded-2xl bg-beige p-5 text-sm shadow-xl pointer-events-none z-50">
                            <p className="leading-relaxed">
                                SkillinIt is a project to let you exchange skills.
                                Teach something - learn something.
                                Let's be more creative together!
                            </p>
                            <div className="absolute -top-2 left-8 h-4 w-4 rotate-45 bg-beige"></div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/login"
                        className="rounded-full px-6 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100"
                    >
                        Log in
                    </Link>

                    <Link
                        href="/registration"
                        className="rounded-full bg-[#6366f1] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-indigo-700"
                    >
                        Sign up
                    </Link>
                </div>
            </div>
        </header>
    );
}