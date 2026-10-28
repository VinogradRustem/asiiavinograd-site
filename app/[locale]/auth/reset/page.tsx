'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const locale = useLocale();
  const router = useRouter();
  const isRu = locale === 'ru';
  const [ready, setReady] = useState(false);
  const [expired, setExpired] = useState(false);
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && /error_code=|error=/.test(window.location.hash + window.location.search)) {
      setExpired(true);
      return;
    }
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) setReady(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => { if (session) setReady(true); });
    const t = setTimeout(() => {
      supabase.auth.getSession().then(({ data: { session } }) => { if (!session) setExpired(true); });
    }, 4000);
    return () => { sub.subscription.unsubscribe(); clearTimeout(t); };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError(isRu ? 'Пароль должен быть не короче 6 символов.' : 'Password must be at least 6 characters.'); return; }
    if (password !== password2) { setError(isRu ? 'Пароли не совпадают.' : 'Passwords do not match.'); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(/different|same/i.test(error.message)
        ? (isRu ? 'Новый пароль должен отличаться от старого.' : 'The new password must differ from the old one.')
        : (isRu ? 'Не получилось сменить пароль. Запросите новую ссылку.' : 'Could not change the password. Please request a new link.'));
      return;
    }
    setDone(true);
    setTimeout(() => router.push(isRu ? '/ru/dashboard' : '/dashboard'), 1500);
  };

  const inp = 'w-full bg-white/60 border border-ink/15 rounded-xl px-4 py-3 text-ink placeholder-muted/70 focus:outline-none focus:border-steel transition-colors text-sm';
  const authHref = isRu ? '/ru/auth' : '/auth';

  return (
    <main className="page-bg min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ink">{isRu ? 'Новый пароль' : 'New password'}</h1>
          <p className="text-muted mt-2">Dr. Asiia Vinograd | USMLE</p>
        </div>
        <div className="bg-white/60 border border-white rounded-[28px] p-8">
          {done ? (
            <p className="text-green-600 text-sm">{isRu ? 'Пароль изменён. Открываем личный кабинет…' : 'Password changed. Opening your account…'}</p>
          ) : expired && !ready ? (
            <div className="space-y-4">
              <p className="text-sm text-ink">{isRu ? 'Ссылка устарела или уже использована. Запросите новую на странице входа.' : 'This link has expired or was already used. Request a new one on the sign-in page.'}</p>
              <a href={authHref} className="block text-center w-full bg-slate hover:bg-ink text-white py-3 rounded-xl font-medium transition-all">{isRu ? 'Ко входу' : 'Go to sign in'}</a>
            </div>
          ) : !ready ? (
            <p className="text-muted text-sm">{isRu ? 'Проверяем ссылку…' : 'Checking the link…'}</p>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <input type="password" placeholder={isRu ? 'Новый пароль' : 'New password'} value={password} onChange={e => setPassword(e.target.value)} className={inp} required minLength={6} autoComplete="new-password" />
              <input type="password" placeholder={isRu ? 'Повторите пароль' : 'Repeat password'} value={password2} onChange={e => setPassword2(e.target.value)} className={inp} required minLength={6} autoComplete="new-password" />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" disabled={loading} className="w-full bg-slate hover:bg-ink text-white py-3 rounded-xl font-medium transition-all disabled:opacity-60">
                {loading ? '...' : (isRu ? 'Сохранить пароль' : 'Save password')}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
