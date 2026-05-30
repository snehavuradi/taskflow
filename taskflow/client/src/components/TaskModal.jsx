import { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';

const EMPTY = { title: '', desc: '', status: 'todo', priority: 'medium', tags: '', dueDate: '', progress: 0 };

export default function TaskModal({ task, defaultStatus, onClose }) {
  const { addTask, editTask } = useTasks();
  const [form, setForm]   = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!task;

  useEffect(() => {
    if (task) {
      setForm({
        title:    task.title || '',
        desc:     task.desc  || '',
        status:   task.status || 'todo',
        priority: task.priority || 'medium',
        tags:     (task.tags || []).join(', '),
        dueDate:  task.dueDate ? task.dueDate.slice(0, 10) : '',
        progress: task.progress || 0,
      });
    } else {
      setForm({ ...EMPTY, status: defaultStatus || 'todo' });
    }
  }, [task, defaultStatus]);

  const handle = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) { setError('Title is required'); return; }
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags:     form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        progress: Number(form.progress),
        dueDate:  form.dueDate || undefined,
      };
      if (isEdit) await editTask(task._id, payload);
      else        await addTask(payload);
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.backdrop} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <div style={s.header}>
          <span style={s.title}>{isEdit ? 'Edit task' : 'New task'}</span>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={submit}>
          <Field label="Title">
            <input style={s.input} name="title" value={form.title} onChange={handle} placeholder="Task title" required />
          </Field>
          <Field label="Description">
            <textarea style={{ ...s.input, minHeight: 70, resize: 'vertical' }} name="desc" value={form.desc} onChange={handle} placeholder="Optional description…" />
          </Field>

          <div style={s.row}>
            <Field label="Status">
              <select style={s.input} name="status" value={form.status} onChange={handle}>
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="review">In Review</option>
                <option value="done">Done</option>
              </select>
            </Field>
            <Field label="Priority">
              <select style={s.input} name="priority" value={form.priority} onChange={handle}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </Field>
          </div>

          <div style={s.row}>
            <Field label="Due date">
              <input style={s.input} type="date" name="dueDate" value={form.dueDate} onChange={handle} />
            </Field>
            <Field label={`Progress: ${form.progress}%`}>
              <input style={{ width: '100%', marginTop: 8 }} type="range" name="progress" min="0" max="100" step="5" value={form.progress} onChange={handle} />
            </Field>
          </div>

          <Field label="Tags (comma separated)">
            <input style={s.input} name="tags" value={form.tags} onChange={handle} placeholder="frontend, api, backend…" />
          </Field>

          <div style={s.footer}>
            <button type="button" style={s.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 13, flex: 1 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );
}

const s = {
  backdrop:  { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 },
  modal:     { background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', width: '100%', maxWidth: 460, maxHeight: '90vh', overflowY: 'auto', padding: 24 },
  header:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  title:     { fontSize: 16, fontWeight: 600 },
  closeBtn:  { background: 'none', border: 'none', fontSize: 14, color: 'var(--text-3)', cursor: 'pointer' },
  error:     { background: 'var(--red-lt)', color: 'var(--red)', borderRadius: 8, padding: '9px 12px', fontSize: 13, marginBottom: 14 },
  input:     { display: 'block', width: '100%', padding: '9px 11px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg)', fontSize: 13, outline: 'none' },
  row:       { display: 'flex', gap: 12 },
  footer:    { display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 },
  cancelBtn: { padding: '8px 16px', background: 'none', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, cursor: 'pointer', color: 'var(--text-2)' },
  submitBtn: { padding: '8px 18px', background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
};
