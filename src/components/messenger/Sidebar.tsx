import Icon from '@/components/ui/icon';

export type Section = 'chats' | 'contacts' | 'search' | 'notifications' | 'profile' | 'settings';

interface SidebarProps {
  active: Section;
  onChange: (s: Section) => void;
  unreadChats: number;
  unreadNotifs: number;
  userName: string;
  userAvatar: string;
}

const navItems: { id: Section; icon: string; label: string }[] = [
  { id: 'chats', icon: 'MessageCircle', label: 'Чаты' },
  { id: 'contacts', icon: 'Users', label: 'Контакты' },
  { id: 'search', icon: 'Search', label: 'Поиск' },
  { id: 'notifications', icon: 'Bell', label: 'Уведомления' },
];

export default function Sidebar({ active, onChange, unreadChats, unreadNotifs, userName, userAvatar }: SidebarProps) {
  return (
    <div className="glass flex flex-col items-center py-5 px-2 h-full border-r border-white/5 w-[72px] shrink-0">
      {/* Logo */}
      <button onClick={() => onChange('chats')} className="w-10 h-10 rounded-2xl grad-bg flex items-center justify-center mb-6 glow-purple transition-all hover:scale-105">
        <span className="text-lg">⚡</span>
      </button>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(item => {
          const isActive = active === item.id;
          const badge = item.id === 'chats' ? unreadChats : item.id === 'notifications' ? unreadNotifs : 0;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              title={item.label}
              className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-105 group ${isActive ? 'nav-icon-active' : 'hover:bg-white/8'}`}
            >
              <Icon name={item.icon} size={20} className={isActive ? 'text-white' : 'text-muted-foreground group-hover:text-white'} />
              {badge > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                  style={{ background: 'var(--brand-pink)' }}>
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => onChange('settings')}
          title="Настройки"
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-105 ${active === 'settings' ? 'nav-icon-active' : 'hover:bg-white/8'}`}
        >
          <Icon name="Settings" size={20} className={active === 'settings' ? 'text-white' : 'text-muted-foreground'} />
        </button>
        <button
          onClick={() => onChange('profile')}
          title={userName}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all hover:scale-105 ${active === 'profile' ? 'ring-2 ring-purple-500' : ''}`}
          style={{ background: active === 'profile' ? 'var(--grad-main)' : 'rgba(255,255,255,0.06)' }}
        >
          {userAvatar || '👤'}
        </button>
      </div>
    </div>
  );
}