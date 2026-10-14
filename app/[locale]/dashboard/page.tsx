'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const locale = useLocale();
  const router = useRouter();
  const isRu = locale === 'ru';
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push(locale === 'ru' ? '/ru/auth' : '/auth');
      } else {
        setUser(user);
        setLoading(false);
      }
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push(locale === 'ru' ? '/ru' : '/');
  };

  if (loading) return (
    <main className="page-bg min-h-screen flex items-center justify-center">
      <div className="text-muted">Loading...</div>
    </main>
  );

  return (
    <main className="page-bg min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <a href={locale === 'ru' ? '/ru' : '/'} className="text-muted text-sm hover:text-ink mb-4 block">
              ← {isRu ? 'На главную' : 'Back to home'}
            </a>
            <h1 className="text-3xl font-bold text-ink">
              {isRu ? 'Личный кабинет' : 'Dashboard'}
            </h1>
            <p className="text-muted mt-1">{user?.email}</p>
          </div>
          <button onClick={handleSignOut}
            className="border border-ink/15 text-graphite hover:text-ink px-4 py-2 rounded-xl text-sm transition-colors">
            {isRu ? 'Выйти' : 'Sign Out'}
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            { icon: '📚', title: isRu ? 'QBank' : 'QBank', desc: isRu ? 'Вопросы для практики' : 'Practice questions', soon: false },
            { icon: '📊', title: isRu ? 'Прогресс' : 'Progress', desc: isRu ? 'Ваша статистика' : 'Your statistics', soon: false },
            { icon: '🎓', title: isRu ? 'Курсы' : 'Courses', desc: isRu ? 'Видео лекции' : 'Video lectures', soon: true },
            { icon: '📝', title: isRu ? 'Флэшкарты' : 'Flashcards', desc: isRu ? 'Анки карточки' : 'Anki-style cards', soon: true },
            { icon: '🏆', title: isRu ? 'Рейтинг' : 'Leaderboard', desc: isRu ? 'Среди студентов' : 'Among students', soon: true },
            { icon: '💬', title: isRu ? 'Вопросы' : 'Q&A', desc: isRu ? 'Задать вопрос' : 'Ask a question', soon: true },
          ].map(item => (
            <div key={item.title} className={`bg-white/60 border border-white rounded-[24px] p-6 ${item.soon ? 'opacity-50' : 'hover:border-steel/40 cursor-pointer'} transition-all`}>
              <div className="text-3xl mb-3">{item.icon}</div>
              <div className="font-semibold text-ink mb-1">{item.title}</div>
              <div className="text-muted text-sm">{item.desc}</div>
              {item.soon && <div className="text-steel text-xs mt-2">{isRu ? 'Скоро' : 'Coming Soon'}</div>}
            </div>
          ))}
        </div>

        <div className="bg-white/60 border border-white rounded-[24px] p-6">
          <h2 className="font-semibold text-ink mb-4">{isRu ? 'Ваш план' : 'Your Plan'}</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-steel font-medium">{isRu ? 'Бесплатный' : 'Free'}</div>
              <div className="text-muted text-sm mt-1">{isRu ? 'Ограниченный доступ' : 'Limited access'}</div>
            </div>
            <a href="https://patreon.com/drasiiavinograd" target="_blank" rel="noopener noreferrer"
              className="bg-slate hover:bg-ink text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors">
              {isRu ? 'Улучшить' : 'Upgrade'} → $30/mo
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
