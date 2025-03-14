import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, checkAdminStatus } from '../firebase';
import AdminAuthModal from './AdminAuthModal';
import FeedbacksTable from './FeedbacksTable';
import './Dashboard.css';

const Dashboard = ({ isVerified }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    totalBookings: 0,
    activeBookings: 0
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsChecking(true);
      try {
        if (user) {
          const isAdmin = await checkAdminStatus(user.uid);
          if (isAdmin) {
            setIsAuthenticated(true);
            setIsAuthModalOpen(false);
            // Fetch dashboard data here
          } else {
            // Only redirect if user is not an admin
            setIsAuthenticated(false);
            setIsAuthModalOpen(true);
          }
        } else {
          // If no user, just show the admin login modal
          setIsAuthenticated(false);
          setIsAuthModalOpen(true);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAuthenticated(false);
        setIsAuthModalOpen(true);
      } finally {
        setIsChecking(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleAuthSuccess = async (user) => {
    setIsChecking(true);
    try {
      const isAdmin = await checkAdminStatus(user.uid);
      if (isAdmin) {
        setIsAuthenticated(true);
        setIsAuthModalOpen(false);
      } else {
        await auth.signOut();
        navigate('/');
      }
    } catch (error) {
      console.error('Error in auth success:', error);
      navigate('/');
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // If not verified, show a loading state
  if (!isVerified) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Verifying admin access...</p>
      </div>
    );
  }

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  // Show admin auth modal if not authenticated
  if (!isAuthenticated) {
    return (
      <AdminAuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => navigate('/')}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  return (
    <div className="dashboard">
      {/* Mobile Toggle Button */}
      <button 
        className="sidebar-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <span className="toggle-icon"></span>
      </button>

      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Admin Dashboard</h2>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            Overview
          </button>
          <button 
            className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => setActiveSection('users')}
          >
            Users List
          </button>
          <button 
            className={`nav-item ${activeSection === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveSection('bookings')}
          >
            Booking History
          </button>
          <button 
            className={`nav-item ${activeSection === 'feedbacks' ? 'active' : ''}`}
            onClick={() => setActiveSection('feedbacks')}
          >
            Feedbacks
          </button>
          <button 
            className={`nav-item ${activeSection === 'validate' ? 'active' : ''}`}
            onClick={() => setActiveSection('validate')}
          >
            Validate Ticket
          </button>
          <button 
            className={`nav-item ${activeSection === 'revenue' ? 'active' : ''}`}
            onClick={() => setActiveSection('revenue')}
          >
            Revenue
          </button>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h1>
        </header>

        <div className="dashboard-content">
          {activeSection === 'overview' && (
            <div className="overview-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p>{stats.totalUsers}</p>
              </div>
              <div className="stat-card">
                <h3>Total Revenue</h3>
                <p>₹{stats.totalRevenue}</p>
              </div>
              <div className="stat-card">
                <h3>Total Bookings</h3>
                <p>{stats.totalBookings}</p>
              </div>
              <div className="stat-card">
                <h3>Active Bookings</h3>
                <p>{stats.activeBookings}</p>
              </div>
            </div>
          )}

          {activeSection === 'feedbacks' && (
            <FeedbacksTable />
          )}

          {activeSection === 'users' && (
            <div className="users-list">
              {/* Users list component will go here */}
            </div>
          )}

          {activeSection === 'bookings' && (
            <div className="bookings-history">
              {/* Bookings history component will go here */}
            </div>
          )}

          {activeSection === 'validate' && (
            <div className="ticket-validation">
              {/* Ticket validation component will go here */}
            </div>
          )}

          {activeSection === 'revenue' && (
            <div className="revenue-analytics">
              {/* Revenue analytics component will go here */}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 