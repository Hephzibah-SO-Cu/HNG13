import { useState, useEffect } from 'react';
import { getTickets, saveTickets, validateTicket } from '../utils/tickets';
import toast from 'react-hot-toast';

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', status: 'open', priority: 'medium' });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    try {
      setTickets(getTickets());
    } catch (e) {
      toast.error('Failed to load tickets. Please retry.');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateTicket(form);
    if (!isValid) {
      setErrors(validationErrors);
      toast.error('Please fix form errors');
      return;
    }
    if (form.description.length > 500) {
      setErrors({ description: 'Description too long (max 500 chars)' });
      toast.error('Please fix form errors');
      return;
    }

    let updated;
    if (editingId) {
      updated = tickets.map(t => t.id === editingId ? { ...t, ...form } : t);
      toast.success('Ticket updated!');
    } else {
      updated = [...tickets, { ...form, id: Date.now() }];
      toast.success('Ticket created!');
    }
    setTickets(updated);
    saveTickets(updated);
    resetForm();
  };

  const resetForm = () => {
    setForm({ title: '', description: '', status: 'open', priority: 'medium' });
    setEditingId(null);
    setErrors({});
  };

  const handleEdit = (ticket) => {
    setForm(ticket);
    setEditingId(ticket.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this ticket?')) {
      const updated = tickets.filter(t => t.id !== id);
      setTickets(updated);
      saveTickets(updated);
      toast.success('Ticket deleted');
    }
  };

  const capitalize = (str) => str.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase());

  return (
    <>
      <div className="container" style={{ padding: '3rem 0', position: 'relative' }}>
        <h1 style={{ marginBottom: '3rem' }}>Ticket Management</h1> {/* Added margin */}

        <div className="card" style={{ margin: '3rem 0' }}>
          <h2>{editingId ? 'Edit' : 'Create'} Ticket</h2>
          <form onSubmit={handleSubmit}>
            <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            {errors.title && <p style={{ color: 'red', fontSize: '0.875rem' }}>{errors.title}</p>}
            <textarea placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            {errors.description && <p style={{ color: 'red', fontSize: '0.875rem' }}>{errors.description}</p>}
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
            {errors.status && <p style={{ color: 'red', fontSize: '0.875rem' }}>{errors.status}</p>}
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}> {/* More top margin */}
              <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Create'}</button>
              {editingId && <button type="button" onClick={resetForm} className="btn btn-secondary">Cancel</button>}
            </div>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {tickets.map(ticket => (
            <div key={ticket.id} className="card ticket-card">
              <div>
                <h3>{ticket.title}</h3>
                <p>{ticket.description}</p>
                <span className={`status status-${ticket.status}`}>{capitalize(ticket.status)}</span>
                <span className={`priority priority-${ticket.priority}`} style={{ marginLeft: '1rem' }}>{capitalize(ticket.priority)}</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => handleEdit(ticket)} className="btn btn-secondary">Edit</button>
                <button onClick={() => handleDelete(ticket.id)} className="btn btn-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
        <div className="circle circle-1" style={{ top: 'auto', bottom: '-100px', left: '-50px', width: '200px', height: '200px' }}></div>
        <div className="circle circle-2" style={{ top: '50%', right: '-50px', width: '150px', height: '150px' }}></div>
      </div>
      <footer>© 2025 Zolve. All rights reserved.</footer>
    </>
  );
}