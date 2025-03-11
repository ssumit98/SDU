"use client"

import { useState, useEffect } from "react"
import "./HeroSection.css"

const HeroSection = () => {
  const [activeSlide, setActiveSlide] = useState(0)

  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1585938389612-a552a28d6914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      title: "Welcome to Sant Dnyaneshwar Udyan",
      subtitle: "Experience the beauty and tranquility of Paithan's premier garden",
    },
    {
      image:
        "https://static.wixstatic.com/media/b57604_f7f0af1f268647fca15ee1bb414b8097~mv2.webp/v1/fill/w_980,h_551,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/b57604_f7f0af1f268647fca15ee1bb414b8097~mv2.webp",
      title: "Magical Water Shows",
      subtitle: "Be mesmerized by our spectacular water fountain shows",
    },
    {
      image:
        "https://housing.com/news/wp-content/uploads/2023/05/Why-visit-Brindavan-Gardens-Mysore-f.jpg",
      title: "Family-friendly Activities",
      subtitle: "Fun activities for visitors of all ages",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prevSlide) => (prevSlide + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  const handleDotClick = (index) => {
    setActiveSlide(index)
  }

  return (
    <section className="hero-section">
      <div className="hero-carousel">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === activeSlide ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-overlay"></div>
          </div>
        ))}
      </div>

      <div className="hero-content">
        <div className="hero-text-container">
          {slides.map((slide, index) => (
            <div key={index} className={`hero-text ${index === activeSlide ? "active" : ""}`}>
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-subtitle">{slide.subtitle}</p>
            </div>
          ))}
        </div>

        <a href="#book" className="btn btn-primary book-btn">
          Book Tickets Now
        </a>

        <div className="carousel-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === activeSlide ? "active" : ""}`}
              onClick={() => handleDotClick(index)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection

