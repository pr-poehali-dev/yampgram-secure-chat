import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface AuthScreenProps {
  onAuth: (user: { name: string; username: string; avatar: string; phone?: string; email?: string }) => void;
}

type Step = 'start' | 'method' | 'phone' | 'email' | 'verify' | 'profile';

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [step, setStep] = useState<Step>('start');
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [codeError, setCodeError] = useState(false);

  const handleSendCode = () => {
    if (method === 'phone' && phone.length < 10) return;
    if (method === 'email' && !email.includes('@')) return;
    setStep('verify');
  };

  const handleVerify = () => {
    if (code.length !== 6) { setCodeError(true); return; }
    setCodeError(false);
    setStep('profile');
  };

  const handleFinish = () => {
    if (!name.trim() || !username.trim()) return;
    onAuth({
      name: name.trim(),
      username: username.trim().toLowerCase().replace(/\s/g, ''),
      avatar: '',
      phone: method === 'phone' ? phone : undefined,
      email: method === 'email' ? email : undefined,
    });
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ background: '#0d0d14' }}>
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full animate-float"
          style={{ background: 'radial-gradient(circle, rgba(155,93,229,0.25) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full animate-float"
          style={{ background: 'radial-gradient(circle, rgba(247,37,133,0.2) 0%, transparent 70%)', animationDelay: '2s' }} />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full animate-float"
          style={{ background: 'radial-gradient(circle, rgba(0,245,212,0.1) 0%, transparent 70%)', animationDelay: '4s' }} />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 w-full max-w-sm mx-auto px-6">
        {/* Logo */}
        <div className="text-center mb-10 animate-fade-in">
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

          {step === 'start' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-6">Добро пожаловать!</h2>
              <button onClick={() => setStep('method')}
                className="w-full py-4 rounded-2xl grad-bg text-white font-semibold text-base glow-purple transition-all hover:scale-[1.02] active:scale-[0.98]">
                Создать аккаунт
              </button>
              <button onClick={() => setStep('method')}
                className="w-full py-4 rounded-2xl glass-hover border border-white/10 text-white font-medium text-base transition-all hover:scale-[1.02]">
                Войти
              </button>
              <p className="text-center text-xs text-muted-foreground mt-4">
                Мы верифицируем каждого пользователя —<br />никаких ботов и фейковых аккаунтов
              </p>
            </div>
          )}

          {step === 'method' && (
            <div className="space-y-4">
              <button onClick={() => setStep('start')} className="text-muted-foreground hover:text-white mb-2 flex items-center gap-1 text-sm transition-colors">
                <Icon name="ArrowLeft" size={14} /> Назад
              </button>
              <h2 className="text-xl font-bold text-white mb-2">Как подтвердить аккаунт?</h2>
              <p className="text-sm text-muted-foreground mb-4">Выберите способ верификации</p>
              <button onClick={() => { setMethod('phone'); setStep('phone'); }}
                className="w-full py-4 px-5 rounded-2xl flex items-center gap-4 glass border border-white/10 hover:border-purple-500/50 transition-all hover:scale-[1.01] text-left group">
                <div className="w-10 h-10 rounded-xl grad-bg flex items-center justify-center shrink-0">
                  <Icon name="Smartphone" size={18} />
                </div>
                <div>
                  <div className="font-semibold text-white">Номер телефона</div>
                  <div className="text-xs text-muted-foreground">SMS с кодом подтверждения</div>
                </div>
              </button>
              <button onClick={() => { setMethod('email'); setStep('email'); }}
                className="w-full py-4 px-5 rounded-2xl flex items-center gap-4 glass border border-white/10 hover:border-cyan-500/50 transition-all hover:scale-[1.01] text-left group">
                <div className="w-10 h-10 rounded-xl grad-bg-cool flex items-center justify-center shrink-0">
                  <Icon name="Mail" size={18} />
                </div>
                <div>
                  <div className="font-semibold text-white">Email</div>
                  <div className="text-xs text-muted-foreground">Письмо с кодом подтверждения</div>
                </div>
              </button>
            </div>
          )}

          {step === 'phone' && (
            <div className="space-y-4">
              <button onClick={() => setStep('method')} className="text-muted-foreground hover:text-white mb-2 flex items-center gap-1 text-sm transition-colors">
                <Icon name="ArrowLeft" size={14} /> Назад
              </button>
              <h2 className="text-xl font-bold text-white">Введите номер</h2>
              <p className="text-sm text-muted-foreground">Отправим SMS с кодом</p>
              <div className="relative mt-4">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Icon name="Phone" size={16} />
                </div>
                <input
                  type="tel"
                  placeholder="+7 (999) 000-00-00"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/70 transition-colors"
                />
              </div>
              <button onClick={handleSendCode}
                className="w-full py-4 rounded-2xl grad-bg text-white font-semibold glow-purple transition-all hover:scale-[1.02] active:scale-[0.98] mt-2">
                Получить код
              </button>
            </div>
          )}

          {step === 'email' && (
            <div className="space-y-4">
              <button onClick={() => setStep('method')} className="text-muted-foreground hover:text-white mb-2 flex items-center gap-1 text-sm transition-colors">
                <Icon name="ArrowLeft" size={14} /> Назад
              </button>
              <h2 className="text-xl font-bold text-white">Введите email</h2>
              <p className="text-sm text-muted-foreground">Отправим письмо с кодом</p>
              <div className="relative mt-4">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Icon name="Mail" size={16} />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/70 transition-colors"
                />
              </div>
              <button onClick={handleSendCode}
                className="w-full py-4 rounded-2xl grad-bg-cool text-white font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] mt-2">
                Получить код
              </button>
            </div>
          )}

          {step === 'verify' && (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl grad-bg flex items-center justify-center mb-2">
                <Icon name="ShieldCheck" size={22} />
              </div>
              <h2 className="text-xl font-bold text-white">Введите код</h2>
              <p className="text-sm text-muted-foreground">
                Код отправлен на {method === 'phone' ? phone : email}
              </p>
              <input
                type="text"
                placeholder="000000"
                maxLength={6}
                value={code}
                onChange={e => { setCode(e.target.value.replace(/\D/g, '')); setCodeError(false); }}
                className={`w-full bg-white/5 border rounded-xl py-3.5 px-4 text-white text-center text-2xl tracking-[0.5em] font-bold placeholder:text-muted-foreground focus:outline-none transition-colors ${codeError ? 'border-red-500' : 'border-white/10 focus:border-purple-500/70'}`}
              />
              {codeError && <p className="text-red-400 text-sm">Неверный код. Попробуйте ещё раз</p>}
              <button onClick={handleVerify}
                className="w-full py-4 rounded-2xl grad-bg text-white font-semibold glow-purple transition-all hover:scale-[1.02] active:scale-[0.98]">
                Подтвердить
              </button>
              <button className="text-muted-foreground hover:text-white text-sm transition-colors w-full text-center">
                Отправить код повторно
              </button>
            </div>
          )}

          {step === 'profile' && (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2" style={{ background: 'var(--grad-cool)' }}>
                <Icon name="User" size={22} />
              </div>
              <h2 className="text-xl font-bold text-white">Создай профиль</h2>
              <p className="text-sm text-muted-foreground">Как тебя будут знать другие пользователи</p>
              <input
                type="text"
                placeholder="Твоё имя"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/70 transition-colors"
              />
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                <input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={e => setUsername(e.target.value.replace(/\s/g, '').toLowerCase())}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-8 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/70 transition-colors"
                />
              </div>
              <button onClick={handleFinish}
                className="w-full py-4 rounded-2xl grad-bg text-white font-semibold glow-purple transition-all hover:scale-[1.02] active:scale-[0.98] mt-2">
                Войти в Яримплиграмм ⚡
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
