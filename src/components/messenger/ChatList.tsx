import { useState } from 'react';
import { DEMO_CHATS, DEMO_USERS, Chat } from './data';
import Icon from '@/components/ui/icon';

interface ChatListProps {
  onSelectChat: (chatId: string) => void;
  selectedChatId: string | null;
  currentUserId: string;
}

export default function ChatList({ onSelectChat, selectedChatId, currentUserId }: ChatListProps) {
  const [search, setSearch] = useState('');

  const filtered = DEMO_CHATS.filter(chat => {
    const user = DEMO_USERS.find(u => u.id === chat.userId);
    return user?.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Rubik, sans-serif' }}>Чаты</h2>
          <button className="w-8 h-8 rounded-xl grad-bg flex items-center justify-center glow-purple hover:scale-105 transition-all">
            <Icon name="Plus" size={16} className="text-white" />
          </button>
        </div>
        <div className="relative">
          <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск чатов..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/8 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        {filtered.map((chat, i) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isSelected={selectedChatId === chat.id}
            onSelect={() => onSelectChat(chat.id)}
            index={i}
            currentUserId={currentUserId}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Icon name="MessageCircleOff" size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Чаты не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ChatItem({ chat, isSelected, onSelect, index, currentUserId }: {
  chat: Chat; isSelected: boolean; onSelect: () => void; index: number; currentUserId: string;
}) {
  const user = DEMO_USERS.find(u => u.id === chat.userId);
  if (!user) return null;

  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all hover:scale-[1.01] text-left animate-fade-in ${isSelected
        ? 'bg-white/10 border border-white/12'
        : 'hover:bg-white/5'
        }`}
      style={{ animationDelay: `${index * 0.04}s`, opacity: 0, animationFillMode: 'forwards' }}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${isSelected ? 'grad-bg glow-purple' : 'bg-white/8'}`}>
          {user.avatar}
        </div>
        {user.status === 'online' && (
          <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0d0d14]"
            style={{ boxShadow: '0 0 6px rgba(52,211,153,0.8)' }} />
        )}
        {user.status === 'away' && (
          <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-amber-400 border-2 border-[#0d0d14]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-white text-sm truncate">{user.name}</span>
            {user.verified && <span className="text-[10px]" title="Верифицирован">✅</span>}
          </div>
          <span className="text-xs text-muted-foreground shrink-0 ml-2">{chat.lastTime}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
          {chat.unread > 0 && (
            <span className="shrink-0 ml-2 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
              style={{ background: 'var(--grad-main)' }}>
              {chat.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
