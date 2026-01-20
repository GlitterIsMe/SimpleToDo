import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { Todo } from '@/types/todo';
import { isExpiringSoon, getPriorityColor, getPriorityLabel } from '@/hooks/useTodos';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  showDueDate?: boolean;
}

export function TodoItem({ todo, onToggle, onDelete, showDueDate = false }: TodoItemProps) {
  const isExpiring = isExpiringSoon(todo.dueDate);
  const isOverdue = !todo.completed && new Date(todo.dueDate) < new Date();
  
  return (
    <div
      className={`group flex items-center gap-3 p-3 rounded-lg border transition-all ${
        todo.completed
          ? 'bg-gray-50 border-gray-200 opacity-70'
          : isExpiring || isOverdue
          ? 'bg-red-50 border-red-200'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className={`${
          todo.completed ? 'data-[state=checked]:bg-gray-400' : ''
        } ${isExpiring || isOverdue ? 'data-[state=unchecked]:border-red-400' : ''}`}
      />
      
      <span
        className={`flex-1 text-sm ${
          todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
        }`}
      >
        {todo.text}
      </span>

      {/* Priority Badge */}
      <div className="flex items-center gap-1">
        <span
          className={`inline-block w-2 h-2 rounded-full ${getPriorityColor(todo.priority)}`}
          title={`优先级: ${getPriorityLabel(todo.priority)}`}
        />
      </div>

      {/* Due Date */}
      {showDueDate && (
        <span
          className={`text-xs whitespace-nowrap ${
            isExpiring || isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'
          }`}
        >
          {format(parseISO(todo.dueDate), 'M月d日', { locale: zhCN })}
        </span>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
      >
        <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
      </Button>
    </div>
  );
}
