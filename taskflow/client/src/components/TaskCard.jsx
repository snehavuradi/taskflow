import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTasks } from '../context/TaskContext';

const PRIORITY_STYLES = {
  high:   { background: 'var(--red-lt)',    color: 'var(--red)' },
  medium: { background: 'var(--amber-lt)',  color: 'var(--amber)' },
  low:    { background: 'var(--green-lt)',  color: 'var(--green-dk)' },
};

const TAG_COLORS = ['var(--blue-lt)', 'var(--purple-lt)', 'var(--green-lt)', 'var(--amber-lt)'];
const TAG_TEXT   = ['#185FA5', '#534AB7', '#0F6E56', '#854F0B'];

function formatDate(d) {
  if (!d) return null;
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function TaskCard({ task, onEdit }) {
  const { removeTask } = useTasks();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const overdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div ref={setNodeRef} style={{ ...s.card, ...style }} {...attributes} {...listeners}>
      <div style={s.top}>
        <span style={{ ...s.priority, ...PRIORITY_STYLES[task.priority] }}>
          {task.priority}
        </span>
        <div style={s.actions}>
          <button style={s.iconBtn} onPointerDown={(e) => e.stopPropagation()} onClick={() => onEdit(task)} title="Edit">✎</button>
          <button style={s.iconBtn} onPointerDown={(e) => e.stopPropagation()} onClick={() => removeTask(task._id)} title="Delete">✕</button>
        </div>
      </div>

      <div style={s.title}>{task.title}</div>
      {task.desc && <div style={s.desc}>{task.desc}</div>}

      {task.progress > 0 && (
        <div style={s.progressWrap}>
          <div style={{ ...s.progressBar, width: `${task.progress}%` }} />
        </div>
      )}

      {task.tags?.length > 0 && (
        <div style={s.tags}>
          {task.tags.slice(0, 3).map((tag, i) => (
            <span key={tag} style={{ ...s.tag, background: TAG_COLORS[i % 4], color: TAG_TEXT[i % 4] }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      <div style={s.footer}>
        {task.dueDate && (
          <span style={{ ...s.due, ...(overdue ? { color: 'var(--red)' } : {}) }}>
            📅 {formatDate(task.dueDate)}
          </span>
        )}
        {task.assignees?.length > 0 && (
          <div style={s.assignees}>
            {task.assignees.slice(0, 3).map((a) => (
              <div key={a._id || a} style={s.assigneeAvatar} title={a.name || a}>
                {(a.name || 'U').charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  card:        { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 13px', cursor: 'grab', userSelect: 'none' },
  top:         { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  priority:    { fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20 },
  actions:     { display: 'flex', gap: 2, opacity: 0 },
  iconBtn:     { background: 'none', border: 'none', color: 'var(--text-3)', fontSize: 14, cursor: 'pointer', padding: '2px 4px', borderRadius: 4 },
  title:       { fontSize: 13, fontWeight: 600, lineHeight: 1.4, marginBottom: 5 },
  desc:        { fontSize: 12, color: 'var(--text-2)', marginBottom: 8, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  progressWrap:{ height: 3, background: 'var(--border)', borderRadius: 2, marginBottom: 9, overflow: 'hidden' },
  progressBar: { height: '100%', background: 'var(--green)', borderRadius: 2, transition: 'width 0.3s' },
  tags:        { display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 },
  tag:         { fontSize: 11, padding: '2px 7px', borderRadius: 20 },
  footer:      { display: 'flex', alignItems: 'center' },
  due:         { fontSize: 11, color: 'var(--text-3)' },
  assignees:   { display: 'flex', marginLeft: 'auto' },
  assigneeAvatar: { width: 22, height: 22, borderRadius: '50%', background: 'var(--green-lt)', color: 'var(--green-dk)', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--surface)', marginLeft: -6 },
};

// Show action buttons on hover via CSS injection
const hoverStyle = document.createElement('style');
hoverStyle.textContent = `
  div:hover > div > div[style*="opacity: 0"] { opacity: 1 !important; }
  [style*="cursor: grab"]:hover { border-color: rgba(0,0,0,0.2) !important; }
`;
document.head.appendChild(hoverStyle);
