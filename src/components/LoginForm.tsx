import {useState} from "react";
import { useRouter } from 'next/navigation'
import {Eye, EyeOff} from 'lucide-react';
import {FcGoogle} from 'react-icons/fc';
import {signInWithPopup, GoogleAuthProvider, sendEmailVerification, signInWithEmailAndPassword} from 'firebase/auth'
import {auth} from '@/lib/firebase'

export default function LoginForm(){
    const router= useRouter();
    const [email, setEmail]=useState<string>("");
    const [password, setPassword]=useState<string>("");
    const [showPassword, setShowPassword]=useState<boolean>(false);
    const [loading, setLoading]=useState<boolean>(false);
    const [error,setError]=useState<string>("");

    const handleLoginWithGoogle=async ()=>{
        setLoading(true);
        setError("");
        const provider = new GoogleAuthProvider();
        try{
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const checkResponse=await fetch(`api/users?firebase_uid=${user.uid}`)

            await fetch('api/users/login',{
                method: 'PATCH',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({firebaseUid: user.uid})

            })

        }
        catch(error){

        }
        finally{
            setLoading(false);
        }


    };

    const handleSignInWithEmail=async(e:React.FormEvent)=>{
        e.preventDefault();
        setLoading(true);
        setError("");
        try{
            const userCredential=await signInWithEmailAndPassword(auth, email, password);
            const user= userCredential.user;
            if(!user.emailVerified){ //check if the email is validated
                await sendEmailVerification(user,{ //send email again
                    url:`${window.location.origin}/login?verified=true`,
                    handleCodeInApp:true
                });
                router.push('/validate-email');
                return;
            }
            //email is validated - go to dashboard

            await fetch('api/users/login', {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({firebaseUid: user.uid})
            })
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
                default:
                    setError("Login failed. Please try again.");
            }

        }
        finally{
            setLoading(false);
        }
    };


}