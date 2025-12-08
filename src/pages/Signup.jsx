import './pages.css';
import { Link } from 'react-router-dom';

export default function Signup() {
  return (
    <div className="page-container">
      <h1>Create Account</h1>
      <p>Create your account to start using Flow.</p>
      <form className="auth-form">
        <div className="form-group">
          <label htmlFor="name">Full name</label>
          <input id="name" type="text" placeholder="Your name" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="you@email.com" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="••••••••" />
        </div>
        <button type="submit" className="btn btn-primary">Create account</button>
        <p style={{marginTop: '12px'}}>Already have an account? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}
