import { useState } from 'react';
import { DEMO_USERS } from './data';
import Icon from '@/components/ui/icon';

export default function SearchPanel() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const results = query.length >= 2
    ? DEMO_USERS.filter(u =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.username.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Rubik, sans-serif' }}>Поиск</h2>
        <div className={`relative transition-all ${focused ? 'scale-[1.01]' : ''}`}>
          <Icon name="Search" size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск людей..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/60 transition-all"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors">
              <Icon name="X" size={15} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {query.length === 0 && (
          <div className="px-3 py-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Рекомендуемые</p>
            <div className="space-y-1">
              {DEMO_USERS.slice(0, 3).map((user, i) => (
                <SearchResultItem key={user.id} user={user} index={i} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl mx-auto mb-3">🔍</div>
              <p className="text-sm text-muted-foreground">Введите имя или @username<br />для поиска пользователей</p>
            </div>
          </div>
        )}

        {query.length >= 2 && results.length === 0 && (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl mx-auto mb-3">😕</div>
            <p className="text-sm text-muted-foreground">Пользователи не найдены</p>
            <p className="text-xs text-muted-foreground mt-1">Попробуйте другой запрос</p>
          </div>
        )}

        {results.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-3">
              Результаты · {results.length}
            </p>
            <div className="space-y-1">
              {results.map((user, i) => (
                <SearchResultItem key={user.id} user={user} index={i} highlight={query} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SearchResultItem({ user, index, highlight }: { user: ReturnType<typeof DEMO_USERS[0]['valueOf']>; index: number; highlight?: string }) {
  const highlightText = (text: string) => {
    if (!highlight) return <span>{text}</span>;
    const idx = text.toLowerCase().indexOf(highlight.toLowerCase());
    if (idx === -1) return <span>{text}</span>;
    return (
      <>
        {text.slice(0, idx)}
        <span className="grad-text font-bold">{text.slice(idx, idx + highlight.length)}</span>
        {text.slice(idx + highlight.length)}
      </>
    );
  };

  return (
    <button
      className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-white/5 transition-all hover:scale-[1.01] text-left animate-fade-in"
      style={{ animationDelay: `${index * 0.04}s`, opacity: 0, animationFillMode: 'forwards' }}
    >
      <div className="relative shrink-0">
        <div className="w-11 h-11 rounded-xl bg-white/8 flex items-center justify-center text-xl">
          {user.avatar}
        </div>
        {user.status === 'online' && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0d0d14]" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="font-semibold text-white text-sm">{highlightText(user.name)}</span>
          {user.verified && <span className="text-[10px]">✅</span>}
        </div>
        <p className="text-xs text-muted-foreground">@{highlightText(user.username)}</p>
      </div>
      <button className="w-8 h-8 rounded-xl grad-bg flex items-center justify-center hover:scale-105 transition-all">
        <Icon name="MessageCircle" size={14} className="text-white" />
      </button>
    </button>
  );
}
