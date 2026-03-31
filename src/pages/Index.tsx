import { useState, useEffect } from 'react';
import AuthScreen from '@/components/messenger/AuthScreen';
import MessengerApp from '@/components/messenger/MessengerApp';
import { apiGetMe } from '@/api';

type AuthUser = { id: number; name: string; username: string; avatar: string };

export default function Index() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);

  // Auto-login if token saved
  useEffect(() => {
    const token = localStorage.getItem('yamp_token');
    if (!token) { setChecking(false); return; }
    apiGetMe()
      .then(data => setUser(data.user))
      .catch(() => localStorage.removeItem('yamp_token'))
      .finally(() => setChecking(false));
  }, []);

  const handleAuth = (u: AuthUser) => setUser(u);

  const handleLogout = () => {
    localStorage.removeItem('yamp_token');
    setUser(null);
  };

  if (checking) {
    return (
      <div className="w-screen h-screen flex items-center justify-center" style={{ background: '#0d0d14' }}>
        <div className="w-16 h-16 rounded-3xl grad-bg flex items-center justify-center glow-purple animate-pulse-glow">
          <span className="text-2xl">⚡</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden">
      {user ? (
        <MessengerApp user={user} onLogout={handleLogout} />
      ) : (
        <AuthScreen onAuth={handleAuth} />
      )}
    </div>
  );
}
