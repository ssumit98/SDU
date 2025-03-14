import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, checkAdminStatus } from '../firebase';
import './AdminAuthModal.css';

const AdminAuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if user is admin using Firestore
      const isAdmin = await checkAdminStatus(user.uid);
      
      if (isAdmin) {
        onAuthSuccess(user);
      } else {
        await auth.signOut();
        setError('Unauthorized access. Admin privileges required.');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-auth-overlay">
      <div className="admin-auth-modal">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Admin Login</h2>
        
        <form onSubmit={handleSubmit} className="admin-auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAuthModal; 