import { useState } from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Priority } from '@/types/todo';

interface AddTodoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (text: string, priority: Priority, dueDate: string) => void;
  defaultDate?: string;
}

export function AddTodoDialog({
  isOpen,
  onClose,
  onAdd,
  defaultDate,
}: AddTodoDialogProps) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState(defaultDate || format(new Date(), 'yyyy-MM-dd'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text, priority, dueDate);
    setText('');
    setPriority('medium');
    onClose();
  };

  const handleClose = () => {
    setText('');
    setPriority('medium');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>添加新任务</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="todo-text">任务内容</Label>
            <Textarea
              id="todo-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="输入任务内容..."
              className="min-h-[80px]"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">优先级</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择优先级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2" />
                    低
                  </SelectItem>
                  <SelectItem value="medium">
                    <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                    中
                  </SelectItem>
                  <SelectItem value="high">
                    <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2" />
                    高
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="due-date">截止日期</Label>
              <Input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={handleClose}>
              取消
            </Button>
            <Button type="submit" disabled={!text.trim()}>
              添加
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
