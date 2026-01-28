import { Suspense } from "react";
import LoginContent from "./components/LoginContent";


export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}