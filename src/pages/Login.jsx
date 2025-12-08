import './pages.css';
import { Link } from 'react-router-dom';

export default function Signup() {
  return (
    <div className="page-container">
      <h1>Log In</h1>
      <p>Welcome back to Flow.</p>
      <form className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="you@email.com" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="••••••••" />
        </div>
        <button type="submit" className="btn btn-primary">Create account</button>
        <p style={{marginTop: '12px'}}>Don't have a Account? <Link to="/signup">Sign <i class="fa fa-upload" aria-hidden="true"></i></Link></p>
      </form>
    </div>
  );
}
