import { format, isToday, parseISO, isTomorrow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TodoItem } from './TodoItem';
import type { DayGroup } from '@/types/todo';

interface DayCardProps {
  group: DayGroup;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAddClick: (date: string) => void;
}

export function DayCard({ group, onToggle, onDelete, onAddClick }: DayCardProps) {
  const date = parseISO(group.date);
  const isTodayDate = isToday(date);
  const isTomorrowDate = isTomorrow(date);

  const getDateLabel = () => {
    if (isTodayDate) return '今天';
    if (isTomorrowDate) return '明天';
    return format(date, 'EEEE', { locale: zhCN });
  };

  const completedCount = group.todos.filter((t) => t.completed).length;
  const totalCount = group.todos.length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <h3 className="font-medium text-gray-900">
              {format(date, 'M月d日', { locale: zhCN })}
            </h3>
            <span className="text-sm text-gray-500">({getDateLabel()})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {completedCount}/{totalCount} 完成
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddClick(group.date)}
              className="h-7 px-2 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              添加
            </Button>
          </div>
        </div>
      </div>

      {/* Todo List */}
      <div className="p-3 space-y-2">
        {group.todos.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">暂无任务</p>
        ) : (
          group.todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              showDueDate={false}
            />
          ))
        )}
      </div>
    </div>
  );
}
