'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import PublicHeader from './PublicHeader';

export default function HeaderWrapper() {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsLoggedIn(!!user);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (isLoading) {
        return <PublicHeader/>;
    }

    return isLoggedIn? <PublicHeader/> :<div>{/* private header later */}</div>;
}