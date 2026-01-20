import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, CalendarCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DayCard } from '@/components/DayCard';
import { AddTodoDialog } from '@/components/AddTodoDialog';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { useTodos } from '@/hooks/useTodos';
import type { Priority } from '@/types/todo';

function App() {
  const { groupedTodos, addTodo, toggleTodo, deleteTodo, initialized } = useTodos();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleAddClick = (date: string) => {
    setSelectedDate(date);
    setDialogOpen(true);
  };

  const handleQuickAdd = (text: string, priority: Priority = 'medium') => {
    addTodo(text, priority, format(new Date(), 'yyyy-MM-dd'));
  };

  if (!initialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">每日任务清单</h1>
            </div>
            <Button onClick={() => handleAddClick(format(new Date(), 'yyyy-MM-dd'))}>
              <Plus className="h-4 w-4 mr-1" />
              添加任务
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Quick Actions */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-800 mb-3 font-medium">快速添加今日任务：</p>
          <div className="flex flex-wrap gap-2">
            {['完成项目报告', '回复邮件', '团队会议', '整理文档'].map((text) => (
              <button
                key={text}
                onClick={() => handleQuickAdd(text)}
                className="px-3 py-1.5 text-sm bg-white rounded-full border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors"
              >
                + {text}
              </button>
            ))}
          </div>
        </div>

        {/* Todo List */}
        {groupedTodos.length === 0 ? (
          <div className="text-center py-16">
            <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">太棒了！</h3>
            <p className="text-gray-500">所有任务都已完成，没有待办事项</p>
            <Button
              className="mt-4"
              onClick={() => handleAddClick(format(new Date(), 'yyyy-MM-dd'))}
            >
              <Plus className="h-4 w-4 mr-1" />
              添加新任务
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedTodos.map((group) => (
              <DayCard
                key={group.date}
                group={group}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onAddClick={handleAddClick}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add Todo Dialog */}
      <AddTodoDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={addTodo}
        defaultDate={selectedDate}
      />

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-6 mt-8 border-t border-gray-200">
        <p className="text-center text-sm text-gray-500">
          任务会自动保存到本地 · 过期前一天会红色提醒
        </p>
      </footer>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
}

export default App;
