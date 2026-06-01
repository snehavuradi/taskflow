import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Board from '../components/Board';
import ListView from '../components/ListView';
import TaskModal from '../components/TaskModal';
import { useTasks } from '../context/TaskContext';

export default function Dashboard() {
  const [view, setView] = useState('board');
  const [modal, setModal] = useState(null);
  const { tasks } = useTasks();

  const openAdd  = (status = 'todo') => setModal({ type: 'add', status });
  const openEdit = (task)            => setModal({ type: 'edit', task });
  const closeModal = ()              => setModal(null);

  const done  = tasks.filter(t => t.status === 'done').length;
  const total = tasks.length;
  const pct   = total ? Math.round(done / total * 100) : 0;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar view={view} setView={setView} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <div style={s.topbar}>
          <div>
            <span style={s.topTitle}>MERN Dashboard</span>
            <span style={s.topSub}>Sprint 1</span>
          </div>
          <div style={s.topRight}>
            <div style={s.viewToggle}>
              <button style={{ ...s.viewBtn, ...(view === 'board' ? s.viewActive : {}) }}
                onClick={() => setView('board')}>⊞ Board</button>
              <button style={{ ...s.viewBtn, ...(view === 'list' ? s.viewActive : {}) }}
                onClick={() => setView('list')}>≡ List</button>
            </div>
            <button style={s.addBtn} onClick={() => openAdd()}>+ Add Task</button>
          </div>
        </div>

        {/* Stats */}
        <div style={s.statsRow}>
          {[
            { label: 'Total Tasks',  value: total },
            { label: 'Completed',    value: `${done} (${pct}%)` },
            { label: 'In Progress',  value: tasks.filter(t => t.status === 'inprogress').length },
            { label: 'Overdue',      value: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length },
          ].map(stat => (
            <div key={stat.label} style={s.statCard}>
              <div style={s.statLabel}>{stat.label}</div>
              <div style={s.statValue}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Board or List */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {view === 'board'
            ? <Board onAddTask={openAdd} onEditTask={openEdit} />
            : <ListView onEditTask={openEdit} />}
        </div>
      </div>

      {modal && (
        <TaskModal
          task={modal.type === 'edit' ? modal.task : null}
          defaultStatus={modal.status}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

const s = {
  topbar:     { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 54, background: 'var(--surface)', borderBottom: '1px solid var(--border)', flexShrink: 0 },
  topTitle:   { fontSize: 15, fontWeight: 600, marginRight: 12 },
  topSub:     { fontSize: 13, color: 'var(--text-3)' },
  topRight:   { display: 'flex', alignItems: 'center', gap: 10 },
  viewToggle: { display: 'flex', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' },
  viewBtn:    { padding: '6px 14px', background: 'none', border: 'none', fontSize: 13, cursor: 'pointer', color: 'var(--text-2)' },
  viewActive: { background: 'var(--green-lt)', color: 'var(--green-dk)', fontWeight: 600 },
  addBtn:     { padding: '7px 16px', background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  statsRow:   { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, padding: '16px 24px', flexShrink: 0 },
  statCard:   { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' },
  statLabel:  { fontSize: 12, color: 'var(--text-3)', marginBottom: 6 },
  statValue:  { fontSize: 22, fontWeight: 600 },
};