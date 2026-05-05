import PublicHeader from "@/components/PublicHeader";
import LoginForm from "@/components/LoginForm";


export default function LoginPage(){
    return(
        <div>
            <PublicHeader/>
            <div className= "min-h-screen flex bg-white">
                {/* left side*/}
                <div className="hidden lg:flex w-1/2 bg-white items-center justify-center p-12">
                    <div className="relative w-[760px] h-[560px]">
                        <img src="/images/light-bubble.svg" alt="" className="absolute left-17.5 top-10 w-20" />
                        <img src="/images/girl.svg" alt="" className="absolute left-10 top-22.5 w-75" />
                        <img src="/images/check-bubble.svg" alt="" className="absolute left-68 top-13 w-22.5" />
                        <img src="/images/code-bubble.svg" alt="" className="absolute left-105 top-45 w-23.75" />
                        <img src="/images/boy.svg" alt="" className="absolute left-110 top-60 w-77.5" />
                        <img src="/images/abc.svg" alt="" className="absolute right-2 top-30.5 w-18.75" />
                    </div>
                </div>

                {/* right side */}
                <div className="w-1/2 flex items-center justify-center p-6 lg:p-8">
                    <div className="w-full max-w-md">
                        <h1 className="text-4xl font-semibold text-center mb-8 text-gray-900">Welcome Back!</h1>
                        <LoginForm/>
                    </div>
                </div>
            </div>
        </div>
    );
}