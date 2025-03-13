import { useState, useEffect, useRef } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "./UserMenu.css";

const UserMenu = ({ user, onFeedbackClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();

  const getInitials = (user) => {
    if (!user) return "?";
    
    if (user.displayName) {
      // Get initials from display name (first letter of each word)
      return user.displayName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    
    // Fallback to first letter of email if available
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    
    return "?";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleFeedbackClick = () => {
    setIsOpen(false);
    onFeedbackClick();
  };

  if (!user) return null;

  return (
    <div className="user-menu" ref={menuRef}>
      <button 
        className="profile-button" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {user.photoURL ? (
          <div className="profile-photo-container">
            <img 
              src={user.photoURL} 
              alt="Profile" 
              className="profile-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.querySelector('.profile-initial').style.display = 'flex';
              }}
            />
            <div className="profile-initial" style={{ display: 'none' }}>
              {getInitials(user)}
            </div>
          </div>
        ) : (
          <div className="profile-initial">
            {getInitials(user)}
          </div>
        )}
        <span className="arrow-down"></span>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="user-info">
            <div className="user-name">
              {user.displayName || (user.email ? user.email.split("@")[0] : "User")}
            </div>
            <div className="user-email">{user.email || "No email"}</div>
          </div>
          <div className="menu-divider"></div>
          <button className="menu-item" onClick={handleFeedbackClick}>
            <i className="fas fa-comment"></i>
            Give Feedback
          </button>
          <button className="menu-item" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu; 