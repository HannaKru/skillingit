'use client';
import React, {useState} from 'react';
import {auth} from '@/lib/firebase';
import {signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {useRouter} from 'next/navigation';
import {Eye, EyeOff} from 'lucide-react';

export default function LoginPage(){
    const [email, setEmail] = useState('');
    const [password, setPassword]=useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword]= useState(false);
    const router = useRouter();

    const handleLogin = async(e: React.FormEvent)=>{
        e.preventDefault();
        setLoading(true);
        setError('');
        try{
            //try to connect to firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            //check if email is validated
            if (!user.emailVerified){
                // if email is not verified disconnect the user and send him to the validate-email page
                await signOut(auth);
                router.push('/validate-email');
                return;
            }

            const dbResponse = await fetch(`/api/users?email=${email}`);
            if(!dbResponse.ok){
                throw new Error('Could not fetch user profile from db');
            }

            const dbUser = await dbResponse.json();
            if (dbUser.profile_is_complete) {
                router.push('/dashboard');
            }
            else {
                router.push('/onboarding');
            }

        } catch(err: any){
            console.error(err);
            setError("Invalid email or password. Please try again");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        placeholder="Email"
                        onChange={(e)=>setEmail(e.target.value)}
                        className="w-full border p-3 rounded-full"
                        required
                    />
                    <input
                        type= {showPassword? "text":"password"}
                        value={password}
                        placeholder="Password"
                        onChange={(e)=>{setPassword(e.target.value)}}
                        required
                    />

                    <button
                        type="button"
                        className="eye-button"
                        onClick={()=>setShowPassword(prev=>!prev)}
                    >
                        {!showPassword? <Eye /> : <EyeOff />}
                    </button>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition"
                    >
                        {loading? "Logging in..." : "Login"}
                    </button>

                </form>


            </div>

        </div>
    );
}