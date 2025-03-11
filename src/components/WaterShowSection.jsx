"use client"

import { useState, useRef, useEffect } from "react"
import "./WaterShowSection.css"

const WaterShowSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  const waterShowImages = [
    "https://housing.com/news/wp-content/uploads/2023/05/Why-visit-Brindavan-Gardens-Mysore-f.jpg",
    "https://ksrbrothers.com/wp-content/uploads/2023/07/World-of-Musical-Water-Fountain-Dealers-in-India-e1690267530374.jpg",
    "https://tiimg.tistatic.com/fp/2/003/509/laser-show-fountains-860.jpg",
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: 0.2,
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % waterShowImages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [waterShowImages.length])

  return (
    <section id="water-show" className="water-show-section" ref={sectionRef}>
      <div className="container">
        <h2 className={`section-title ${isVisible ? "fade-in" : ""}`}>Spectacular Water Shows</h2>

        <div className="water-show-content">
          <div className={`carousel-container ${isVisible ? "slide-in-left" : ""}`}>
            <div className="carousel-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {waterShowImages.map((image, index) => (
                <div key={index} className="carousel-slide">
                  <img src={image || "/placeholder.svg"} alt={`Water show ${index + 1}`} />
                </div>
              ))}
            </div>

            <div className="carousel-indicators">
              {waterShowImages.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentSlide ? "active" : ""}`}
                  onClick={() => setCurrentSlide(index)}
                ></button>
              ))}
            </div>
          </div>

          <div className={`water-show-info ${isVisible ? "slide-in-right" : ""}`}>
            <h3>Magical Musical Fountains</h3>
            <p>
              Experience the breathtaking water show at Sant Dnyaneshwar Udyan, where water, light, and music blend
              together to create a mesmerizing spectacle. Our state-of-the-art musical fountain is choreographed to
              popular songs, creating a symphony of water movements.
            </p>
            <h4>Show Timings:</h4>
            <ul className="show-timings">
              <li>
                <span className="day">Weekdays:</span>
                <span className="time">6:00 PM, 7:30 PM, 9:00 PM</span>
              </li>
              <li>
                <span className="day">Weekends:</span>
                <span className="time">5:00 PM, 6:30 PM, 8:00 PM, 9:30 PM</span>
              </li>
            </ul>
            <a href="#book" className="btn btn-primary">
              Book Your Show
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WaterShowSection

