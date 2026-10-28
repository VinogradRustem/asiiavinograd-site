'use client';
import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const locale = useLocale();
  const router = useRouter();
  const isRu = locale === 'ru';
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (mode === 'forgot') {
      const redirectTo = `${window.location.origin}${isRu ? '/ru' : ''}/auth/reset`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) setError(isRu ? 'Не получилось отправить письмо. Попробуйте через минуту.' : 'Could not send the email. Please try again in a minute.');
      else setSuccess(isRu ? 'Если такой аккаунт есть, мы отправили письмо со ссылкой для смены пароля. Проверьте также «Спам».' : 'If this account exists, we sent a link to reset your password. Check your spam folder too.');
      setLoading(false);
      return;
    }
    if (mode === 'register') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      });
      if (error) setError(error.message);
      else if (data.session) router.push(locale === 'ru' ? '/ru/dashboard' : '/dashboard');
      else if (data.user && (data.user.identities || []).length === 0) {
        // the email is already registered: Supabase does not say it directly
        setMode('login');
        setError(isRu ? 'Аккаунт с этим email уже есть. Войдите с паролем.' : 'This email is already registered. Please sign in.');
      }
      else setSuccess(isRu ? 'Проверьте email для подтверждения!' : 'Check your email to confirm!');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(isRu ? 'Неверный email или пароль' : 'Invalid email or password');
      else router.push(locale === 'ru' ? '/ru/dashboard' : '/dashboard');
    }
    setLoading(false);
  };

  const inp = 'w-full bg-white/60 border border-ink/15 rounded-xl px-4 py-3 text-ink placeholder-muted/70 focus:outline-none focus:border-steel transition-colors text-sm';

  return (
    <main className="page-bg min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href={locale === 'ru' ? '/ru' : '/'} className="text-muted text-sm hover:text-ink transition-colors">
            ← {isRu ? 'На главную' : 'Back to home'}
          </a>
          <h1 className="text-3xl font-bold text-ink mt-4">
            {mode === 'login' ? (isRu ? 'Войти' : 'Sign In') : mode === 'forgot' ? (isRu ? 'Восстановление пароля' : 'Reset password') : (isRu ? 'Регистрация' : 'Sign Up')}
          </h1>
          <p className="text-muted mt-2">Dr. Asiia Vinograd | USMLE</p>
        </div>

        <div className="bg-white/60 border border-white rounded-[28px] p-8">
          <div className="flex gap-2 mb-6 bg-white/60 rounded-xl p-1">
            <button onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'login' ? 'bg-slate text-white' : 'text-muted hover:text-ink'}`}>
              {isRu ? 'Войти' : 'Sign In'}
            </button>
            <button onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'register' ? 'bg-slate text-white' : 'text-muted hover:text-ink'}`}>
              {isRu ? 'Регистрация' : 'Sign Up'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <input type="text" placeholder={isRu ? 'Ваше имя' : 'Your name'}
                value={name} onChange={e => setName(e.target.value)} className={inp} required />
            )}
            <input type="email" placeholder="Email"
              value={email} onChange={e => setEmail(e.target.value)} className={inp} required />
            {mode !== 'forgot' && (
              <input type="password" placeholder={isRu ? 'Пароль' : 'Password'}
                value={password} onChange={e => setPassword(e.target.value)} className={inp} required minLength={6} />
            )}
            {mode === 'login' && (
              <button type="button" onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }}
                className="text-sm text-muted hover:text-ink transition-colors">
                {isRu ? 'Забыли пароль?' : 'Forgot password?'}
              </button>
            )}
            {mode === 'forgot' && (
              <p className="text-sm text-muted">{isRu ? 'Укажите почту, на которую зарегистрирован кабинет. Пришлём ссылку для нового пароля.' : 'Enter your account email and we will send you a link to set a new password.'}</p>
            )}

            {error && <p className="text-red-400 text-sm">{error}</p>}
            {success && <p className="text-green-400 text-sm">{success}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-slate hover:bg-ink text-white py-3 rounded-xl font-medium transition-all disabled:opacity-60">
              {loading ? '...' : (mode === 'login' ? (isRu ? 'Войти' : 'Sign In') : mode === 'forgot' ? (isRu ? 'Отправить ссылку' : 'Send link') : (isRu ? 'Создать аккаунт' : 'Create Account'))}
            </button>
          </form>
          {mode === 'forgot' && (
            <button type="button" onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              className="mt-4 text-sm text-muted hover:text-ink transition-colors">
              ← {isRu ? 'Назад ко входу' : 'Back to sign in'}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
