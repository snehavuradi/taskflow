import { useTasks } from '../context/TaskContext';

const STATUS_COLORS = {
  todo:       { dot: '#888780', label: 'To Do' },
  inprogress: { dot: '#378ADD', label: 'In Progress' },
  review:     { dot: '#BA7517', label: 'In Review' },
  done:       { dot: '#1D9E75', label: 'Done' },
};

const PRIORITY_STYLES = {
  high:   { background: 'var(--red-lt)',   color: 'var(--red)' },
  medium: { background: 'var(--amber-lt)', color: 'var(--amber)' },
  low:    { background: 'var(--green-lt)', color: 'var(--green-dk)' },
};

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' });
}

export default function ListView({ onEditTask }) {
  const { tasks, removeTask } = useTasks();

  return (
    <div style={s.wrap}>
      <table style={s.table}>
        <thead>
          <tr style={s.thead}>
            {['Task', 'Status', 'Priority', 'Due', 'Progress', ''].map((h) => (
              <th key={h} style={s.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text-3)', fontSize: 13 }}>No tasks yet. Create one!</td></tr>
          )}
          {tasks.map((task, i) => {
            const overdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
            const st = STATUS_COLORS[task.status] || STATUS_COLORS.todo;
            return (
              <tr key={task._id} style={{ ...s.tr, background: i % 2 === 1 ? '#FAFAF8' : 'var(--surface)' }}>
                <td style={{ ...s.td, fontWeight: 500, maxWidth: 220 }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</div>
                  {task.tags?.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, marginTop: 3 }}>
                      {task.tags.slice(0, 2).map((t) => (
                        <span key={t} style={{ fontSize: 10, background: 'var(--blue-lt)', color: '#185FA5', padding: '1px 6px', borderRadius: 20 }}>{t}</span>
                      ))}
                    </div>
                  )}
                </td>
                <td style={s.td}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: st.dot, display: 'inline-block' }} />
                    {st.label}
                  </span>
                </td>
                <td style={s.td}>
                  <span style={{ ...s.badge, ...PRIORITY_STYLES[task.priority] }}>{task.priority}</span>
                </td>
                <td style={{ ...s.td, color: overdue ? 'var(--red)' : 'var(--text-2)', fontSize: 12 }}>
                  {formatDate(task.dueDate)}
                </td>
                <td style={{ ...s.td, minWidth: 100 }}>
                  <div style={s.barWrap}>
                    <div style={{ ...s.barFill, width: `${task.progress}%` }} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{task.progress}%</span>
                </td>
                <td style={{ ...s.td, textAlign: 'right' }}>
                  <button style={s.actionBtn} onClick={() => onEditTask(task)}>Edit</button>
                  <button style={{ ...s.actionBtn, color: 'var(--red)' }} onClick={() => removeTask(task._id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const s = {
  wrap:    { flex: 1, overflow: 'auto', padding: '18px 24px' },
  table:   { width: '100%', borderCollapse: 'collapse', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', tableLayout: 'fixed' },
  thead:   { background: '#F5F5F2' },
  th:      { padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', borderBottom: '1px solid var(--border)' },
  tr:      { borderBottom: '1px solid var(--border)' },
  td:      { padding: '11px 14px', fontSize: 13, verticalAlign: 'middle' },
  badge:   { fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20 },
  barWrap: { height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden', marginBottom: 3 },
  barFill: { height: '100%', background: 'var(--green)', borderRadius: 2 },
  actionBtn:{ background: 'none', border: 'none', fontSize: 12, color: 'var(--text-2)', cursor: 'pointer', padding: '3px 6px' },
};
