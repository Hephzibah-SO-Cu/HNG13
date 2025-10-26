import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <>
      <div className="hero">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1>Zolve</h1>
          <h2>Support, Solved</h2>
          <p>Ditch the chaotic inbox. Zolve brings all your customer requests into one smart, streamlined helpdesk so you can deliver fast, exceptional support with ease.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/auth/login"><button className="btn btn-primary">Login</button></Link>
            <Link to="/auth/signup"><button className="btn btn-secondary">Get Started</button></Link>
          </div>
        </div>
        <img src="/shared/wave.svg" alt="Wavy background" className="wave" />
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
      </div>
      <footer>© 2025 Zolve. All rights reserved.</footer>
    </>
  );
}