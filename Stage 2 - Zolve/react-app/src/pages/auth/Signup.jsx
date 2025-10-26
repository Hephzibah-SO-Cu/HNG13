import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup, login } from '../../utils/auth'; // Import new signup
import toast from 'react-hot-toast';

export default function Signup() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email format';
    if (!form.password.trim()) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix form errors');
      return;
    }
    const result = signup(form.email, form.password);
    if (result.success) {
      // Auto-login after signup
      login(form.email, form.password);
      toast.success('Signup successful!');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
      setErrors({ general: result.error });
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', margin: '4rem auto' }}>
      <div className="card">
        <h2>Sign Up for Zolve</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <p style={{ color: 'red', fontSize: '0.875rem' }}>{errors.email}</p>}
          <input
            type="password" placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {errors.password && <p style={{ color: 'red', fontSize: '0.875rem' }}>{errors.password}</p>}
          {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}
          <button type="submit" style={{ width: '100%', padding: '12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px' }}>
            Sign Up
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/auth/login">Already have an account? Login</Link>
        </p>
      </div>
    </div>
  );
}