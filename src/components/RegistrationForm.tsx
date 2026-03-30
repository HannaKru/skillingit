'use client';
import React, {ReactElement, useState} from "react";
import {Eye, EyeOff} from 'lucide-react';
import {FcGoogle} from 'react-icons/fc'
import {createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendEmailVerification} from 'firebase/auth'
import {auth} from '@/lib/firebase'
import { useRouter } from 'next/navigation'

type FormData = {
    email: string;
    password: string;
    password_confirmation: string;
    termsAndConditions: boolean;
}


type FormErrors={
    email?: string;
    password?: string;
    password_confirmation?:string;
    termsAndConditions?:string;
};

const EMAIL_REGEX= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STRONG_PASSWORD_REGEX= /^(?=.*[A-Z])(?=.*\d)(?=.*[a-z]).+$/;
const MIN_PASSWORD_LENGTH = 6;

type FirebaseErrorCode= 'auth/email-already-in-use' | 'auth/weak-password' | 'auth/invalid-email' | 'auth/operation-not-allowed' | 'auth/user-disabled';
const FIREBASE_ERROR_MESSAGES: Record<FirebaseErrorCode, string> = {
    'auth/email-already-in-use': 'Email already exists. Please use a different email or login.',
    'auth/weak-password': 'Password is too weak. Please use a stronger password.',
    'auth/invalid-email': 'Invalid email address format.',
    'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact support.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.'

}




export default function RegistrationForm(): React.ReactElement {
    const router= useRouter();
    const [loading, setLoading] = useState<boolean> (false);
    const [form, setForm]=useState<FormData>({
        email:"",
        password:"",
        password_confirmation:"",
        termsAndConditions:false
    });
    const [showPassword, setShowPassword]=useState<boolean>(false);
    const [errors, setErrors]=useState<FormErrors>({});
    const [firebaseError, setFirebaseError]=useState<string>("");
    const [submitted, setSubmitted]=useState(false);

    const clearFieldError= (fieldName: keyof FormErrors):void=>{
        setErrors((prev) => ({
            ...prev,
            [fieldName]: ""
        }));
    };



    const handleOnChange=(event:React.ChangeEvent<HTMLInputElement>): void=>{
        const {name, value, type, checked }=event.target;
        setForm((prev)=>({
            ...prev,
            [name]:type === 'checkbox' ? checked : value
        }));

        if (name in errors){
            clearFieldError(name as keyof FormErrors);
        }
    }

    const checkValidEmail=(email:string)=>{
        return EMAIL_REGEX.test(email);
    };


    const validate=(): FormErrors => {
        const newErrors: FormErrors={};
        if(form.email.trim()==""){
            newErrors.email="Please enter an email address";
        }
        else if (!checkValidEmail(form.email)){
            newErrors.email="Email must be valid";
        }

        if(form.password.trim()===""){
            newErrors.password="Please enter a password"
        }
        else if(form.password.length<MIN_PASSWORD_LENGTH){
            newErrors.password="Password must be at least 6 characters";
        }
        else if(!STRONG_PASSWORD_REGEX.test(form.password)){
            newErrors.password="Password must contain an Uppercase letter, lowercase letter, and a number";
        }
        if(form.password !==  form.password_confirmation){
            newErrors.password_confirmation="Passwords do not match";
        }

        if(!form.termsAndConditions)
            newErrors.termsAndConditions ="Please confirm terms and conditions"

        return newErrors;

    };

    const handleFormSubmit= async (event: React.FormEvent<HTMLFormElement>):Promise<void> =>{
        event.preventDefault();
        const validationErrors=validate();
        if(Object.keys(validationErrors).length>0){
            setErrors(validationErrors);
            return;
        }
        setLoading (true);
        setFirebaseError("");
        try{
            const userCredential= await createUserWithEmailAndPassword(
                auth,
                form.email,
                form.password
            );

            const user = userCredential.user;

            await sendEmailVerification (user, {
                url: `${window.location.origin}/login?verified=true`,
                handleCodeInApp: true
            });

            console.log("Verification email sent to:", user.email);

            setForm({
                email: '',
                password: '',
                password_confirmation: '',
                termsAndConditions: false
            })

            //success - forward to next page
            router.push('/validate-email');
        }
        catch (error: any){
            console.error(error);
            const code = error.code as FirebaseErrorCode

            const fallback = "There was an error during registration, please try again.";
            setFirebaseError(FIREBASE_ERROR_MESSAGES[code] ?? fallback)


        }
        finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp= async() : Promise<void> => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            router.push('/ValidateEmail');
        }
        catch (error) {
            console.error(error);
            setFirebaseError("Signup with Google failed.");

        }
        finally {
            setLoading (false);
        }
    };

    return (
        <div className="flex flex-col">
            <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="w-full border border-gray-300 rounded-full py-2 px-4 flex items-center justify-center gap-2 hover:bg-gray-50">
                <FcGoogle className="w-5 h-5"/>
                {loading ? "..." : "Sign up with Google"}
            </button>
            {/*Divider*/}
            <div className="flex items-center gap-4 my-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="text-gray-500 text-sm">or</span>
                <div className="flex-1 border-t border-gray-300"></div>
            </div>
            <form className="space-y-4" onSubmit={handleFormSubmit}>
                <div className="input-group flex flex-col">
                    <div className="input-group relative ">

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleOnChange}
                            disabled={loading}
                            className="w-full border px-5 py-3.5 rounded-full shadow"
                            required />

                        {errors.email && (<p className="text-small text-red-700 mt-2">{errors.email}</p>)}
                    </div>

                    <div className="input-group relative ">

                        <input
                            type= {showPassword? "text":"password"}
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleOnChange}
                            disabled={loading}
                            className="w-full border py-3.5 px-5 rounded-full shadow "
                            required />

                        <button
                            type="button"
                            className="eye-button"
                            onClick={()=>setShowPassword(prev=>!prev)}
                        >{!showPassword? <Eye /> : <EyeOff />}</button>
                        {errors.password && (<p className="text-small text-red-700 mt-2">{errors.password}</p>)}
                    </div>

                    <div className="input-group relative ">
                        <input
                            type ={showPassword? "text":"password"}
                            name="password_confirmation"
                            placeholder="Password Confirmation"
                            value={form.password_confirmation}
                            onChange={handleOnChange}
                            disabled={loading}
                            className="w-full border px-5 py-3.5 rounded-full shadow"
                            required />

                        {errors.password_confirmation && (<p className="text-sm text-red-700 mt-2">{errors.password_confirmation}</p>)}
                    </div>


                    <div className="input-group relative flex items-center space-x-2">
                        <input type="checkbox"
                               name="termsAndConditions"
                               checked ={form.termsAndConditions}
                               disabled={loading}
                               onChange={(e)=>
                                setForm(prev=>({
                                ...prev,
                                termsAndConditions:e.target.checked
                            }))}
                               className="h-4 w-4"
                        />
                        <label className="txt-sml cursor-pointer">I have read the terms and conditions</label>
                        {errors.termsAndConditions && (<p className="text-sm text-red-700 mt-2">{errors.termsAndConditions}</p>)}
                    </div>
                </div>



                {firebaseError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 txt-sm">{firebaseError}</p>
                    </div>
                )}


                <div className="input-group relative">
                    <button type="submit" className="w-full bg-[#6366f1] hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-full transition-colors"
                    disabled={loading}>
                        {loading ? "Signing Up" : "Sign Up"}
                    </button>

                </div>

            </form>
            <p className="text-center mt-6 text-gray-600">
                Already have an account? <a href="/login" className="text-blue-600 hover:underline"> Login </a>
            </p>


        </div>
    );
}