import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface SettingsPanelProps {
  onLogout: () => void;
}

const themeOptions = [
  { id: 'purple', label: 'Фиолетовый', color: '#9b5de5' },
  { id: 'cyan', label: 'Голубой', color: '#00f5d4' },
  { id: 'pink', label: 'Розовый', color: '#f72585' },
  { id: 'orange', label: 'Оранжевый', color: '#ff9a3c' },
];

export default function SettingsPanel({ onLogout }: SettingsPanelProps) {
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [theme, setTheme] = useState('purple');

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Rubik, sans-serif' }}>Настройки</h2>
        <p className="text-sm text-muted-foreground">Персонализируй мессенджер</p>
      </div>

      <div className="px-5 space-y-4 pb-6">
        {/* Theme */}
        <div className="glass rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Акцентный цвет</p>
          <div className="flex gap-3">
            {themeOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                className={`flex-1 flex flex-col items-center gap-2 py-2 rounded-xl transition-all hover:scale-105 ${theme === opt.id ? 'bg-white/10 ring-1 ring-white/30' : 'hover:bg-white/5'}`}
              >
                <div className="w-6 h-6 rounded-full" style={{ background: opt.color, boxShadow: theme === opt.id ? `0 0 10px ${opt.color}` : 'none' }} />
                <span className="text-[10px] text-muted-foreground">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="glass rounded-2xl p-4 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Уведомления</p>
          <ToggleRow
            icon="Bell"
            label="Push-уведомления"
            desc="Уведомления о новых сообщениях"
            value={notifications}
            onChange={setNotifications}
          />
          <ToggleRow
            icon="Volume2"
            label="Звуки"
            desc="Звук при получении сообщения"
            value={sounds}
            onChange={setSounds}
          />
        </div>

        {/* Privacy */}
        <div className="glass rounded-2xl p-4 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Приватность</p>
          <ToggleRow
            icon="Check"
            label="Уведомления о прочтении"
            desc="Отправители видят, прочитал ли ты"
            value={readReceipts}
            onChange={setReadReceipts}
          />
        </div>

        {/* Links */}
        <div className="glass rounded-2xl overflow-hidden">
          {[
            { icon: 'Shield', label: 'Конфиденциальность' },
            { icon: 'HelpCircle', label: 'Помощь и поддержка' },
            { icon: 'Info', label: 'О приложении' },
          ].map((item, i) => (
            <button key={i} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-all text-left border-b border-white/5 last:border-0">
              <Icon name={item.icon} size={17} className="text-muted-foreground" />
              <span className="text-sm text-white flex-1">{item.label}</span>
              <Icon name="ChevronRight" size={15} className="text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Version */}
        <div className="text-center py-2">
          <p className="text-xs text-muted-foreground">Яримплиграмм · v1.0.0</p>
          <p className="text-xs text-muted-foreground mt-0.5">Только реальные люди ⚡</p>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full py-3.5 rounded-2xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all font-medium text-sm flex items-center justify-center gap-2"
        >
          <Icon name="LogOut" size={16} />
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}

function ToggleRow({ icon, label, desc, value, onChange }: {
  icon: string; label: string; desc: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-white/6 flex items-center justify-center shrink-0">
        <Icon name={icon} size={16} className="text-muted-foreground" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-white">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-all ${value ? 'glow-purple' : 'bg-white/10'}`}
        style={{ background: value ? 'var(--grad-main)' : undefined }}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${value ? 'left-5.5' : 'left-0.5'}`}
          style={{ left: value ? '22px' : '2px' }} />
      </button>
    </div>
  );
}
