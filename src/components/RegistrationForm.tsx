'use client';
import React, {useState} from "react";
import {Eye, EyeOff} from 'lucide-react';

type formErrors={
    email?: string;
    password?: string;
    password_confirmation?:string;
};


export default function RegistrationForm() {
    const [form, setForm]=useState({
        email:"",
        password:"",
        password_confirmation:""
    });
    const [showPassword, setShowPassword]=useState(false);
    const [errors, setErrors]=useState<formErrors>({});
    const [submitted, setSubmitted]=useState(false);
    const [termsAndConditions, setTermsAndConditions]=useState(false)

    const handleOnChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
        const {name, value}=event.target;
        setForm((prev)=>({
            ...prev,
            [name]:value
        }));

        setErrors((prev)=>({
            ...prev,
            [name]:""

            }));
    }

    const checkValidEmail=(email:string)=>{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };


    const validate=(): formErrors => {
        const newErrors: formErrors={};
        const strongPassReg=/^(?=.*[A-Z])(?=.*\d)(?=.*[a-z]).+$/;
        if(form.email.trim()==""){
            newErrors.email="Please enter an email address";
        }
        else if (!checkValidEmail(form.email)){
            newErrors.email="Email must be valid";
        }

        if(form.password.trim()===""){
            newErrors.password="Please enter a password"
        }
        else if(!strongPassReg.test(form.password)){
            newErrors.password="Password must contain an Uppercase letter, lowercase letter, and a number";
        }
        else if(form.password.length<6){
            newErrors.password="Password must be at least 6 characters";
        }

        if(form.password !==  form.password_confirmation){
            newErrors.password_confirmation="Passwords do not match";
        }

        return newErrors;

    };

    const handleFormSubmit=(event:React.ChangeEvent)=>{
        event.preventDefault();
        const validationErrors=validate();
        if(Object.keys(validationErrors).length===0){
            setSubmitted(true);
        }
        else {
            setErrors(validationErrors);
            setSubmitted(false);
        }

    }




    return (
        <form className="space-y-4 ">
            <div className="input-group flex flex-col">
                <div>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleOnChange}
                        className="w-full border px-3 py-2 rounded"
                        required />
                    <label>Email</label>
                    {errors.email && (<p className="text-small text-red-700 mt-2">{errors.email}</p>)}
                </div>

                <div className="input-group relative">
                    <input
                        type= {showPassword? "text":"password"}
                        name="password"
                        value={form.password}
                        onChange={handleOnChange}
                        className="w-full border px-3 py-2 rounded"
                        required />
                    <label>Password</label>
                    <button
                        type="button"
                        className="eye-button"
                        onClick={()=>setShowPassword(prev=>!prev)}
                    >{!showPassword? <Eye /> : <EyeOff />}</button>
                    {errors.password && (<p className="text-small text-red-700 mt-2">{errors.password}</p>)}
                </div>

                <div className="imput-group relative">
                    <input


                    />




                </div>





            </div>



            <div className="input-group relative">

            </div>

    </form>);
}