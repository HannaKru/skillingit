'use client';
import {useEffect, useState, useRef} from 'react';
import {useRouter} from 'next/navigation';
import {auth} from '@/lib/firebase';
import {onAuthStateChanged, sendEmailVerification} from 'firebase/auth';
import {Mail, RefreshCw} from 'lucide-react';
import PublicHeader from "@/components/PublicHeader";


export default function ValidateEmail() {
    const router = useRouter();
    const [countdown, setCountdown] = useState<number>(0);
    const [email, setEmail] = useState<string>('');
    const [isResending, setIsResending] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const intervalRef = useRef<NodeJS.Timeout | null>(null);


    //function to clean the page
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);//clear the timer if the user leaves the page
            }
        };
    }, []);

    //check user + is the email already validated
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.push('/registration');
                return;
            }
            setEmail(user.email || '');
            //if email is already verified - jump to onboarding
            if (user.emailVerified) {
                router.push('/onboarding');
                return;
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [router])

    //check every 3 seconds if the email was verified
    useEffect(() => {
        const interval = setInterval(async () => {
            const user = auth.currentUser;
            if(!user) return;
            await user.reload();
            const refreshedUser=auth.currentUser;
            if(refreshedUser?.emailVerified){
                await fetch('api/users/verify-email',{
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        firebaseUid: user.uid,
                        emailVerified: true,
                    }),
                });
                clearInterval(interval);
                router.push('/onboarding')
            }

        }, 3000);
        return () => clearInterval(interval);
    }, [router]);

    const handleResendEmail = async () => {
        if (countdown > 0 || isResending) return;
        const user = auth.currentUser;
        if (!user) {
            setMessage('User not found. Please register again');
            return;
        }
        setIsResending(true);
        setMessage('');

        try {
            await sendEmailVerification(user, {
                url: `${window.location.origin}/login?verified=true`,
                handleCodeInApp: true,
            });
            setMessage('Verification email sent! Please check your inbox.');
            setCountdown(30);

            //save the interval inside of ref
            intervalRef.current = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        if (intervalRef.current) clearInterval(intervalRef.current);
                        return 0;
                    }
                    return prev - 1;
                })
            }, 1000);


        } catch (error) {
            console.error(error);
            setMessage('Failed to send email. Please try again later.');
        } finally {
            setIsResending(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex itens-center justify-center bg-gray-50">
                <div className="text-center">
                    <div
                        className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }
    return(
        <div className="min-h-screen bg-white flex flex-col">
            <PublicHeader/>
            <main className="flex-1 flex items-center justify-center relative px-6 overflow-hidden">
                <div className="hidden lg:block absolute left-10 bottom-20 animate-bounce-slow">
                    <img src="/images/girl.svg" alt="girl" className="w-64" />
                </div>
                <div className="hidden lg:block absolute right-10 top-1/4 -translate-y-1/2">
                    <img src="/images/boy.svg" alt="boy" className="w-72" />
                </div>
                <div className="absolute top-18 left-1/2 -translate-x-1/2 z-10 w-full max-w-md flex flex-col items-center text-center">
                    <img src="/images/mail-symbol.svg" alt="mail-symbol" className="w-20 h-20" />
                    <h1 className="text-3xl font-semibold text-gray-900 mb-4 ">
                        Please verify your email
                    </h1>
                    <p className="text-gray-600">
                        We have sent a verification link to <strong>{email}</strong>.
                        <br/>
                        Click  the link in the email to complete the verification process.
                        <br/>
                        <br/>
                        Didn't get the email?
                        <br/>
                        Check your spam box or click here to {' '}
                        <button
                            type="button"
                            onClick={handleResendEmail}
                            disabled={countdown>0 || isResending}
                            className="text-indigo-600 underline font-medium hover:text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Resend email
                        </button>
                    </p>
                </div>


            </main>
        </div>
    );


}

