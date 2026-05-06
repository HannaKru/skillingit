'use client';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import PublicHeader from "@/components/PublicHeader";
export default function EmailVerifiedPage(){
    const router=useRouter();
    useEffect(()=>{
        if(window.opener){
            window.close();
        } else{
            const timer=setTimeout(()=>{
                router.push('/onboarding');
            },2000);
            return clearTimeout(timer);
        }
    },[router]);

    return(
        <div className="min-h-screen bg-white flex flex-col">
            <PublicHeader />
            <main className="flex-1 flex items-center justify-center">

            </main>


        </div>
    );

}