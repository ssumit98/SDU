"use client"

import { useRef, useEffect, useState } from "react"
import "./LocationSection.css"

const LocationSection = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: 0.1,
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

  return (
    <section id="location" className="location-section" ref={sectionRef}>
      <div className="container">
        <h2 className={`section-title ${isVisible ? "fade-in" : ""}`}>Find Us</h2>

        <div className="location-content">
          <div className={`location-map ${isVisible ? "slide-in-left" : ""}`}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.6755859284456!2d75.37910491491097!3d19.43298498688285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd019b99498ee09%3A0xc7bc9f689215e150!2sPaithan%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1622045614179!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Sant Dnyaneshwar Udyan Location"
            ></iframe>
          </div>

          <div className={`location-info ${isVisible ? "slide-in-right" : ""}`}>
            <div className="info-card">
              <h3>Address</h3>
              <p>
                Sant Dnyaneshwar Udyan
                <br />
                Near Godavari River
                <br />
                Paithan, Maharashtra 431107
              </p>
            </div>

            <div className="info-card">
              <h3>Opening Hours</h3>
              <p>
                <span className="day">Monday to Friday:</span>
                <span className="time">9:00 AM - 9:00 PM</span>
              </p>
              <p>
                <span className="day">Weekends & Holidays:</span>
                <span className="time">8:00 AM - 10:00 PM</span>
              </p>
            </div>

            <div className="info-card">
              <h3>Contact Information</h3>
              <p>Phone: +91 123-456-7890</p>
              <p>Email: info@santdnyaneshwarudyan.com</p>
            </div>

            <div className="info-card directions">
              <h3>How to Reach</h3>
              <p>
                <strong>By Bus:</strong> Regular bus services from Aurangabad (45 mins)
              </p>
              <p>
                <strong>By Car:</strong> 45 minutes drive from Aurangabad city
              </p>
              <p>
                <strong>By Train:</strong> Nearest railway station is Aurangabad (30 km)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LocationSection

