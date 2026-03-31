import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface AuthScreenProps {
  onAuth: (user: { name: string; username: string; avatar: string }) => void;
}

type Mode = 'start' | 'register' | 'login';

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [mode, setMode] = useState<Mode>('start');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [regError, setRegError] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);

  // Login fields
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);

  const handleRegister = () => {
    if (!regName.trim()) { setRegError('Введите имя'); return; }
    if (!regUsername.trim()) { setRegError('Введите username'); return; }
    if (regPassword.length < 6) { setRegError('Пароль минимум 6 символов'); return; }
    if (regPassword !== regPasswordConfirm) { setRegError('Пароли не совпадают'); return; }
    setRegError('');
    onAuth({ name: regName.trim(), username: regUsername.trim().toLowerCase().replace(/\s/g, ''), avatar: '' });
  };

  const handleLogin = () => {
    if (!loginUsername.trim()) { setLoginError('Введите username'); return; }
    if (!loginPassword) { setLoginError('Введите пароль'); return; }
    setLoginError('');
    onAuth({ name: loginUsername.trim(), username: loginUsername.trim().toLowerCase(), avatar: '' });
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/70 transition-colors";

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ background: '#0d0d14' }}>
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full animate-float"
          style={{ background: 'radial-gradient(circle, rgba(155,93,229,0.25) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full animate-float"
          style={{ background: 'radial-gradient(circle, rgba(247,37,133,0.2) 0%, transparent 70%)', animationDelay: '2s' }} />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full animate-float"
          style={{ background: 'radial-gradient(circle, rgba(0,245,212,0.1) 0%, transparent 70%)', animationDelay: '4s' }} />
      </div>
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 w-full max-w-sm mx-auto px-6">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl grad-bg mb-4 glow-purple animate-pulse-glow mx-auto">
            <span className="text-3xl">⚡</span>
          </div>
          <h1 className="text-4xl font-black grad-text tracking-tight" style={{ fontFamily: 'Rubik, sans-serif' }}>
            Яримпли<span className="text-white">грамм</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">Общайся только с реальными людьми</p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>

          {/* START */}
          {mode === 'start' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-6">Добро пожаловать!</h2>
              <button onClick={() => setMode('register')}
                className="w-full py-4 rounded-2xl grad-bg text-white font-semibold text-base glow-purple transition-all hover:scale-[1.02] active:scale-[0.98]">
                Создать аккаунт
              </button>
              <button onClick={() => setMode('login')}
                className="w-full py-4 rounded-2xl border border-white/10 text-white font-medium text-base transition-all hover:bg-white/5 hover:scale-[1.02]">
                Войти
              </button>
              <p className="text-center text-xs text-muted-foreground mt-2">
                Никаких ботов и фейковых аккаунтов
              </p>
            </div>
          )}

          {/* REGISTER */}
          {mode === 'register' && (
            <div className="space-y-3">
              <button onClick={() => setMode('start')} className="text-muted-foreground hover:text-white flex items-center gap-1 text-sm transition-colors mb-1">
                <Icon name="ArrowLeft" size={14} /> Назад
              </button>
              <h2 className="text-xl font-bold text-white">Создать аккаунт</h2>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Icon name="User" size={15} />
                </div>
                <input
                  type="text"
                  placeholder="Ваше имя"
                  value={regName}
                  onChange={e => { setRegName(e.target.value); setRegError(''); }}
                  className={`${inputClass} pl-10`}
                />
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                <input
                  type="text"
                  placeholder="username"
                  value={regUsername}
                  onChange={e => { setRegUsername(e.target.value.replace(/\s/g, '').toLowerCase()); setRegError(''); }}
                  className={`${inputClass} pl-8`}
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Icon name="Lock" size={15} />
                </div>
                <input
                  type={showRegPass ? 'text' : 'password'}
                  placeholder="Пароль (мин. 6 символов)"
                  value={regPassword}
                  onChange={e => { setRegPassword(e.target.value); setRegError(''); }}
                  className={`${inputClass} pl-10 pr-10`}
                />
                <button onClick={() => setShowRegPass(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors">
                  <Icon name={showRegPass ? 'EyeOff' : 'Eye'} size={15} />
                </button>
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Icon name="Lock" size={15} />
                </div>
                <input
                  type={showRegPass ? 'text' : 'password'}
                  placeholder="Повторите пароль"
                  value={regPasswordConfirm}
                  onChange={e => { setRegPasswordConfirm(e.target.value); setRegError(''); }}
                  className={`${inputClass} pl-10`}
                />
              </div>

              {regError && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 rounded-xl px-3 py-2">
                  <Icon name="AlertCircle" size={14} />
                  {regError}
                </div>
              )}

              <button onClick={handleRegister}
                className="w-full py-4 rounded-2xl grad-bg text-white font-semibold glow-purple transition-all hover:scale-[1.02] active:scale-[0.98] mt-1">
                Зарегистрироваться ⚡
              </button>

              <p className="text-center text-xs text-muted-foreground">
                Уже есть аккаунт?{' '}
                <button onClick={() => setMode('login')} className="text-purple-400 hover:text-purple-300 transition-colors">
                  Войти
                </button>
              </p>
            </div>
          )}

          {/* LOGIN */}
          {mode === 'login' && (
            <div className="space-y-3">
              <button onClick={() => setMode('start')} className="text-muted-foreground hover:text-white flex items-center gap-1 text-sm transition-colors mb-1">
                <Icon name="ArrowLeft" size={14} /> Назад
              </button>
              <h2 className="text-xl font-bold text-white">Войти</h2>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                <input
                  type="text"
                  placeholder="username"
                  value={loginUsername}
                  onChange={e => { setLoginUsername(e.target.value.replace(/\s/g, '').toLowerCase()); setLoginError(''); }}
                  className={`${inputClass} pl-8`}
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Icon name="Lock" size={15} />
                </div>
                <input
                  type={showLoginPass ? 'text' : 'password'}
                  placeholder="Пароль"
                  value={loginPassword}
                  onChange={e => { setLoginPassword(e.target.value); setLoginError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  className={`${inputClass} pl-10 pr-10`}
                />
                <button onClick={() => setShowLoginPass(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors">
                  <Icon name={showLoginPass ? 'EyeOff' : 'Eye'} size={15} />
                </button>
              </div>

              <div className="text-right">
                <button className="text-xs text-muted-foreground hover:text-purple-400 transition-colors">
                  Забыли пароль?
                </button>
              </div>

              {loginError && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 rounded-xl px-3 py-2">
                  <Icon name="AlertCircle" size={14} />
                  {loginError}
                </div>
              )}

              <button onClick={handleLogin}
                className="w-full py-4 rounded-2xl grad-bg text-white font-semibold glow-purple transition-all hover:scale-[1.02] active:scale-[0.98]">
                Войти
              </button>

              <p className="text-center text-xs text-muted-foreground">
                Нет аккаунта?{' '}
                <button onClick={() => setMode('register')} className="text-purple-400 hover:text-purple-300 transition-colors">
                  Создать
                </button>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
