import { useState } from 'react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useTasks } from '../context/TaskContext';
import Column from './Column';
import TaskCard from './TaskCard';

const COLUMNS = [
  { id: 'todo',       label: 'To Do' },
  { id: 'inprogress', label: 'In Progress' },
  { id: 'review',     label: 'In Review' },
  { id: 'done',       label: 'Done' },
];

export default function Board({ onAddTask, onEditTask }) {
  const { tasks, moveTask } = useTasks();
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const tasksByCol = (colId) => tasks.filter((t) => t.status === colId);

  const handleDragStart = ({ active }) => {
    setActiveTask(tasks.find((t) => t._id === active.id) || null);
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;

    const taskId   = active.id;
    const overId   = over.id;
    const task     = tasks.find((t) => t._id === taskId);
    const overTask = tasks.find((t) => t._id === overId);
    const targetCol = COLUMNS.find((c) => c.id === overId)?.id || overTask?.status;

    if (targetCol && targetCol !== task.status) {
      await moveTask(taskId, targetCol);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div style={s.board}>
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            id={col.id}
            label={col.label}
            tasks={tasksByCol(col.id)}
            onAddTask={() => onAddTask(col.id)}
            onEditTask={onEditTask}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask && <TaskCard task={activeTask} onEdit={() => {}} />}
      </DragOverlay>
    </DndContext>
  );
}

const s = {
  board: { display: 'flex', gap: 14, padding: '18px 24px', overflowX: 'auto', alignItems: 'flex-start', flex: 1 },
};
