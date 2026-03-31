import { useState } from 'react';
import Sidebar, { Section } from './Sidebar';
import ChatList from './ChatList';
import { Friend } from './ChatList';
import ChatWindow from './ChatWindow';
import ContactsPanel from './ContactsPanel';
import SearchPanel from './SearchPanel';
import NotificationsPanel from './NotificationsPanel';
import ProfilePanel from './ProfilePanel';
import SettingsPanel from './SettingsPanel';

interface MessengerAppProps {
  user: { id: number; name: string; username: string; avatar: string };
  onLogout: () => void;
}

export default function MessengerApp({ user, onLogout }: MessengerAppProps) {
  const [section, setSection] = useState<Section>('chats');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [chatRefresh, setChatRefresh] = useState(0);

  const handleStartChat = (friend: { id: number; username: string; name: string; avatar: string }) => {
    setSelectedFriend(friend);
    setSection('chats');
  };

  const handleFriendsChanged = () => setChatRefresh(n => n + 1);

  const renderLeft = () => {
    switch (section) {
      case 'chats': return (
        <ChatList
          onSelectChat={setSelectedFriend}
          selectedId={selectedFriend?.id ?? null}
          currentUserId={user.id}
          refreshTrigger={chatRefresh}
        />
      );
      case 'contacts': return <ContactsPanel onStartChat={handleStartChat} onFriendsChanged={handleFriendsChanged} />;
      case 'search': return <SearchPanel />;
      case 'notifications': return <NotificationsPanel />;
      case 'profile': return <ProfilePanel user={user} />;
      case 'settings': return <SettingsPanel onLogout={onLogout} />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: '#0d0d14' }}>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(155,93,229,0.4) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-20%] right-[10%] w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(247,37,133,0.4) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10">
        <Sidebar active={section} onChange={setSection} unreadChats={0} unreadNotifs={0}
          userName={user.name} userAvatar={user.avatar || '👤'} />
      </div>

      <div className="relative z-10 w-[300px] shrink-0 h-full overflow-hidden border-r border-white/5"
        style={{ background: 'rgba(255,255,255,0.018)' }}>
        {renderLeft()}
      </div>

      <div className="relative z-10 flex-1 h-full overflow-hidden flex flex-col">
        {section === 'chats' ? (
          <ChatWindow friend={selectedFriend} currentUserId={user.id} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 rounded-3xl grad-bg flex items-center justify-center mx-auto mb-4 glow-purple">
                <span className="text-2xl">⚡</span>
              </div>
              <p className="text-muted-foreground text-sm">Яримплиграмм</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
