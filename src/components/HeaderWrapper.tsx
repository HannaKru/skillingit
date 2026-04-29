'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import PublicHeader from './PublicHeader';
import {User} from "@firebase/auth";

export default function HeaderWrapper() {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(false);
    const [user,setUser]=useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            //setIsLoggedIn(!!user);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (isLoading) {
        return (
            <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                    <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
                    <div className="flex gap-2">
                        <div className="h-10 w-20 bg-gray-200 animate-pulse rounded-full"></div>
                        <div className="h-10 w-20 bg-gray-200 animate-pulse rounded-full"></div>
                    </div>
                </div>
            </header>
        );
    }


    return user ? <>Hello</> : <PublicHeader />;
}