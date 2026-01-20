export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  dueDate: string; // YYYY-MM-DD format
  createdAt: string;
}

export interface DayGroup {
  date: string; // YYYY-MM-DD format
  todos: Todo[];
}
