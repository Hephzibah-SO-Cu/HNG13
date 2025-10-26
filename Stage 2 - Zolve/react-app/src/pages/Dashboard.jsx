import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import { getTickets } from '../utils/tickets';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, open: 0, in_progress: 0, closed: 0 });

  useEffect(() => {
    try {
      const tickets = getTickets();
      setStats({
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        in_progress: tickets.filter(t => t.status === 'in_progress').length,
        closed: tickets.filter(t => t.status === 'closed').length
      });
    } catch (e) {
      toast.error('Failed to load tickets. Please retry.');
    }
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <>
      <div className="container" style={{ padding: '3rem 0', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h1>Dashboard</h1>
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          <div className="card"><h3>Total Tickets</h3><p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.total}</p></div>
          <div className="card"><h3>Open</h3><p style={{ fontSize: '2rem', color: 'var(--green)' }}>{stats.open}</p></div>
          <div className="card"><h3>In Progress</h3><p style={{ fontSize: '2rem', color: 'var(--amber)' }}>{stats.in_progress}</p></div>
          <div className="card"><h3>Closed</h3><p style={{ fontSize: '2rem', color: 'var(--gray)' }}>{stats.closed}</p></div>
        </div>

        <Link to="/tickets" style={{ display: 'inline-block' }}>
          <button className="btn btn-primary">Manage Tickets →</button>
        </Link>
        <div className="circle circle-1" style={{ top: '-50px', left: '-50px', width: '200px', height: '200px' }}></div>
        <div className="circle circle-2" style={{ bottom: '-50px', right: '-50px', width: '150px', height: '150px' }}></div>
      </div>
      <footer>© 2025 Zolve. All rights reserved.</footer>
    </>
  );
}