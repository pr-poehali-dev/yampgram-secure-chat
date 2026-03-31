import { useState, useEffect, useCallback } from 'react';
import { apiFriends, apiUnread, apiMessages } from '@/api';
import Icon from '@/components/ui/icon';

export interface Friend {
  id: number;
  username: string;
  name: string;
  avatar: string;
  lastMessage?: string;
  lastTime?: string;
  unread?: number;
}

interface ChatListProps {
  onSelectChat: (friend: Friend) => void;
  selectedId: number | null;
  currentUserId: number;
  refreshTrigger?: number;
}

export default function ChatList({ onSelectChat, selectedId, currentUserId, refreshTrigger }: ChatListProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadFriends = useCallback(async () => {
    try {
      const [fData, uData] = await Promise.all([apiFriends(), apiUnread()]);
      const unread: Record<string, number> = uData.unread || {};
      const list: Friend[] = fData.friends || [];
      const enriched = await Promise.all(list.map(async (f: Friend) => {
        try {
          const mData = await apiMessages(f.id);
          const msgs = mData.messages || [];
          const last = msgs[msgs.length - 1];
          return { ...f, lastMessage: last ? last.text : undefined, lastTime: last ? last.time : undefined, unread: unread[String(f.id)] || 0 };
        } catch {
          return { ...f, unread: unread[String(f.id)] || 0 };
        }
      }));
      setFriends(enriched);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFriends(); }, [loadFriends, refreshTrigger]);
  useEffect(() => {
    const t = setInterval(loadFriends, 5000);
    return () => clearInterval(t);
  }, [loadFriends]);

  const filtered = friends.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Rubik, sans-serif' }}>Чаты</h2>
        </div>
        <div className="relative">
          <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Поиск чатов..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/8 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 transition-colors" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        {loading && <div className="text-center py-10 text-muted-foreground text-sm">Загружаем чаты...</div>}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground px-4">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl mx-auto mb-3">💬</div>
            <p className="text-sm font-medium text-white mb-1">Пока нет чатов</p>
            <p className="text-xs">Добавь друга в разделе «Контакты» и начни общение</p>
          </div>
        )}
        {filtered.map((friend, i) => (
          <button key={friend.id} onClick={() => onSelectChat(friend)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all hover:scale-[1.01] text-left animate-fade-in ${selectedId === friend.id ? 'bg-white/10 border border-white/12' : 'hover:bg-white/5'}`}
            style={{ animationDelay: `${i * 0.04}s`, opacity: 0, animationFillMode: 'forwards' }}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${selectedId === friend.id ? 'grad-bg glow-purple' : 'bg-white/8'}`}>
              {friend.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-semibold text-white text-sm truncate">{friend.name}</span>
                {friend.lastTime && <span className="text-xs text-muted-foreground shrink-0 ml-2">{friend.lastTime}</span>}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground truncate">{friend.lastMessage || `@${friend.username}`}</p>
                {(friend.unread || 0) > 0 && (
                  <span className="shrink-0 ml-2 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                    style={{ background: 'var(--grad-main)' }}>{friend.unread}</span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
