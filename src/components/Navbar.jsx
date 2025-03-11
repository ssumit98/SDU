"use client"

import { useState, useEffect } from "react"
import "./Navbar.css"

const Navbar = ({ isScrolled }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
      if (window.innerWidth > 768) {
        setIsMenuOpen(false)
      }
    }

    // Set initial value
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""} ${isMenuOpen ? "menu-open" : ""}`}>
      <div className="navbar-container">
        <a href="#" className="navbar-logo">
          Sant Dnyaneshwar Udyan
        </a>

        <div className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
          <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
          <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
        </div>

        <ul className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <li>
            <a href="#" onClick={() => isMobile && setIsMenuOpen(false)}>
              Home
            </a>
          </li>
          <li>
            <a href="#water-show" onClick={() => isMobile && setIsMenuOpen(false)}>
              Water Show
            </a>
          </li>
          <li>
            <a href="#activities" onClick={() => isMobile && setIsMenuOpen(false)}>
              Activities
            </a>
          </li>
          <li>
            <a href="#location" onClick={() => isMobile && setIsMenuOpen(false)}>
              Location
            </a>
          </li>
          <li className="nav-btn login-btn">
            <a href="#" className="btn btn-outline">
              Login / Signup
            </a>
          </li>
          <li className="nav-btn book-btn">
            <a href="#book" className="btn btn-primary">
              Book Tickets
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar

