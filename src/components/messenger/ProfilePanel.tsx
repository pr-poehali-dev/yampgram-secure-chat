import Icon from '@/components/ui/icon';

interface ProfilePanelProps {
  user: { id: number; name: string; username: string; avatar: string };
}

const stats = [
  { label: 'Чатов', value: '4' },
  { label: 'Контактов', value: '6' },
  { label: 'Дней', value: '1' },
];

export default function ProfilePanel({ user }: ProfilePanelProps) {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Hero */}
      <div className="relative px-5 pt-10 pb-6 text-center"
        style={{ background: 'linear-gradient(180deg, rgba(155,93,229,0.15) 0%, transparent 100%)' }}>
        <div className="w-24 h-24 rounded-3xl grad-bg flex items-center justify-center text-5xl mx-auto mb-4 glow-purple animate-pulse-glow">
          {user.avatar || '👤'}
        </div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'Rubik, sans-serif' }}>{user.name}</h2>
          <span title="Верифицирован">✅</span>
        </div>
        <p className="text-muted-foreground">@{user.username}</p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 mt-5">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-xl font-bold grad-text">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="px-5 space-y-3 pb-6">
        <div className="glass rounded-2xl p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Мой аккаунт</p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl grad-bg flex items-center justify-center shrink-0">
              <Icon name="AtSign" size={15} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Username</p>
              <p className="text-sm text-white">@{user.username}</p>
            </div>
          </div>
        </div>

        {/* Verification badge */}
        <div className="glass rounded-2xl p-4" style={{ background: 'rgba(0,245,212,0.05)', borderColor: 'rgba(0,245,212,0.2)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(0,245,212,0.2)' }}>
              <Icon name="ShieldCheck" size={17} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Аккаунт верифицирован</p>
              <p className="text-xs text-muted-foreground">Ваш номер/email подтверждён</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <button className="w-full py-3 px-4 rounded-2xl flex items-center gap-3 glass hover:bg-white/8 transition-all text-left">
            <Icon name="Edit3" size={17} className="text-muted-foreground" />
            <span className="text-sm text-white">Редактировать профиль</span>
          </button>
          <button className="w-full py-3 px-4 rounded-2xl flex items-center gap-3 glass hover:bg-white/8 transition-all text-left">
            <Icon name="Star" size={17} className="text-muted-foreground" />
            <span className="text-sm text-white">Избранные сообщения</span>
          </button>
          <button className="w-full py-3 px-4 rounded-2xl flex items-center gap-3 glass hover:bg-white/8 transition-all text-left">
            <Icon name="Download" size={17} className="text-muted-foreground" />
            <span className="text-sm text-white">Экспорт данных</span>
          </button>
        </div>
      </div>
    </div>
  );
}