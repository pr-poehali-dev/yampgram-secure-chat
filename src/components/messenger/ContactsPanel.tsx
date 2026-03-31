import { useState } from 'react';
import { DEMO_USERS, User } from './data';
import Icon from '@/components/ui/icon';

interface ContactsPanelProps {
  onStartChat?: (userId: string) => void;
}

export default function ContactsPanel({ onStartChat }: ContactsPanelProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<User | null>(null);

  const filtered = DEMO_USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const online = filtered.filter(u => u.status === 'online');
  const away = filtered.filter(u => u.status === 'away');
  const offline = filtered.filter(u => u.status === 'offline');

  return (
    <div className="flex h-full">
      {/* List */}
      <div className="w-full flex flex-col h-full">
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Rubik, sans-serif' }}>Контакты</h2>
            <button className="w-8 h-8 rounded-xl grad-bg flex items-center justify-center glow-purple hover:scale-105 transition-all">
              <Icon name="UserPlus" size={16} className="text-white" />
            </button>
          </div>
          <div className="relative">
            <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск контактов..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/8 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {online.length > 0 && (
            <ContactGroup title="Онлайн" color="text-emerald-400" users={online} onSelect={setSelected} selected={selected} />
          )}
          {away.length > 0 && (
            <ContactGroup title="Отходил" color="text-amber-400" users={away} onSelect={setSelected} selected={selected} />
          )}
          {offline.length > 0 && (
            <ContactGroup title="Не в сети" color="text-muted-foreground" users={offline} onSelect={setSelected} selected={selected} />
          )}
        </div>
      </div>

      {/* Contact detail */}
      {selected && (
        <div className="absolute inset-0 glass flex flex-col p-6 animate-slide-up z-10" style={{ borderRadius: 0 }}>
          <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-muted-foreground hover:text-white text-sm mb-6 transition-colors">
            <Icon name="ArrowLeft" size={16} /> Назад
          </button>
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-3xl grad-bg flex items-center justify-center text-4xl mx-auto mb-3 glow-purple">
              {selected.avatar}
            </div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-white">{selected.name}</h3>
              {selected.verified && <span>✅</span>}
            </div>
            <p className="text-muted-foreground text-sm">@{selected.username}</p>
            <div className="mt-2">
              <span className={`text-xs px-3 py-1 rounded-full ${selected.status === 'online' ? 'bg-emerald-500/20 text-emerald-400' : selected.status === 'away' ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-muted-foreground'}`}>
                {selected.status === 'online' ? 'Онлайн' : selected.status === 'away' ? 'Отходил' : `Был(а) ${selected.lastSeen}`}
              </span>
            </div>
          </div>
          {selected.bio && (
            <div className="glass rounded-2xl p-4 mb-4">
              <p className="text-sm text-white/80">{selected.bio}</p>
            </div>
          )}
          <button
            onClick={() => { onStartChat?.(selected.id); setSelected(null); }}
            className="w-full py-3.5 rounded-2xl grad-bg text-white font-semibold glow-purple hover:scale-[1.02] transition-all"
          >
            Написать сообщение
          </button>
        </div>
      )}
    </div>
  );
}

function ContactGroup({ title, color, users, onSelect, selected }: {
  title: string; color: string; users: User[]; onSelect: (u: User) => void; selected: User | null;
}) {
  return (
    <div className="mb-4">
      <p className={`text-xs font-semibold uppercase tracking-wider px-3 mb-2 ${color}`}>{title} · {users.length}</p>
      <div className="space-y-1">
        {users.map((user, i) => (
          <button
            key={user.id}
            onClick={() => onSelect(user)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all hover:scale-[1.01] text-left animate-fade-in ${selected?.id === user.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
            style={{ animationDelay: `${i * 0.04}s`, opacity: 0, animationFillMode: 'forwards' }}
          >
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-xl bg-white/8 flex items-center justify-center text-lg">
                {user.avatar}
              </div>
              {user.status === 'online' && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0d0d14]" />
              )}
              {user.status === 'away' && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-[#0d0d14]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-white text-sm truncate">{user.name}</span>
                {user.verified && <span className="text-[10px]">✅</span>}
              </div>
              <p className="text-xs text-muted-foreground">@{user.username}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
