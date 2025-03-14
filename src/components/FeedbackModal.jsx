import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { auth } from "../firebase";
import { signInAnonymously } from "firebase/auth";
import { createPortal } from "react-dom";
import "./FeedbackModal.css";

const FeedbackModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [previousFeedbacks, setPreviousFeedbacks] = useState([]);
  const [userData, setUserData] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle user authentication state changes
  useEffect(() => {
    const setupUserData = async () => {
      try {
        setIsInitializing(true);
        const currentUser = auth.currentUser;

        if (!currentUser) {
          // If no user is signed in, set up anonymous auth
          const userCredential = await signInAnonymously(auth);
          const user = userCredential.user;
          
          setUserData({
            uid: user.uid,
            email: "anonymous@user.com",
            displayName: "Anonymous User"
          });
        } else {
          // If user is already signed in (either anonymously or with Google)
          setUserData({
            uid: currentUser.uid,
            email: currentUser.email || "anonymous@user.com",
            displayName: currentUser.displayName || (currentUser.email ? currentUser.email.split('@')[0] : "Anonymous User")
          });
        }
        setIsInitialized(true);
      } catch (error) {
        console.error("Error setting up user data:", error);
        setError("Unable to initialize feedback system. Please try again.");
        setIsInitialized(true);
      } finally {
        setIsInitializing(false);
      }
    };

    setupUserData();
  }, [isOpen]); // Re-run when modal opens

  // Fetch previous feedbacks when user data changes or modal opens
  useEffect(() => {
    const fetchPreviousFeedbacks = async () => {
      if (!userData?.uid) return;

      try {
        const feedbacksRef = collection(db, "feedbacks");
        const q = query(feedbacksRef, where("userId", "==", userData.uid));
        const querySnapshot = await getDocs(q);
        const feedbacks = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPreviousFeedbacks(feedbacks);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    if (isOpen && userData) {
      fetchPreviousFeedbacks();
    }
  }, [isOpen, userData]);

  const handleClose = () => {
    setSuccess(false);
    onClose(false);
    // Remove feedback-modal from URL
    const url = new URL(window.location.href);
    url.searchParams.delete("feedback-modal");
    window.history.replaceState({}, "", url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback) {
      setError("Please provide your feedback");
      return;
    }

    if (!userData) {
      setError("Unable to submit feedback. Please try again.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const feedbackData = {
        name: previousFeedbacks.length > 0 ? previousFeedbacks[0].name : name,
        mobile: previousFeedbacks.length > 0 ? previousFeedbacks[0].mobile : mobile,
        feedback,
        email: userData.email,
        createdAt: new Date(),
        userId: userData.uid,
        isAnonymous: !auth.currentUser?.email // Flag to identify anonymous users
      };

      await addDoc(collection(db, "feedbacks"), feedbackData);
      setSuccess(true);
      
      // Reset form
      setFeedback("");
      
      // Refresh previous feedbacks
      const feedbacksRef = collection(db, "feedbacks");
      const q = query(feedbacksRef, where("userId", "==", userData.uid));
      const querySnapshot = await getDocs(q);
      const feedbacks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPreviousFeedbacks(feedbacks);
      
      // Close modal after success animation
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSuccess(false);
      setError("");
      setName("");
      setMobile("");
      setFeedback("");
    }
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div className="feedback-modal-overlay">
      <div className="feedback-modal">
        <button className="close-button" onClick={handleClose}>×</button>
        <h2>
          {previousFeedbacks.length > 0 
            ? `Hello ${previousFeedbacks[0].name}, welcome back!`
            : "Share Your Feedback"
          }
        </h2>
        
        {isInitializing ? (
          <div className="loading-animation">
            <div className="spinner"></div>
            <p>Initializing feedback system...</p>
          </div>
        ) : success ? (
          <div className="success-animation">
            <div className="checkmark">
              <svg className="checkmark-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
            <p>Feedback Submitted Successfully!</p>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="feedback-form">
              {previousFeedbacks.length === 0 && (
                <>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                </>
              )}
              <div className="form-group">
                <textarea
                  placeholder="Your Feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>

            {previousFeedbacks.length > 0 && (
              <div className="previous-feedbacks">
                <h3>Your Previous Feedbacks</h3>
                <div className="feedback-list">
                  {previousFeedbacks.map((fb) => (
                    <div key={fb.id} className="feedback-card">
                      <div className="feedback-header">
                        <span className="feedback-date">
                          {fb.createdAt.toDate().toLocaleDateString()}
                        </span>
                        <span className="feedback-time">
                          {fb.createdAt.toDate().toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="feedback-text">{fb.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default FeedbackModal; 