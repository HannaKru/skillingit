import RegistrationForm from "@/components/RegistrationForm";
export default function RegistrationPage() {
    return(
        <div className= "min-h-screen flex bg-white">
            {/* left side*/}
            <div className="hidden lg:flex w-1/2 bg-white items-center justify-center p-12">
                <div className="relative w-[760px] h-[560px]">
                    <img src="/images/light-bubble.svg" alt="" className="absolute left-17.5 top-10 w-20" />
                    <img src="/images/girl.svg" alt="" className="absolute left-10 top-22.5 w-75" />
                    <img src="/images/check-bubble.svg" alt="" className="absolute left-68 top-13 w-22.5" />
                    <img src="/images/code-bubble.svg" alt="" className="absolute left-105 top-45 w-23.75" />
                    <img src="/images/boy.svg" alt="" className="absolute left-110 top-60 w-77.5" />
                    <img src="/images/abc.svg" alt="" className="absolute right-17.5 top-47.5 w-18.75" />
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