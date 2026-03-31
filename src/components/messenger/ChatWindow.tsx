import { useState, useRef, useEffect, useCallback } from 'react';
import { apiMessages, apiSendMessage } from '@/api';
import { Friend } from './ChatList';
import Icon from '@/components/ui/icon';

interface RealMessage {
  id: number;
  from_id: number;
  to_id: number;
  text: string;
  time: string;
  read: boolean;
}

interface ChatWindowProps {
  friend: Friend | null;
  currentUserId: number;
}

export default function ChatWindow({ friend, currentUserId }: ChatWindowProps) {
  const [messages, setMessages] = useState<RealMessage[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(async () => {
    if (!friend) return;
    try {
      const data = await apiMessages(friend.id);
      setMessages(data.messages || []);
    } catch (e) { console.error(e); }
  }, [friend]);

  useEffect(() => {
    setMessages([]);
    loadMessages();
  }, [friend?.id, loadMessages]);

  // Poll every 3 seconds
  useEffect(() => {
    if (!friend) return;
    const t = setInterval(loadMessages, 3000);
    return () => clearInterval(t);
  }, [friend, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !friend || sending) return;
    const draft = text.trim();
    setText('');
    setSending(true);
    try {
      const data = await apiSendMessage(friend.id, draft);
      setMessages(prev => [...prev, data.message]);
    } catch (e) {
      setText(draft);
      console.error(e);
    } finally { setSending(false); }
  };

  if (!friend) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-24 h-24 rounded-3xl grad-bg flex items-center justify-center mx-auto mb-6 glow-purple animate-pulse-glow">
            <span className="text-4xl">⚡</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Rubik, sans-serif' }}>Яримплиграмм</h2>
          <p className="text-muted-foreground text-sm">Выберите чат, чтобы начать общение</p>
          <p className="text-muted-foreground text-xs mt-1">Только реальные люди, никаких ботов</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="glass border-b border-white/5 px-5 py-3.5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl grad-bg flex items-center justify-center text-lg shrink-0">{friend.avatar}</div>
        <div className="flex-1">
          <span className="font-semibold text-white text-sm block">{friend.name}</span>
          <p className="text-xs text-muted-foreground">@{friend.username}</p>
        </div>
        <button className="w-9 h-9 rounded-xl hover:bg-white/8 flex items-center justify-center transition-all group">
          <Icon name="MoreVertical" size={17} className="text-muted-foreground group-hover:text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-10 text-muted-foreground text-sm">
            <div className="text-3xl mb-2">👋</div>
            Начните переписку с {friend.name}
          </div>
        )}
        {messages.map((msg, i) => {
          const isMe = msg.from_id === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}
              style={{ animationDelay: `${Math.min(i, 10) * 0.02}s`, opacity: 0, animationFillMode: 'forwards' }}>
              {!isMe && (
                <div className="w-8 h-8 rounded-xl grad-bg flex items-center justify-center text-sm mr-2 shrink-0 self-end mb-1">
                  {friend.avatar}
                </div>
              )}
              <div className={`max-w-[68%] ${isMe ? 'message-bubble-out' : 'message-bubble-in'} px-4 py-2.5`}>
                <p className="text-sm text-white leading-relaxed">{msg.text}</p>
                <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-[10px] opacity-60">{msg.time}</span>
                  {isMe && <Icon name={msg.read ? 'CheckCheck' : 'Check'} size={11} className={msg.read ? 'text-cyan-400' : 'opacity-50'} />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2">
        <div className="glass rounded-2xl flex items-end gap-2 px-3 py-2 border border-white/8 focus-within:border-purple-500/40 transition-colors">
          <textarea value={text} onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Написать сообщение..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-muted-foreground focus:outline-none resize-none py-1.5 max-h-32"
            style={{ lineHeight: '1.5' }} />
          <button onClick={sendMessage} disabled={!text.trim() || sending}
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${text.trim() && !sending ? 'grad-bg glow-purple hover:scale-105' : 'bg-white/5 opacity-40'}`}>
            <Icon name="Send" size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
