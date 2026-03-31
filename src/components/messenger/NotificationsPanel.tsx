import { useState } from 'react';
import { DEMO_NOTIFICATIONS, Notification } from './data';
import Icon from '@/components/ui/icon';

export default function NotificationsPanel() {
  const [notifs, setNotifs] = useState<Notification[]>(DEMO_NOTIFICATIONS);

  const unread = notifs.filter(n => !n.read).length;

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));

  const iconFor = (type: Notification['type']) => {
    switch (type) {
      case 'message': return 'MessageCircle';
      case 'contact': return 'UserPlus';
      case 'mention': return 'AtSign';
      case 'system': return 'Bell';
    }
  };

  const colorFor = (type: Notification['type']) => {
    switch (type) {
      case 'message': return 'var(--grad-main)';
      case 'contact': return 'var(--grad-cool)';
      case 'mention': return 'var(--grad-hot)';
      case 'system': return 'rgba(255,255,255,0.1)';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Rubik, sans-serif' }}>Уведомления</h2>
            {unread > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                style={{ background: 'var(--grad-main)' }}>
                {unread}
              </span>
            )}
          </div>
          {unread > 0 && (
            <button onClick={markAllRead} className="text-xs text-muted-foreground hover:text-white transition-colors">
              Прочитать все
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2">
        {notifs.map((notif, i) => (
          <button
            key={notif.id}
            onClick={() => setNotifs(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n))}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all hover:scale-[1.01] text-left animate-fade-in ${notif.read ? 'hover:bg-white/5 opacity-60' : 'bg-white/5 border border-white/8'}`}
            style={{ animationDelay: `${i * 0.05}s`, opacity: notif.read ? undefined : 0, animationFillMode: 'forwards' }}
          >
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: colorFor(notif.type) }}>
              <Icon name={iconFor(notif.type)} size={17} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${notif.read ? 'text-muted-foreground' : 'text-white font-medium'}`}>
                {notif.text}
              </p>
              {notif.from && (
                <p className="text-xs text-muted-foreground mt-0.5">@{notif.from}</p>
              )}
            </div>
            <div className="shrink-0 flex flex-col items-end gap-1">
              <span className="text-xs text-muted-foreground">{notif.time}</span>
              {!notif.read && (
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--brand-pink)' }} />
              )}
            </div>
          </button>
        ))}

        {notifs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl mx-auto mb-3">🔔</div>
            <p className="text-sm text-muted-foreground">Уведомлений пока нет</p>
          </div>
        )}
      </div>
    </div>
  );
}
