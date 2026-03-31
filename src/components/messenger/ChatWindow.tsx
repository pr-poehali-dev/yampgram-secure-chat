import { useState, useRef, useEffect } from 'react';
import { DEMO_CHATS, DEMO_USERS, Message } from './data';
import Icon from '@/components/ui/icon';

interface ChatWindowProps {
  chatId: string | null;
  currentUserId: string;
}

export default function ChatWindow({ chatId, currentUserId }: ChatWindowProps) {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    const init: Record<string, Message[]> = {};
    DEMO_CHATS.forEach(c => { init[c.id] = c.messages; });
    return init;
  });
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const chat = DEMO_CHATS.find(c => c.id === chatId);
  const user = chat ? DEMO_USERS.find(u => u.id === chat.userId) : null;
  const chatMessages = chatId ? (messages[chatId] || []) : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatId]);

  const sendMessage = () => {
    if (!text.trim() || !chatId) return;
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      fromId: 'me',
      text: text.trim(),
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setMessages(prev => ({ ...prev, [chatId]: [...(prev[chatId] || []), newMsg] }));
    setText('');

    // Simulate typing reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replies = ['Понял, спасибо! 👍', 'Окей!', 'Хорошо, скоро отвечу', 'Отлично! 🔥', 'Согласен!'];
      const reply: Message = {
        id: `m-${Date.now()}-r`,
        fromId: chat!.userId,
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
        read: false,
      };
      setMessages(prev => ({ ...prev, [chatId]: [...(prev[chatId] || []), reply] }));
    }, 1500 + Math.random() * 1000);
  };

  if (!chatId || !user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="text-center animate-fade-in">
          <div className="w-24 h-24 rounded-3xl grad-bg flex items-center justify-center mx-auto mb-6 glow-purple animate-pulse-glow">
            <span className="text-4xl">⚡</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Rubik, sans-serif' }}>
            Яримплиграмм
          </h2>
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
        <div className="relative">
          <div className="w-10 h-10 rounded-2xl grad-bg flex items-center justify-center text-lg">
            {user.avatar}
          </div>
          {user.status === 'online' && (
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0d0d14]"
              style={{ boxShadow: '0 0 6px rgba(52,211,153,0.8)' }} />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-white text-sm">{user.name}</span>
            {user.verified && <span className="text-[11px]">✅</span>}
          </div>
          <p className="text-xs text-muted-foreground">
            {user.status === 'online' ? (
              <span className="text-emerald-400">онлайн</span>
            ) : user.status === 'away' ? (
              <span className="text-amber-400">{user.lastSeen}</span>
            ) : (
              user.lastSeen || 'не в сети'
            )}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-9 h-9 rounded-xl hover:bg-white/8 flex items-center justify-center transition-all group">
            <Icon name="Phone" size={17} className="text-muted-foreground group-hover:text-white" />
          </button>
          <button className="w-9 h-9 rounded-xl hover:bg-white/8 flex items-center justify-center transition-all group">
            <Icon name="Video" size={17} className="text-muted-foreground group-hover:text-white" />
          </button>
          <button className="w-9 h-9 rounded-xl hover:bg-white/8 flex items-center justify-center transition-all group">
            <Icon name="MoreVertical" size={17} className="text-muted-foreground group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {chatMessages.map((msg, i) => {
          const isMe = msg.fromId === 'me';
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}
              style={{ animationDelay: `${i * 0.03}s`, opacity: 0, animationFillMode: 'forwards' }}
            >
              {!isMe && (
                <div className="w-8 h-8 rounded-xl grad-bg flex items-center justify-center text-sm mr-2 shrink-0 self-end mb-1">
                  {user.avatar}
                </div>
              )}
              <div className={`max-w-[68%] ${isMe ? 'message-bubble-out' : 'message-bubble-in'} px-4 py-2.5`}>
                <p className="text-sm text-white leading-relaxed">{msg.text}</p>
                <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-[10px] opacity-60">{msg.time}</span>
                  {isMe && (
                    <Icon name={msg.read ? 'CheckCheck' : 'Check'} size={11} className={msg.read ? 'text-cyan-400' : 'opacity-50'} />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="w-8 h-8 rounded-xl grad-bg flex items-center justify-center text-sm mr-2 shrink-0">
              {user.avatar}
            </div>
            <div className="message-bubble-in px-4 py-3 flex items-center gap-1">
              <span className="typing-dot w-2 h-2 rounded-full bg-white/60 inline-block" />
              <span className="typing-dot w-2 h-2 rounded-full bg-white/60 inline-block" />
              <span className="typing-dot w-2 h-2 rounded-full bg-white/60 inline-block" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2">
        <div className="glass rounded-2xl flex items-end gap-2 px-3 py-2 border border-white/8 focus-within:border-purple-500/40 transition-colors">
          <button className="w-8 h-8 rounded-lg hover:bg-white/8 flex items-center justify-center transition-all shrink-0">
            <Icon name="Paperclip" size={17} className="text-muted-foreground" />
          </button>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Написать сообщение..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-muted-foreground focus:outline-none resize-none py-1.5 max-h-32"
            style={{ lineHeight: '1.5' }}
          />
          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${text.trim() ? 'grad-bg glow-purple hover:scale-105' : 'bg-white/5 opacity-40'}`}
          >
            <Icon name="Send" size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
