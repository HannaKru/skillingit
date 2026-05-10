'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {applyActionCode} from "@firebase/auth";
import {auth} from "@/lib/firebase"
import PublicHeader from '@/components/PublicHeader';

export default function EmailVerifiedPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus]=useState<'loading'|'success'|'error'>('loading');
    const [errorMessage, setErrorMessage]=useState<string>('');



    useEffect(() => {

        const verifyEmail = async()=>{
            const oobCode=searchParams.get('oobCode');
            let email: string | null = '';
            if(typeof window !== 'undefined'){
                email=sessionStorage.getItem('pendingVerificationEmail');
            }
            console.log("oobCode: ", oobCode);
            console.log("email from storage: ", email);

            if(!oobCode){
                setStatus('error');
                setErrorMessage("Invalid verification link");
                return;
            }

            try{
                await applyActionCode(auth, oobCode);

                const currentUser=auth.currentUser;
                if (currentUser){
                    await fetch('/api/users/verify-email', {
                        method: 'PATCH',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            firebaseUid:currentUser.uid,
                            emailVerified: true,
                        }),
                    });
                }
                setStatus('success');

                if(email && typeof window !== 'undefined'){
                    sessionStorage.setItem('verifiedEmail', email);
                    sessionStorage.removeItem('pendingVerificationEmail');
                } else if (currentUser?.email && typeof window !== 'undefined'){
                    sessionStorage.setItem('verifiedEmail', currentUser.email);
                }

                setTimeout(()=>{
                    router.push(`/login`)
                },1500);
            }
            catch(err: any){
                console.error("Verification error: ", err);
                setStatus('error');
                setErrorMessage(err.message || 'verification failied')
            }
        };

        verifyEmail();
    }, [router, searchParams]);


    return (
        <div className="min-h-screen bg-white flex flex-col">
            <PublicHeader />
            <main className="flex-1 flex items-center justify-center">
                {status==='loading' &&(
                    <div className="text-center">
                        <p className="text-gray-700">Verifying your email...</p>
                    </div>
                )}
                {status==='success' && (
                    <div className="flex flex-col items-center text-center">
                        <div className="w-28 h-28 rounded-full bg-green-300 flex items-center justify-center">
                            <img src="/images/v.svg" alt="verified" className="w-12 h-12" />
                        </div>
                        <p className="mt-6 text-gray-800 font-medium">Email verified</p>
                        <p className="mt-2 text-gray-500 text-sm">Redirecting to login...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="text-center">
                        <p className="text-red-600 font-medium">Verification failed</p>
                        <p className="text-gray-600 mb-6">{errorMessage || 'The link may be invalid'}</p>
                        <button
                            onClick={()=>router.push('/registration')}
                            className="text-indigo-600 underline font-medium hover:text-indigo-800"
                        >
                            Back to registration
                        </button>

                    </div>
                )}

            </main>
        </div>
    );
}