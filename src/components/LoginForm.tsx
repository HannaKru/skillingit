'use client';
import React, {useState, useEffect} from "react";
import { useRouter, useSearchParams } from 'next/navigation'
import {Eye, EyeOff, RefreshCw} from 'lucide-react';
import {FcGoogle} from 'react-icons/fc';
import {signInWithPopup, GoogleAuthProvider, sendEmailVerification, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence} from 'firebase/auth'
import {auth} from '@/lib/firebase'

export default function LoginForm(){
    const router= useRouter();
    const searchParams= useSearchParams();
    const [email, setEmail]=useState<string>("");
    const [password, setPassword]=useState<string>("");
    const [showPassword, setShowPassword]=useState<boolean>(false);
    const [loading, setLoading]=useState<boolean>(false);
    const [error,setError]=useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [autoLoginAttempted, setAutoLoginAttempted] = useState<boolean>(false);

    useEffect( ()=>{ //load saved components + auto login

        const checkAutoLogin=async()=> {
            const currentUser = auth.currentUser;
            if (currentUser && currentUser.emailVerified) { //already logged in - route to dashboard
                const response = await fetch('/api/users/login', {
                    method: 'PATCH',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        firebaseUid: currentUser.uid,
                        email: currentUser.email,
                        isEmailVerified: currentUser.emailVerified,
                        isSSO: false
                    })
                });
                const data = await response.json();
                if (response.ok) {
                    if (!data.user.profile_complete) {
                        router.push('/onboarding');
                    } else {
                        router.push('/dashboard');
                    }
                }
                return;
            }
            //check remember me from local storage
            const rememberedEmail = localStorage.getItem('rememberedEmail') || '';
            const rememberedPassword = localStorage.getItem('rememberedPassword') || '';

            if (rememberedEmail && rememberedPassword && !autoLoginAttempted) {
                setAutoLoginAttempted(true);
                setEmail(rememberedEmail);
                setRememberMe(true);

                //auto login
                try {
                    setLoading(true);
                    await setPersistence(auth, browserLocalPersistence);
                    const userCredential = await signInWithEmailAndPassword(auth, rememberedEmail, rememberedPassword);
                    const user = userCredential.user;
                    if (!user.emailVerified) {
                        await sendEmailVerification(user, {
                            url: `${window.location.origin}/email-verified`,
                            handleCodeInApp: false
                        });
                        router.push('/validate-email')
                    }
                    //login succeeded - update db
                    const response = await fetch('/api/users/login', {
                        method: 'PATCH',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            firebaseUid: user.uid,
                            email: user.email,
                            isEmailVerified: user.emailVerified,
                            isSSO: false
                        })
                    });
                    const data = await response.json();
                    if (response.ok) {
                        if (!data.user.profile_complete) {
                            router.push('/onboarding');
                        } else {
                            router.push('/dashboard');
                        }
                    }
                } catch (error: any) {
                    console.error("Auto login failed, ", error);
                    //clean the saved parameters
                    localStorage.removeItem('rememberedEmail');
                    localStorage.removeItem('rememberedPassword');
                    setRememberMe(false);
                    setError("Auto-login failed, please login manually.");
                } finally {
                    setLoading(false);
                }
            }
            //fill the email after beinn router from validate email
            const savedEmail = sessionStorage.getItem('verifiedEmail'); //email from validate-email
            if (savedEmail) {
                setEmail(savedEmail);
                sessionStorage.removeItem('verifiedEmail');
            }
            const emailFromQuery = searchParams.get('email');

            console.log("email from query: ", emailFromQuery);
            if (emailFromQuery) setEmail(emailFromQuery);
        }
        checkAutoLogin();
    },[router, searchParams,autoLoginAttempted]);

    const syncLoginAndNavigate=async (user:any, isSSO:boolean)=>{
        const response = await fetch('/api/users/login',{
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                firebaseUid:user.uid,
                email: user.email,
                isEmailVerified: user.emailVerified,
                isSSO: isSSO
            })

        })
        const data = await response.json();

        console.log("API response: ", data);

        if(response.ok){
            if(!data.user.profile_complete)
                router.push('/onboarding');
            else
                router.push('/dashboard');
        }
        else{
            throw new Error (data.error || "Failed to sync with database");
        }
    };

    const handleLoginWithGoogle=async ()=>{
        setLoading(true);
        setError("");
        const provider = new GoogleAuthProvider();
        try{
            const result = await signInWithPopup(auth, provider);
            await syncLoginAndNavigate(result.user, true);

        }
        catch(error:any){
            console.error(error);
            setError("Google login failed");
        }
        finally{
            setLoading(false);
        }

    };

    const handleSignInWithEmail=async(e:React.FormEvent)=>{
        e.preventDefault();
        if(!email.trim()){
            setError("Please enter your email");
            return;
        }
        if(!password.trim()){
            setError("Please enter your password");
            return;
        }
        setLoading(true);
        setError("");
        try{

            if(rememberMe){
                await setPersistence(auth, browserLocalPersistence);
                localStorage.setItem('rememberedEmail', email);
                localStorage.setItem('rememberedPasswoed', password);
            } else{
                await setPersistence(auth, browserLocalPersistence);
                localStorage.removeItem('rememberedEmail');
                localStorage.removeItem('rememberedPassword');
            }

            const userCredential=await signInWithEmailAndPassword(auth, email, password);
            const user= userCredential.user;
            if(!user.emailVerified){ //check if the email is validated
                await sendEmailVerification(user,{ //send email again
                    url:`${window.location.origin}/login?verified=true`,
                    handleCodeInApp:false
                });
                router.push('/validate-email');
                return;
            }

            await syncLoginAndNavigate(user, false);

        }
        catch(error: any){
            console.error(error);
            switch(error.code){
                case 'auth/user-not-found':
                    setError("No account found. Please sign up first.");
                    break;
                case 'auth/wrong-password':
                    setError("Incorrect password. Please try again.");
                    break;
                case 'auth/too-many-requests':
                    setError("Too many failed attempts. Please try again later.");
                    break;
                case 'auth/invalid-credentials':
                    setError("Email or password is incorrect.");
                    break;
                case 'auth/invalid-email':
                    setError("Invalid email format.");
                    break;
                default:
                    setError("Login failed. Please try again.");
            }

        }
        finally{
            setLoading(false);
        }
    };



    return(
        <div className="flex flex-col">
            <button
                type="button"
                onClick={handleLoginWithGoogle}
                disabled={loading}
                className="w-full border border-gray-300 rounded-full py-2 px-4 flex items-center justify-center gap-2 hover:bg-gray-50">
                <FcGoogle className="w-5 h-5"/>
                {loading ? "..." : "Login with Google"}
            </button>
            {/*Divider*/}
            <div className="flex items-center gap-4 my-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="text-gray-500 text-sm">or</span>
                <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <form className="space-y-4" onSubmit={handleSignInWithEmail}>
                <div className="space-y-4">
                    <input
                        type="text"
                        value={email}
                        placeholder="Email"
                        onChange={(e)=>setEmail(e.target.value)}
                        disabled={loading}
                        className="w-full border px-5 py-3.5 rounded-full shadow"
                        required
                    />

                    <div className="input-group relative ">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            disabled={loading}
                            className="w-full border py-3.5 px-5 pr-12 rounded-full shadow"
                            required
                        />

                        <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                            onClick={() => setShowPassword(prev => !prev)}
                            disabled={loading}
                        >
                            {!showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                    </div>


                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e)=>setRememberMe(e.target.checked)}
                            />
                            <span className="text-sm text-gray-600 ">Remember me</span>
                        </label>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                            <p className="text-red-600 text-sm text-center font-medium">{error}</p>
                        </div>
                    )}



                    <div className="input-group relative">
                        <button type="submit" className="w-full bg-[#6366f1] hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-full transition-colors"
                                disabled={loading}>
                            {loading ? <RefreshCw className="animate-spin"/> : "Login"}
                        </button>

                    </div>

                </div>

            </form>

        </div>
    );


}