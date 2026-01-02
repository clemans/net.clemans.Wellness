import { type FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        await signIn("credentials", {
            email, password, callbackUrl: "/"
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <form onSubmit={onSubmit} className="w-full max-w-sm bg-white p-6 rounded shadow">
                <h1 className="text-xl font-semibold mb-4">Sign In</h1>
                <label className="block mb-2">
                    <span className="text-sm">Email</span>
                    <input className="mt-1 w-full border px-3 py-2 rounded"
                        value={email} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value) } />
                </label>
                <label className="block mb-4">
                    <span className="text-sm">Password</span>
                    <input type="password" className="mt-1 w-full border px-3 py-2 rounded"
                        value={password} onChange={e => setPassword(e.target.value)} />
                </label>
                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Sign In
                </button>
            </form>
        </div>
    )
}