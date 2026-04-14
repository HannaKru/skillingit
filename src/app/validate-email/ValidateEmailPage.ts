'use client';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {auth} from '@/lib/firebase';
import {onAuthStateChanged, sendEmailVerification} from 'firebase/auth';

export default function ValidateEmailPage(){
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);
    const [email, setEmail] = useState('');
    const [resendDisabled, setResendDisabled]= useState(false);
    const [message, setMessage] = useState('');

    useEffect(()=>{
        // getting the email of the user who signed up
        const user = auth.currentUser;
        if(user?.email){
            setEmail(user.email);
        }
        else{
            router.push('/RegistrationPage')
        }

    }, [router]);

    const handleResendEmail = async()=>{
        if (resendDisabled) return;
        const user = auth.currentUser;
        if (!user){
            setMessage('User not found. Please register again');
            return;
        }
        setResendDisabled(true);
        setCountdown(60);//60 seconds till next resend
        setMessage('');
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

