import { useState } from 'react';
import Sidebar, { Section } from './Sidebar';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import ContactsPanel from './ContactsPanel';
import SearchPanel from './SearchPanel';
import NotificationsPanel from './NotificationsPanel';
import ProfilePanel from './ProfilePanel';
import SettingsPanel from './SettingsPanel';
import { DEMO_CHATS, DEMO_NOTIFICATIONS } from './data';

interface MessengerAppProps {
  user: { name: string; username: string; avatar: string; phone?: string; email?: string };
  onLogout: () => void;
}

export default function MessengerApp({ user, onLogout }: MessengerAppProps) {
  const [section, setSection] = useState<Section>('chats');
  const [selectedChatId, setSelectedChatId] = useState<string | null>('c1');

  const unreadChats = DEMO_CHATS.reduce((acc, c) => acc + c.unread, 0);
  const unreadNotifs = DEMO_NOTIFICATIONS.filter(n => !n.read).length;

  const handleStartChat = (userId: string) => {
    const chat = DEMO_CHATS.find(c => c.userId === userId);
    if (chat) {
      setSelectedChatId(chat.id);
      setSection('chats');
    }
  };

  const renderLeft = () => {
    switch (section) {
      case 'chats': return (
        <ChatList
          onSelectChat={setSelectedChatId}
          selectedChatId={selectedChatId}
          currentUserId="me"
        />
      );
      case 'contacts': return <ContactsPanel onStartChat={handleStartChat} />;
      case 'search': return <SearchPanel />;
      case 'notifications': return <NotificationsPanel />;
      case 'profile': return <ProfilePanel user={user} />;
      case 'settings': return <SettingsPanel onLogout={onLogout} />;
    }
  };

  const showChat = section === 'chats';

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: '#0d0d14' }}>
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(155,93,229,0.4) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-20%] right-[10%] w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(247,37,133,0.4) 0%, transparent 70%)' }} />
      </div>

      {/* Sidebar nav */}
      <div className="relative z-10">
        <Sidebar
          active={section}
          onChange={setSection}
          unreadChats={unreadChats}
          unreadNotifs={unreadNotifs}
          userName={user.name}
          userAvatar={user.avatar || '👤'}
        />
      </div>

      {/* Left panel */}
      <div className="relative z-10 w-[300px] shrink-0 h-full overflow-hidden border-r border-white/5"
        style={{ background: 'rgba(255,255,255,0.018)' }}>
        {renderLeft()}
      </div>

      {/* Main area */}
      <div className="relative z-10 flex-1 h-full overflow-hidden flex flex-col">
        {showChat ? (
          <ChatWindow chatId={selectedChatId} currentUserId="me" />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 rounded-3xl grad-bg flex items-center justify-center mx-auto mb-4 glow-purple">
                <span className="text-2xl">⚡</span>
              </div>
              <p className="text-muted-foreground text-sm">Выбери раздел в боковой панели</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
