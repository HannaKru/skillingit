'use client';
import {useState} from "react";
import {useRouter} from "next/navigation";
import {auth} from "@/lib/firebase"

export default function OnboardingPage(){
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        full_name: '',
        location: '',
        birth_date:'',
        profile_image: '',
        languages_spoken: [] as string[],
        can_teach:[] as string[],
        want_to_learn: [] as string[]
    });

    const nextStep= ()=> setStep(prev=>prev+1);
    const prevStep=()=>setStep(prev=>prev-1);

    const handleFinish =async ()=>{
        setLoading(true);
        try{
            const user=auth.currentUser;
            const response = await fetch('/api/users/onboarding', {
                method: "PATCH",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email: user?.email,
                    ...formData,
                    is_profile_completed:true,
                    coins:3
                })
            });
            if (response.ok){
                router.push('/dashboard');
            }
        } catch (error){
            console.error("Failed to update profile: " ,error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
            <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-10 relative overflow-hidden">
                {/*progress bar*/}
                <div className="absolute top-0 left-0 h-2 bg-indigo-500 transition-all duration-500"
                style={{width: `${(step / 4) * 100}%`}}
                >


                </div>

            </div>

        </div>
    );


}