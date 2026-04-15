'use client';
import {useEffect, useState, useRef} from 'react';
import {useRouter} from 'next/navigation';
import {auth} from '@/lib/firebase';
import {onAuthStateChanged, sendEmailVerification} from 'firebase/auth';

export default function ValidateEmailPage(){
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);
    const [email, setEmail] = useState('');
    const [resendDisabled, setResendDisabled]= useState(false);
    const [message, setMessage] = useState('');
    const intervalRef = useRef<NodeJS.Timeout | null>(null);


    //function to clean the page
    useEffect(()=>{
        return ()=>{
            if (intervalRef.current){
                clearInterval(intervalRef.current);//clear the timer if the user leaves the page
            }
        };
    },[]);

    const handleResendEmail = async()=>{
        if (resendDisabled) return;
        const user = auth.currentUser;
        if (!user){
            setMessage('User not found. Please register again');
            return;
        }
        setResendDisabled(true);
        setCountdown(30);//30 seconds till next resend
        setMessage('');

        //save the interval inside of ref
        intervalRef.current = setInterval(()=>{
            setCountdown((prev)=>{
                if(prev <= 1){
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    setResendDisabled(false);
                    return 0;
                }
                return prev-1;
            })
        },1000);

        try{
            await sendEmailVerification(user, {
                url: `${window.location.origin}/login?verified=true`,
                handleCodeInApp: true,
            });
            setMessage('Verification email sent! Please check your inbox.');
            const timer = setInterval(()=>{
                setCountdown((prev)=>{
                    if (prev <= 1){
                        clearInterval(timer);
                        setResendDisabled(false);
                        return 0;
                    }
                    return prev-1;
                });
            }, 1000);

        } catch(error){
            console.error(error);
            setMessage('Failed to send email. Please try again later.');
            setResendDisabled(false);
            setCountdown(0);

        }
    };

}

