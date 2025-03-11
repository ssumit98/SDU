"use client"

import { useRef, useEffect, useState } from "react"
import "./ActivitiesSection.css"

const ActivitiesSection = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  const activities = [
    {
      icon: "🌳",
      title: "Nature Walks",
      description:
        "Take a peaceful stroll through our beautifully landscaped gardens featuring a variety of plants and flowers.",
    },
    {
      icon: "🎭",
      title: "Cultural Shows",
      description: "Enjoy cultural performances showcasing traditional dance, music, and art forms from Maharashtra.",
    },
    {
      icon: "👨‍👩‍👧‍👦",
      title: "Family Picnics",
      description:
        "Designated picnic areas for families to relax and enjoy quality time together in a serene environment.",
    },
    {
      icon: "🎡",
      title: "Kids Zone",
      description:
        "A dedicated area with swings, slides, and other play equipment to keep the little ones entertained.",
    },
    {
      icon: "📸",
      title: "Photography",
      description: "Numerous picturesque spots perfect for capturing memorable moments with your loved ones.",
    },
    {
      icon: "🛍️",
      title: "Souvenir Shop",
      description: "Take home a piece of Sant Dnyaneshwar Udyan with handcrafted souvenirs and local products.",
    },
  ]

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
    <section id="activities" className="activities-section" ref={sectionRef}>
      <div className="container">
        <h2 className={`section-title ${isVisible ? "fade-in" : ""}`}>Activities & Attractions</h2>

        <div className="activities-grid">
          {activities.map((activity, index) => (
            <div
              key={index}
              className={`activity-card ${isVisible ? "slide-in-bottom" : ""}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="activity-icon">{activity.icon}</div>
              <h3 className="activity-title">{activity.title}</h3>
              <p className="activity-description">{activity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ActivitiesSection

