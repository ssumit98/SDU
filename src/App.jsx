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
import "./App.css"

function App() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="app">
      <Navbar isScrolled={isScrolled} />
      <main>
        <HeroSection />
        <WaterShowSection />
        <ActivitiesSection />
        <GallerySection />
        <LocationSection />
      </main>
      <ChatButton />
      <Footer />
    </div>
  )
}

export default App

