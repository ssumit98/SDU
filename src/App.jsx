"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import HeroSection from "./components/HeroSection"
import WaterShowSection from "./components/WaterShowSection"
import ActivitiesSection from "./components/ActivitiesSection"
import GallerySection from "./components/GallerySection"
import LocationSection from "./components/LocationSection"
import ChatButton from "./components/ChatButton"
import Footer from "./components/Footer"
import FeedbackModal from "./components/FeedbackModal"
import Dashboard from "./components/Dashboard"
import "./App.css"
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth"
import { auth } from "./firebase"

const App = () => {
  const [user, setUser] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Set persistence to LOCAL
        await setPersistence(auth, browserLocalPersistence)
        
        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (currentUser) {
            // User is signed in
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || currentUser.email?.split('@')[0],
              photoURL: currentUser.photoURL,
              isAnonymous: currentUser.isAnonymous
            })
          } else {
            // User is signed out
            setUser(null)
          }
          setLoading(false)
        })

        return () => unsubscribe()
      } catch (error) {
        console.error("Error setting up auth:", error)
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    // Check URL parameter on initial load
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get("feedback-modal") === "true") {
      setIsFeedbackModalOpen(true)
    }

    // Listen for URL changes
    const handleUrlChange = () => {
      const urlParams = new URLSearchParams(window.location.search)
      setIsFeedbackModalOpen(urlParams.get("feedback-modal") === "true")
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("popstate", handleUrlChange)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("popstate", handleUrlChange)
    }
  }, [])

  const handleFeedbackClick = () => {
    setIsFeedbackModalOpen(true)
    // Update URL without triggering navigation
    const url = new URL(window.location.href)
    url.searchParams.set("feedback-modal", "true")
    window.history.pushState({}, "", url)
  }

  const handleFeedbackModalClose = (isOpen) => {
    setIsFeedbackModalOpen(isOpen)
    if (!isOpen) {
      // Remove feedback-modal from URL when modal is closed
      const url = new URL(window.location.href)
      url.searchParams.delete("feedback-modal")
      window.history.replaceState({}, "", url)
    }
  }

  if (loading) {
    return <div>Loading...</div> // Or your loading component
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/dashboard/*" 
          element={<Dashboard />} 
        />
        <Route 
          path="/" 
          element={
            <div className="app">
              <Navbar 
                user={user} 
                isScrolled={isScrolled} 
                onFeedbackClick={handleFeedbackClick}
              />
              <main>
                <HeroSection user={user} />
                <WaterShowSection />
                <ActivitiesSection />
                <GallerySection />
                <LocationSection />
              </main>
              <ChatButton />
              <Footer />
              <FeedbackModal 
                isOpen={isFeedbackModalOpen} 
                onClose={handleFeedbackModalClose}
              />
            </div>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App

