import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

const COL_COLORS = {
  todo:       '#888780',
  inprogress: '#378ADD',
  review:     '#BA7517',
  done:       '#1D9E75',
};

export default function Column({ id, label, tasks, onAddTask, onEditTask }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div style={{ ...s.column, ...(isOver ? s.columnOver : {}) }}>
      <div style={s.header}>
        <div style={{ ...s.dot, background: COL_COLORS[id] }} />
        <span style={s.label}>{label}</span>
        <span style={s.count}>{tasks.length}</span>
        <button style={s.addBtn} onClick={onAddTask} title={`Add task to ${label}`}>+</button>
      </div>

      <div ref={setNodeRef} style={s.body}>
        <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onEdit={onEditTask} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div style={s.empty}>No tasks yet</div>
        )}
      </div>

      <button style={s.colAddBtn} onClick={onAddTask}>+ Add task</button>
    </div>
  );
}

const s = {
  column:    { width: 270, minWidth: 270, background: '#F5F5F2', borderRadius: 12, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 180px)' },
  columnOver:{ background: '#EBF8F3', borderColor: '#5DCAA5' },
  header:    { display: 'flex', alignItems: 'center', gap: 7, padding: '12px 13px 10px', borderBottom: '1px solid var(--border)' },
  dot:       { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  label:     { fontSize: 13, fontWeight: 600, flex: 1 },
  count:     { fontSize: 11, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '1px 7px', color: 'var(--text-2)' },
  addBtn:    { background: 'none', border: 'none', color: 'var(--text-3)', fontSize: 18, lineHeight: 1, cursor: 'pointer', padding: '0 2px' },
  body:      { flex: 1, overflowY: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 60 },
  empty:     { textAlign: 'center', fontSize: 12, color: 'var(--text-3)', padding: '20px 0' },
  colAddBtn: { margin: '0 10px 10px', padding: '7px', background: 'none', border: '1px dashed var(--border)', borderRadius: 8, fontSize: 12, color: 'var(--text-3)', cursor: 'pointer' },
};
