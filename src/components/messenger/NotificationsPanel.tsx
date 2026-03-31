import Icon from '@/components/ui/icon';

export default function NotificationsPanel() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Rubik, sans-serif' }}>Уведомления</h2>
      </div>
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl mx-auto mb-3">
            <Icon name="Bell" size={24} className="text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-white mb-1">Уведомлений пока нет</p>
          <p className="text-xs text-muted-foreground">Здесь будут появляться заявки в друзья и новые сообщения</p>
        </div>
      </div>
    </div>
  );
}
