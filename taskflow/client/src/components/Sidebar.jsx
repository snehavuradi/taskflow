import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';

const NAV = [
  { icon: '⊞', label: 'Board' },
  { icon: '≡', label: 'List' },
];

export default function Sidebar({ view, setView }) {
  const { user, logout } = useAuth();
  const { tasks }        = useTasks();

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const todoCount = tasks.filter((t) => t.status === 'todo').length;

  return (
    <aside style={s.sidebar}>
      <div style={s.logo}>
        <span style={s.dot} />
        <span style={{ fontWeight: 600, fontSize: 15 }}>TaskFlow</span>
      </div>

      <nav style={s.nav}>
        <div style={s.navLabel}>Menu</div>
        {NAV.map((n) => (
          <button key={n.label} style={{ ...s.navItem, ...(view === n.label.toLowerCase() ? s.navActive : {}) }}
            onClick={() => setView(n.label.toLowerCase())}>
            <span style={s.navIcon}>{n.icon}</span>
            {n.label}
            {n.label === 'Board' && todoCount > 0 &&
              <span style={s.badge}>{todoCount}</span>}
          </button>
        ))}
      </nav>

      <div style={s.stats}>
        <div style={s.statsLabel}>This sprint</div>
        {[
          { label: 'Total', val: tasks.length },
          { label: 'Done',  val: tasks.filter((t) => t.status === 'done').length },
          { label: 'Overdue', val: tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length },
        ].map((s2) => (
          <div key={s2.label} style={s.statRow}>
            <span style={{ color: 'var(--text-2)', fontSize: 12 }}>{s2.label}</span>
            <span style={{ fontWeight: 600, fontSize: 13 }}>{s2.val}</span>
          </div>
        ))}
      </div>

      <div style={s.bottom}>
        <div style={s.avatar}>{initials}</div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{user?.email}</div>
        </div>
        <button onClick={logout} style={s.logoutBtn} title="Sign out">↩</button>
      </div>
    </aside>
  );
}

const s = {
  sidebar:   { width: 220, minWidth: 220, background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', height: '100vh' },
  logo:      { display: 'flex', alignItems: 'center', gap: 8, padding: '20px 18px 16px', borderBottom: '1px solid var(--border)' },
  dot:       { width: 10, height: 10, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' },
  nav:       { padding: '16px 10px 0' },
  navLabel:  { fontSize: 10, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--text-3)', padding: '0 8px', marginBottom: 4 },
  navItem:   { display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '7px 10px', borderRadius: 8, border: 'none', background: 'none', color: 'var(--text-2)', fontSize: 13, textAlign: 'left', cursor: 'pointer' },
  navActive: { background: 'var(--green-lt)', color: 'var(--green-dk)', fontWeight: 600 },
  navIcon:   { fontSize: 16, width: 18, textAlign: 'center' },
  badge:     { marginLeft: 'auto', background: 'var(--green)', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 20, padding: '1px 6px' },
  stats:     { margin: '16px 10px 0', padding: '14px', background: 'var(--bg)', borderRadius: 10 },
  statsLabel:{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-3)', marginBottom: 10 },
  statRow:   { display: 'flex', justifyContent: 'space-between', padding: '4px 0' },
  bottom:    { marginTop: 'auto', padding: '14px 12px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 },
  avatar:    { width: 32, height: 32, borderRadius: '50%', background: 'var(--green-lt)', color: 'var(--green-dk)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 },
  logoutBtn: { background: 'none', border: 'none', color: 'var(--text-3)', fontSize: 16, cursor: 'pointer', padding: 4 },
};
