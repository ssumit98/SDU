"use client"

import { useState, useEffect, useRef } from "react"
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "../firebase"
import AuthModal from "./AuthModal"
import UserMenu from "./UserMenu"
import BookingModal from "./BookingModal"
import "./Navbar.css"
import { Link } from "react-router-dom"

const Navbar = ({ user, isScrolled, onFeedbackClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isBookingFlow, setIsBookingFlow] = useState(false)
  const menuRef = useRef(null)
  const isMobileRef = useRef(false)

  const isAnonymous = user && !user.email

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      isMobileRef.current = isMobile;
      
      // Only update menu state if we're switching between mobile and desktop
      if (isMobile !== isMobileRef.current) {
        setIsMenuOpen(isMobile);
      }
    }

    // Set initial value
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleAuthClick = () => {
    setIsBookingFlow(false)
    setIsAuthModalOpen(true)
    if (isMenuOpen) {
      setIsMenuOpen(false)
    }
  }

  const handleBookingClick = () => {
    if (!user || isAnonymous) {
      setIsBookingFlow(true)
      setIsAuthModalOpen(true)
    } else {
      setIsBookingModalOpen(true)
    }
    if (isMenuOpen) {
      setIsMenuOpen(false)
    }
  }

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false)
    if (isBookingFlow) {
      setIsBookingModalOpen(true)
    }
    setIsBookingFlow(false)
  }

  const handleMobileToggle = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      <nav className={`navbar ${isScrolled ? "scrolled" : ""} ${isMenuOpen ? "menu-open" : ""}`}>
        <div className="navbar-container">
          <a href="#" className="navbar-logo">
            Sant Dnyaneshwar Udyan
          </a>

          <div className="mobile-toggle" onClick={handleMobileToggle}>
            <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
            <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
            <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
          </div>

          <ul className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
            <li>
              <a href="#" onClick={() => isMenuOpen && setIsMenuOpen(false)}>
                Home
              </a>
            </li>
            <li>
              <a href="#water-show" onClick={() => isMenuOpen && setIsMenuOpen(false)}>
                Water Show
              </a>
            </li>
            <li>
              <a href="#activities" onClick={() => isMenuOpen && setIsMenuOpen(false)}>
                Activities
              </a>
            </li>
            <li>
              <a href="#location" onClick={() => isMenuOpen && setIsMenuOpen(false)}>
                Location
              </a>
            </li>
            <li className="nav-btn login-btn">
              {isAnonymous ? (
                <button onClick={handleAuthClick} className="btn btn-outline">
                  Login / Sign Up
                </button>
              ) : user ? (
                <UserMenu user={user} onFeedbackClick={onFeedbackClick} />
              ) : (
                <button onClick={handleAuthClick} className="btn btn-outline">
                  Login / Sign Up
                </button>
              )}
            </li>
            <li className="nav-btn book-btn">
              <button onClick={handleBookingClick} className="btn btn-primary" disabled>
                Book Tickets
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => {
          setIsAuthModalOpen(false)
          setIsBookingFlow(false)
        }}
        onAuthSuccess={handleAuthSuccess}
      />
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
      />
    </>
  )
}

export default Navbar

