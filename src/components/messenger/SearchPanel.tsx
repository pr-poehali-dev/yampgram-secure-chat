import { useState, useEffect } from 'react';
import { apiSearchUsers } from '@/api';
import Icon from '@/components/ui/icon';

interface User { id: number; username: string; name: string; avatar: string; friendship_status?: string; }

export default function SearchPanel() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await apiSearchUsers(query);
        setResults(data.users || []);
      } catch { setResults([]); }
      finally { setSearching(false); }
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Rubik, sans-serif' }}>Поиск</h2>
        <div className="relative">
          <Icon name="Search" size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Поиск людей..." value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/60 transition-all" />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors">
              <Icon name="X" size={15} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {searching && <p className="text-xs text-muted-foreground px-3 py-4">Ищем...</p>}

        {!searching && query.length >= 2 && results.length === 0 && (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl mx-auto mb-3">😕</div>
            <p className="text-sm text-muted-foreground">Пользователи не найдены</p>
          </div>
        )}

        {query.length < 2 && (
          <div className="text-center py-12 px-4">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl mx-auto mb-3">🔍</div>
            <p className="text-sm text-muted-foreground">Введите имя или @username<br />для поиска пользователей</p>
          </div>
        )}

        {results.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-3">
              Результаты · {results.length}
            </p>
            <div className="space-y-1">
              {results.map((user, i) => (
                <div key={user.id}
                  className="flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-white/5 transition-all animate-fade-in"
                  style={{ animationDelay: `${i * 0.04}s`, opacity: 0, animationFillMode: 'forwards' }}>
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-xl bg-white/8 flex items-center justify-center text-xl">{user.avatar}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-semibold text-white text-sm">{user.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                  </div>
                  {user.friendship_status === 'accepted' ? (
                    <span className="text-xs text-emerald-400 px-2">Друг</span>
                  ) : user.friendship_status === 'pending' ? (
                    <span className="text-xs text-muted-foreground px-2">Отправлено</span>
                  ) : (
                    <button className="w-8 h-8 rounded-xl grad-bg flex items-center justify-center hover:scale-105 transition-all">
                      <Icon name="MessageCircle" size={14} className="text-white" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
