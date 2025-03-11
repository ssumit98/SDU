"use client"

import { useState } from "react"
import "./ChatButton.css"

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      type: "received",
      text: "Hello! Welcome to Sant Dnyaneshwar Udyan. How can I help you today?",
    },
  ])

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    // Add user message
    setMessages([...messages, { type: "sent", text: message }])

    // Simulate response after a short delay
    setTimeout(() => {
      let response
      if (message.toLowerCase().includes("ticket") || message.toLowerCase().includes("book")) {
        response = "You can book tickets online or at our entrance gate. Online booking gives you a 10% discount!"
      } else if (message.toLowerCase().includes("time") || message.toLowerCase().includes("hour")) {
        response = "We're open from 9AM to 9PM on weekdays and 8AM to 10PM on weekends and holidays."
      } else if (message.toLowerCase().includes("water") || message.toLowerCase().includes("show")) {
        response =
          "Our water shows run at 6PM, 7:30PM, and 9PM on weekdays, with additional 5PM and 8PM shows on weekends."
      } else {
        response = "Thanks for your message! Our team will get back to you shortly."
      }

      setMessages((prevMessages) => [...prevMessages, { type: "received", text: response }])
    }, 1000)

    setMessage("")
  }

  return (
    <div className={`chat-container ${isOpen ? "open" : ""}`}>
      <button className="chat-button" onClick={toggleChat}>
        <span className="chat-icon">{isOpen ? "✕" : "💬"}</span>
      </button>

      <div className="chat-box">
        <div className="chat-header">
          <h3>Sant Dnyaneshwar Udyan</h3>
          <p>We typically reply within minutes</p>
        </div>

        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              {message.text}
            </div>
          ))}
        </div>

        <form className="chat-input" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" disabled={!message.trim()}>
            <span className="sr-only">Send</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatButton

