import { useState, useEffect, useCallback } from 'react';
import { apiFriends, apiFriendRequests, apiSearchUsers, apiAddFriend, apiAcceptFriend, apiDeclineFriend } from '@/api';
import Icon from '@/components/ui/icon';

interface User { id: number; username: string; name: string; avatar: string; friendship_status?: string; }

interface ContactsPanelProps {
  onStartChat?: (friend: { id: number; username: string; name: string; avatar: string }) => void;
  onFriendsChanged?: () => void;
}

export default function ContactsPanel({ onStartChat, onFriendsChanged }: ContactsPanelProps) {
  const [friends, setFriends] = useState<User[]>([]);
  const [requests, setRequests] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [tab, setTab] = useState<'friends' | 'add'>('friends');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [addUsername, setAddUsername] = useState('');
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');

  const load = useCallback(async () => {
    const [fData, rData] = await Promise.all([apiFriends(), apiFriendRequests()]);
    setFriends(fData.friends || []);
    setRequests(rData.requests || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (search.length < 2) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await apiSearchUsers(search);
        setSearchResults(data.users || []);
      } catch { setSearchResults([]); }
      finally { setSearching(false); }
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleAdd = async () => {
    if (!addUsername.trim()) return;
    setActionLoading(-1); setAddError(''); setAddSuccess('');
    try {
      await apiAddFriend(addUsername.trim());
      setAddSuccess(`Заявка отправлена @${addUsername.trim()}`);
      setAddUsername('');
    } catch (e: unknown) {
      setAddError(e instanceof Error ? e.message : 'Ошибка');
    } finally { setActionLoading(null); }
  };

  const handleAccept = async (userId: number) => {
    setActionLoading(userId);
    await apiAcceptFriend(userId);
    await load();
    onFriendsChanged?.();
    setActionLoading(null);
  };

  const handleDecline = async (userId: number) => {
    setActionLoading(userId);
    await apiDeclineFriend(userId);
    await load();
    setActionLoading(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Rubik, sans-serif' }}>Контакты</h2>
        {/* Tabs */}
        <div className="flex gap-1 glass rounded-xl p-1 mb-4">
          <button onClick={() => setTab('friends')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'friends' ? 'grad-bg text-white glow-purple' : 'text-muted-foreground hover:text-white'}`}>
            Друзья {friends.length > 0 && <span className="ml-1 opacity-70">({friends.length})</span>}
          </button>
          <button onClick={() => setTab('add')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all relative ${tab === 'add' ? 'grad-bg text-white glow-purple' : 'text-muted-foreground hover:text-white'}`}>
            Добавить
            {requests.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white" style={{ background: 'var(--brand-pink)' }}>{requests.length}</span>}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {tab === 'friends' && (
          <div className="space-y-1">
            {friends.length === 0 && (
              <div className="text-center py-10 text-muted-foreground px-4">
                <div className="text-3xl mb-2">👥</div>
                <p className="text-sm font-medium text-white mb-1">Нет друзей</p>
                <p className="text-xs">Перейди на вкладку «Добавить» и найди друга</p>
              </div>
            )}
            {friends.map((f, i) => (
              <div key={f.id} className="flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-white/5 transition-all animate-fade-in"
                style={{ animationDelay: `${i * 0.04}s`, opacity: 0, animationFillMode: 'forwards' }}>
                <div className="w-10 h-10 rounded-xl bg-white/8 flex items-center justify-center text-xl shrink-0">{f.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm">{f.name}</p>
                  <p className="text-xs text-muted-foreground">@{f.username}</p>
                </div>
                <button onClick={() => onStartChat?.(f)}
                  className="w-8 h-8 rounded-xl grad-bg flex items-center justify-center hover:scale-105 transition-all">
                  <Icon name="MessageCircle" size={14} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'add' && (
          <div className="space-y-4">
            {/* Incoming requests */}
            {requests.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-2">
                  Заявки в друзья · {requests.length}
                </p>
                <div className="space-y-1">
                  {requests.map(r => (
                    <div key={r.id} className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white/5 border border-white/8">
                      <div className="w-10 h-10 rounded-xl bg-white/8 flex items-center justify-center text-xl shrink-0">{r.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm">{r.name}</p>
                        <p className="text-xs text-muted-foreground">@{r.username}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleAccept(r.id)} disabled={actionLoading === r.id}
                          className="w-8 h-8 rounded-xl grad-bg flex items-center justify-center hover:scale-105 transition-all disabled:opacity-50">
                          <Icon name="Check" size={14} className="text-white" />
                        </button>
                        <button onClick={() => handleDecline(r.id)} disabled={actionLoading === r.id}
                          className="w-8 h-8 rounded-xl bg-white/8 flex items-center justify-center hover:bg-red-500/20 transition-all disabled:opacity-50">
                          <Icon name="X" size={14} className="text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add by username */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-2">Добавить по username</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                  <input type="text" placeholder="username" value={addUsername}
                    onChange={e => { setAddUsername(e.target.value.replace(/\s/g, '').toLowerCase()); setAddError(''); setAddSuccess(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-7 pr-3 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 transition-colors" />
                </div>
                <button onClick={handleAdd} disabled={!addUsername.trim() || actionLoading === -1}
                  className="px-4 py-2.5 rounded-xl grad-bg text-white text-sm font-medium hover:scale-105 transition-all disabled:opacity-50">
                  {actionLoading === -1 ? '...' : 'Добавить'}
                </button>
              </div>
              {addError && <p className="text-red-400 text-xs mt-2 px-1">{addError}</p>}
              {addSuccess && <p className="text-emerald-400 text-xs mt-2 px-1">{addSuccess}</p>}
            </div>

            {/* Search */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-2">Поиск людей</p>
              <div className="relative">
                <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" placeholder="Имя или @username..." value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 transition-colors" />
              </div>
              {searching && <p className="text-xs text-muted-foreground px-1 mt-2">Ищем...</p>}
              <div className="space-y-1 mt-2">
                {searchResults.map((u, i) => (
                  <div key={u.id} className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-white/5 transition-all animate-fade-in"
                    style={{ animationDelay: `${i * 0.04}s`, opacity: 0, animationFillMode: 'forwards' }}>
                    <div className="w-10 h-10 rounded-xl bg-white/8 flex items-center justify-center text-lg shrink-0">{u.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm">{u.name}</p>
                      <p className="text-xs text-muted-foreground">@{u.username}</p>
                    </div>
                    {u.friendship_status === 'accepted' ? (
                      <span className="text-xs text-emerald-400">Друг</span>
                    ) : u.friendship_status === 'pending' ? (
                      <span className="text-xs text-muted-foreground">Отправлено</span>
                    ) : (
                      <button onClick={async () => {
                        setActionLoading(u.id);
                        try { await apiAddFriend(u.username); setSearchResults(prev => prev.map(x => x.id === u.id ? { ...x, friendship_status: 'pending' } : x)); }
                        catch { /* ignore */ }
                        finally { setActionLoading(null); }
                      }} disabled={actionLoading === u.id}
                        className="w-8 h-8 rounded-xl grad-bg flex items-center justify-center hover:scale-105 transition-all disabled:opacity-50">
                        <Icon name={actionLoading === u.id ? 'Loader' : 'UserPlus'} size={14} className="text-white" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
