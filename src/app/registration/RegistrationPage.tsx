import RegistrationForm from "@/components/RegistrationForm";
export default function RegistrationPage() {
    return(
        <div className= "min-h-screen flex bg-white">
            {/* left side*/}
            <div className=" hidden lg:flex w-1/2 bg-[#f8fafc]  items-center justify-center p-12 relative">
                <div className="relative">
                    <img src="/images/SKLITSignUp.png" alt="Sign up illustration" className="w-[420px]"/>
                </div>
            </div>

            {/* right side */}
            <div className="w-1/2 flex items-center justify-center p-6 lg:p-8">
                <div className="w-full max-w-md">
                    <h1 className="text-4xl font-semibold text-center mb-8 text-gray-900">Create an Account</h1>
                    <p className="text-center text-gray-500 mb-10">Join Skillingit and start your learning journey</p>
                    <RegistrationForm />
                </div>
            </div>
        </div>
    )
}