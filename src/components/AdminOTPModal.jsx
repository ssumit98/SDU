import { useState } from 'react';
import { verifyAdminOTP } from '../firebase';
import './AdminOTPModal.css';

const AdminOTPModal = ({ isOpen, onClose, onSuccess, uid }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const isValid = await verifyAdminOTP(uid, otp);
      if (isValid) {
        onSuccess();
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Admin Verification</h2>
        <p>Please enter your admin OTP to continue</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-buttons">
            <button 
              type="button" 
              onClick={onClose}
              className="cancel-button"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminOTPModal; 