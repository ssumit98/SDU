import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { db } from "../firebase";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import "./AuthModal.css";
import googleIcon from "../assets/google-icon.png";

const AuthModal = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmailAuth, setShowEmailAuth] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const createOrUpdateUser = async (user, isNewUser = false) => {
    try {
      const userRef = doc(db, "users", user.uid);
      if (isNewUser) {
        // Create new user document
        await setDoc(userRef, {
          name: user.displayName || email.split('@')[0], // Use email prefix if no display name
          email: user.email,
          createdAt: serverTimestamp(),
          lastSignedIn: serverTimestamp()
        });
      } else {
        // Update last signed in time
        await updateDoc(userRef, {
          lastSignedIn: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      await createOrUpdateUser(user, true);
      console.log("Successfully signed in with Google:", user);
      onClose();
    } catch (error) {
      console.error("Google sign-in error:", error);
      setShowEmailAuth(true);
      setError("Google sign-in failed. Please try email login.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");
      
      let user;
      if (isSignUp) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        user = result.user;
        await createOrUpdateUser(user, true);
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        user = result.user;
        await createOrUpdateUser(user, false);
      }
      
      console.log("Successfully signed in with email");
      onClose();
    } catch (error) {
      console.error("Email sign-in error:", error);
      setError(
        error.code === "auth/wrong-password" || error.code === "auth/invalid-credential"
          ? "Incorrect email or password" 
          : error.code === "auth/user-not-found"
          ? "No account found with this email. Please sign up first."
          : error.code === "auth/invalid-email"
          ? "Invalid email address"
          : error.code === "auth/email-already-in-use"
          ? "This email is already registered. Please login instead."
          : error.code === "auth/weak-password"
          ? "Password should be at least 6 characters long"
          : "Authentication failed. Please try again."
      );
      
      // If it's an invalid credential error, clear the password field
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        setPassword("");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Password reset link sent! Please check your email to reset your password.");
      setIsForgotPassword(false); // Return to login form
      setPassword(""); // Clear password field
    } catch (error) {
      console.error("Password reset error:", error);
      setError(
        error.code === "auth/user-not-found"
          ? "No account found with this email"
          : error.code === "auth/invalid-email"
          ? "Invalid email address"
          : "Failed to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuthClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowEmailAuth(true);
    setError("");
    setSuccessMessage("");
  };

  const handleBackToGoogle = (e) => {
    e.preventDefault();
    setShowEmailAuth(false);
    setIsForgotPassword(false);
    setError("");
    setSuccessMessage("");
    setPassword("");
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleCloseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={handleModalClick}>
        <div className="auth-modal-content">
          <button className="close-button" onClick={handleCloseClick}>×</button>
          <h2 className="auth-title">Login to book tickets</h2>

          {!showEmailAuth && (
            <button 
              className="google-signin-button" 
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <img 
                src={googleIcon} 
                alt="Google"
                className="google-icon"
              />
              Sign in with Google
            </button>
          )}

          {(showEmailAuth || error) && (
            <>
              {!showEmailAuth && (
                <div className="separator">
                  <span>or</span>
                </div>
              )}

              <form onSubmit={isForgotPassword ? handleForgotPassword : handleEmailSignIn} className="auth-form">
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                {!isForgotPassword && (
                  <div className="form-group">
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                )}
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={loading}
                >
                  {loading 
                    ? "Please wait..." 
                    : isForgotPassword 
                    ? "Send Password Reset Link"
                    : "Login / Sign-up"}
                </button>
              </form>

              {!isForgotPassword && (
                <button 
                  type="button"
                  className="forgot-password-link"
                  onClick={() => {
                    setIsForgotPassword(true);
                    setError("");
                    setSuccessMessage("");
                  }}
                  disabled={loading}
                >
                  Forgot Password?
                </button>
              )}

              <button 
                type="button"
                className="back-to-google"
                onClick={handleBackToGoogle}
                disabled={loading}
              >
                ← Use Google Sign In
              </button>
            </>
          )}

          {!showEmailAuth && !error && (
            <button 
              type="button"
              className="email-auth-button"
              onClick={handleEmailAuthClick}
            >
              Use email instead
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 