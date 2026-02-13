

export default function LoginPageForm({login, email, setEmail, error, pass, setPass}) {


    return (
        <div className="p-8 max-w-sm mx-auto text-white flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-xl mb-4">Login</h2>
            <form onSubmit={login} className="space-y-4">
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full md:text-sm bg-white/10 border border-white/5 rounded-xl outline-none p-2" />
                <input type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} className="mt-1 w-full md:text-sm bg-white/10 border border-white/5 rounded-xl outline-none p-2" />
                <button type="submit" className="w-full px-4 py-2 rounded-xl bg-zinc-500 text-white hover:bg-zinc-300 transform transition-all hover:text-black">Login</button>
                {error && (
                    <div className='mt-4 bg-red-600 font-mono text-white p-2 rounded-xl w-full text-xs'>{error}</div>
                )}
            </form>
        </div>
    )
}
