import {useState} from "react";
import { useRouter } from 'next/navigation'
import {Eye, EyeOff} from 'lucide-react';
import {FcGoogle} from 'react-icons/fc';
import {signInWithPopup, GoogleAuthProvider, sendEmailVerification} from 'firebase/auth'
import {auth} from '@/lib/firebase'

export default function LoginForm(){
    const router= useRouter();
    const [email, setEmail]=useState<string>("");
    const [password, setPassword]=useState<string>("");
    const [showPassword, setShowPassword]=useState<boolean>(false);
    const [login,setLogin]=useState<boolean>(false);

    const handleLoginWithGoogle=()=>{};


}