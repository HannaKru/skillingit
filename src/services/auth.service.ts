import {createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider,sendEmailVerification} from "firebase/auth";
import {auth} from "@/lib/firebase";

export async function registerUser(email: string, password:string){
    return createUserWithEmailAndPassword(auth, email,password);
}
export async function syncUserWithDatabase(user:any){
    const response = await fetch('/api/users',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            email: user.email,
            firebaseUud: user.uid,
            emailVerified: user.emailVerified,
        })
    });
    if (!response.ok){
        const error= await response.json();
        throw new Error (error.error || 'Failed to sync with database');
    }
    return response;
}

export async function registerWithGoogle(){
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await syncUserWithDatabase(result.user);
    return result.user;
}