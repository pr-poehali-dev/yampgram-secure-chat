import { useState } from 'react';
import AuthScreen from '@/components/messenger/AuthScreen';
import MessengerApp from '@/components/messenger/MessengerApp';

type AuthUser = { name: string; username: string; avatar: string; phone?: string; email?: string };

const AVATARS = ['👨‍💻', '👩‍🎨', '🎸', '🚀', '🌸', '🦊', '🐯', '🦁', '🐬', '🦋'];

export default function Index() {
  const [user, setUser] = useState<AuthUser | null>(null);

  const handleAuth = (u: AuthUser) => {
    const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
    setUser({ ...u, avatar });
  };

  const handleLogout = () => setUser(null);

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
