export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
  bio?: string;
  verified: boolean;
}

export interface Message {
  id: string;
  fromId: string;
  text: string;
  time: string;
  read: boolean;
  reactions?: string[];
}

export interface Chat {
  id: string;
  userId: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: Message[];
}

export interface Notification {
  id: string;
  type: 'message' | 'contact' | 'mention' | 'system';
  text: string;
  from?: string;
  time: string;
  read: boolean;
}

export const DEMO_USERS: User[] = [
  { id: 'u1', name: 'Алексей Громов', username: 'alexgromov', avatar: '👨‍💻', status: 'online', bio: 'Разработчик | Люблю код и кофе ☕', verified: true },
  { id: 'u2', name: 'Марина Светлова', username: 'marina_sv', avatar: '👩‍🎨', status: 'online', bio: 'UI/UX дизайнер | Создаю красоту ✨', verified: true },
  { id: 'u3', name: 'Дмитрий Орлов', username: 'dmitry_o', avatar: '🎸', status: 'away', lastSeen: '5 мин назад', bio: 'Музыкант и предприниматель', verified: true },
  { id: 'u4', name: 'Анна Козлова', username: 'anna_k', avatar: '📸', status: 'offline', lastSeen: '2 ч назад', bio: 'Фотограф | Путешественница 🌍', verified: true },
  { id: 'u5', name: 'Иван Петров', username: 'ivanpetrov', avatar: '🚀', status: 'online', bio: 'Стартапер | Строю будущее', verified: false },
  { id: 'u6', name: 'Юлия Миронова', username: 'julia_m', avatar: '🌸', status: 'offline', lastSeen: 'вчера', bio: 'Маркетолог | SMM-специалист', verified: true },
];

export const DEMO_CHATS: Chat[] = [
  {
    id: 'c1', userId: 'u1', lastMessage: 'Привет! Как продвигается проект?', lastTime: '14:32', unread: 2,
    messages: [
      { id: 'm1', fromId: 'u1', text: 'Привет! Как дела? 👋', time: '14:28', read: true },
      { id: 'm2', fromId: 'me', text: 'Всё отлично, работаю над новым проектом!', time: '14:30', read: true },
      { id: 'm3', fromId: 'u1', text: 'Привет! Как продвигается проект?', time: '14:32', read: false },
      { id: 'm4', fromId: 'u1', text: 'Если нужна помощь — говори 🔥', time: '14:32', read: false },
    ]
  },
  {
    id: 'c2', userId: 'u2', lastMessage: 'Посмотри макеты, отправила в Figma', lastTime: '13:15', unread: 0,
    messages: [
      { id: 'm5', fromId: 'me', text: 'Марина, готов новый дизайн?', time: '13:10', read: true },
      { id: 'm6', fromId: 'u2', text: 'Да! Посмотри макеты, отправила в Figma 🎨', time: '13:15', read: true },
    ]
  },
  {
    id: 'c3', userId: 'u3', lastMessage: 'Завтра встречаемся в 18:00?', lastTime: 'вчера', unread: 1,
    messages: [
      { id: 'm7', fromId: 'u3', text: 'Завтра встречаемся в 18:00?', time: 'вчера', read: false },
    ]
  },
  {
    id: 'c4', userId: 'u4', lastMessage: 'Фотки с поездки уже готовы!', lastTime: 'вчера', unread: 0,
    messages: [
      { id: 'm8', fromId: 'u4', text: 'Фотки с поездки уже готовы! 📸', time: 'вчера', read: true },
      { id: 'm9', fromId: 'me', text: 'Отлично, жду!', time: 'вчера', read: true },
    ]
  },
];

export const DEMO_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'message', text: 'Алексей Громов написал вам', from: 'alexgromov', time: '14:32', read: false },
  { id: 'n2', type: 'contact', text: 'Иван Петров добавил вас в контакты', from: 'ivanpetrov', time: '12:00', read: false },
  { id: 'n3', type: 'mention', text: 'Марина Светлова упомянула вас', from: 'marina_sv', time: 'вчера', read: true },
  { id: 'n4', type: 'system', text: 'Ваш аккаунт успешно верифицирован ✅', time: 'вчера', read: true },
];
