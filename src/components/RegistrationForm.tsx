'use client';
import React, {useState} from "react";
import {Eye, EyeOff} from 'lucide-react';
import {FcGoogle} from 'react-icons/fc'

type formErrors={
    email?: string;
    password?: string;
    password_confirmation?:string;
    termsAndConditions?:string;
};


export default function RegistrationForm() {
    const [form, setForm]=useState({
        email:"",
        password:"",
        password_confirmation:"",
        termsAndConditions:false
    });
    const [showPassword, setShowPassword]=useState(false);
    const [errors, setErrors]=useState<formErrors>({});
    const [submitted, setSubmitted]=useState(false);


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

        if(!form.termsAndConditions)
            newErrors.termsAndConditions ="Please confirm terms and conditions"

        return newErrors;

    };

    const handleFormSubmit=(event: React.FormEvent<HTMLFormElement>)=>{
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
        <div className="flex flex-col">
            <button
                type="button"
                className="w-full border border-gray-300 rounded-full py-2 px-4 flex items-center justify-center gap-2 hover:bg-gray-50">
                <FcGoogle className="w-5 h-5"/>
            </button>
            {/*Divider*/}
            <div className="flex items-center gap-4 my-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="text-gray-500 text-sm">or</span>
                <div className="flex-1 border-t border-gray-300"></div>
            </div>
            <form className="space-y-4" onSubmit={handleFormSubmit}>
                <div className="input-group flex flex-col">
                    <div className="input-group relative">

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleOnChange}
                            className="w-full border px-3 py-2 rounded"
                            required />

                        {errors.email && (<p className="text-small text-red-700 mt-2">{errors.email}</p>)}
                    </div>

                    <div className="input-group relative">

                        <input
                            type= {showPassword? "text":"password"}
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleOnChange}
                            className="w-full border px-3 py-2 rounded"
                            required />

                        <button
                            type="button"
                            className="eye-button"
                            onClick={()=>setShowPassword(prev=>!prev)}
                        >{!showPassword? <Eye /> : <EyeOff />}</button>
                        {errors.password && (<p className="text-small text-red-700 mt-2">{errors.password}</p>)}
                    </div>

                    <div className="input-group relative">
                        <input
                            type ={showPassword? "text":"password"}
                            name="password_confirmation"
                            placeholder="Password Confirmation"
                            value={form.password_confirmation}
                            onChange={handleOnChange}
                            className="w-full border px-3 py-2 rounded"
                            required />

                        {errors.password_confirmation && (<p className="text-sm text-red-700 mt-2">{errors.password_confirmation}</p>)}
                    </div>


                    <div className="input-group relative flex items-center space-x-2">
                        <input type="checkbox"
                               name="termsAndConditions"
                               checked ={form.termsAndConditions}
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



                <div className="input-group relative">
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-full transition-colors">
                        Sign Up
                    </button>

                </div>

            </form>
            <p className="text-center mt-6 text-gray-600">
                Already have an account? <a href="/login" className="text-blue-600 hover:underline"> Login </a>
            </p>


        </div>
    );
}