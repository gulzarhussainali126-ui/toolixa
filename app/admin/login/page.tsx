'use client';
import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { ShieldCheck, Command, LoaderCircle, LockKeyhole } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(''); setBusy(true);
    try {
      const result = await signIn('credentials', { email, password, redirect: false, callbackUrl: '/admin' });
      if (result?.ok) { const target = new URLSearchParams(window.location.search).get('callbackUrl'); window.location.assign(target?.startsWith('/admin') ? target : '/admin'); }
      else setError('Login details ghalat hain, ya server par admin credentials configure nahi.');
    } catch { setError('Login mukammal nahi ho saka. Server configuration check karein.'); }
    finally { setBusy(false); }
  }
  return <main className="toolixa-login"><div className="login-glow"/><section className="login-card"><div className="login-mark"><Command size={27}/></div><p className="login-eyebrow"><ShieldCheck size={14}/> SECURE ADMIN ACCESS</p><h1>Welcome back.</h1><p className="login-copy">TOOLIXA Command Center mein sign in karein.</p><form onSubmit={submit}><label>Admin email<input autoComplete="username" type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label><label>Password<input autoComplete="current-password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>{error&&<p className="login-error" role="alert">{error}</p>}<button disabled={busy} type="submit">{busy?<LoaderCircle className="spin" size={17}/>:<LockKeyhole size={17}/>} {busy?'Verifying…':'Secure sign in'}</button></form><div className="login-foot"><span>Encrypted session</span><span>•</span><span>Admin-only workspace</span></div></section><style jsx>{`
.toolixa-login{min-height:100vh;background:#08080c;color:#f7f6fb;display:grid;place-items:center;padding:24px;position:relative;overflow:hidden;font-family:Inter,ui-sans-serif,system-ui,sans-serif}.login-glow{position:absolute;width:560px;height:560px;border-radius:50%;background:radial-gradient(circle,rgba(140,111,255,.19),transparent 68%);top:-240px;right:-160px;pointer-events:none}.login-card{position:relative;width:min(100%,430px);border:1px solid #292735;background:rgba(17,16,24,.92);padding:38px;border-radius:24px;box-shadow:0 30px 100px #0008}.login-mark{width:52px;height:52px;display:grid;place-items:center;border-radius:16px;background:#a18aff;color:#100d1b;margin-bottom:30px}.login-eyebrow{display:flex;gap:8px;align-items:center;font-size:11px;letter-spacing:1.8px;color:#b5a6ff;font-weight:800}.login-card h1{font-size:32px;letter-spacing:-1.2px;margin:12px 0 8px}.login-copy{color:#aaa7b6;font-size:14px;margin-bottom:28px}.login-card form{display:grid;gap:17px}.login-card label{display:grid;gap:8px;color:#d5d2df;font-size:12px;font-weight:700}.login-card input{width:100%;box-sizing:border-box;background:#0b0a10;border:1px solid #343140;border-radius:11px;padding:13px 14px;color:#fff;outline:none}.login-card input:focus{border-color:#a18aff;box-shadow:0 0 0 3px #a18aff20}.login-card button{display:flex;align-items:center;justify-content:center;gap:9px;margin-top:4px;border:0;border-radius:11px;padding:14px;background:#a18aff;color:#120e20;font-weight:800;cursor:pointer}.login-card button:disabled{opacity:.7;cursor:wait}.login-error{font-size:12px;color:#ff9292;background:#ff454510;border:1px solid #ff454533;padding:10px;border-radius:9px}.login-foot{display:flex;justify-content:center;gap:8px;color:#777383;font-size:10px;margin-top:26px}.spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:480px){.login-card{padding:27px 22px}}
`}</style></main>;
}
