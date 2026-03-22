import RegistrationForm from "@/components/RegistrationForm";
export default function RegistrationPage() {
    return(
        <div className= "min-h-screen flex">
            {/* left side*/}
            <div className="w-1/2 bg-purple-50 flex items-center justify-center">
                <img src="/images/skillingItLoginIllustration.png" alt="regiser illustration" className="w-96"/>
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