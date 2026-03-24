import RegistrationForm from "@/components/RegistrationForm";
export default function RegistrationPage() {
    return(
        <div className= "min-h-screen flex bg-white">
            {/* left side*/}
            <div className=" hidden lg:flex w-1/2 bg-[#f8fafc]  items-center justify-center p-12">
                <div className="relative">
                    <img src="/images/SKLITSignUp.png" alt="regiser illustration" className="w-96"/>
                </div>
            </div>

            {/* right side */}
            <div className="w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold text-center mb-8">Create an Account</h1>
                    <RegistrationForm />
                </div>
            </div>
        </div>
    )
}