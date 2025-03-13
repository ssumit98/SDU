"use client"

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
import "./App.css"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./firebase"

const App = () => {
  const [user, setUser] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

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
      unsubscribe()
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

  return (
    <div className="app">
      <Navbar 
        user={user} 
        isScrolled={isScrolled} 
        onFeedbackClick={handleFeedbackClick}
      />
      <main>
        <HeroSection />
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
  )
}

export default App

