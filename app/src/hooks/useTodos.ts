import { useState, useEffect, useCallback } from 'react';
import { format, isAfter, startOfDay, subDays } from 'date-fns';
import type { Todo, DayGroup, Priority } from '@/types/todo';

const STORAGE_KEY = 'daily-todo-app';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Load todos from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTodos(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load todos:', e);
      }
    }
    setInitialized(true);
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos, initialized]);

  const addTodo = useCallback((text: string, priority: Priority, dueDate: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      priority,
      dueDate,
      createdAt: format(new Date(), 'yyyy-MM-dd'),
    };
    setTodos((prev) => [...prev, newTodo]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  // Group todos by due date and filter out completed past days
  const groupedTodos = getGroupedTodos(todos);

  return {
    todos,
    groupedTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    initialized,
  };
}

function getGroupedTodos(todos: Todo[]): DayGroup[] {
  const today = startOfDay(new Date());
  const grouped: Record<string, Todo[]> = {};

  // Group by due date
  todos.forEach((todo) => {
    if (!grouped[todo.dueDate]) {
      grouped[todo.dueDate] = [];
    }
    grouped[todo.dueDate].push(todo);
  });

  // Convert to array and filter
  return Object.entries(grouped)
    .map(([date, todos]) => ({ date, todos }))
    .filter((group) => {
      const groupDate = startOfDay(new Date(group.date));
      // Keep if: today, future, or past but has uncompleted todos
      const isTodayOrFuture = !isAfter(today, groupDate);
      const hasUncompleted = group.todos.some((t) => !t.completed);
      return isTodayOrFuture || hasUncompleted;
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

// Check if a todo should be highlighted (due date is tomorrow)
export function isExpiringSoon(dueDate: string): boolean {
  const today = startOfDay(new Date());
  const due = startOfDay(new Date(dueDate));
  const tomorrow = subDays(due, 1);
  return tomorrow.getTime() === today.getTime();
}

// Get priority color
export function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
}

// Get priority label
export function getPriorityLabel(priority: Priority): string {
  switch (priority) {
    case 'high':
      return '高';
    case 'medium':
      return '中';
    case 'low':
      return '低';
    default:
      return '';
  }
}
