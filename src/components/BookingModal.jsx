import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BookingModal.css";

const BookingModal = ({ isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [tickets, setTickets] = useState({
    adult: 0,
    child: 0,
    senior: 0
  });
  const [parking, setParking] = useState({
    twoWheeler: 0,
    threeWheeler: 0,
    carJeep: 0,
    bus: 0
  });
  const [showParking, setShowParking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showBillDetails, setShowBillDetails] = useState(false);

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];

  const PRICES = {
    tickets: {
      adult: 100,
      child: 50,
      senior: 75
    },
    parking: {
      twoWheeler: 20,
      threeWheeler: 30,
      carJeep: 50,
      bus: 100
    }
  };

  const calculateBill = () => {
    const ticketsSubtotal = 
      (tickets.adult * PRICES.tickets.adult) +
      (tickets.child * PRICES.tickets.child) +
      (tickets.senior * PRICES.tickets.senior);

    const parkingSubtotal = 
      (parking.twoWheeler * PRICES.parking.twoWheeler) +
      (parking.threeWheeler * PRICES.parking.threeWheeler) +
      (parking.carJeep * PRICES.parking.carJeep) +
      (parking.bus * PRICES.parking.bus);

    return {
      ticketsSubtotal,
      parkingSubtotal,
      total: ticketsSubtotal + parkingSubtotal
    };
  };

  const handleTicketChange = (type, value) => {
    setTickets(prev => ({
      ...prev,
      [type]: Math.max(0, parseInt(value) || 0)
    }));
  };

  const handleParkingChange = (type, value) => {
    setParking(prev => ({
      ...prev,
      [type]: Math.max(0, parseInt(value) || 0)
    }));
  };

  const incrementTicket = (type) => {
    setTickets(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  const decrementTicket = (type) => {
    setTickets(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] - 1)
    }));
  };

  const incrementParking = (type) => {
    setParking(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  const decrementParking = (type) => {
    setParking(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] - 1)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTime) {
      setError("Please select a time slot");
      return;
    }

    if (tickets.adult + tickets.child + tickets.senior === 0) {
      setError("Please select at least one ticket");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      // TODO: Add booking logic here
      // For now, just simulate a successful booking
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error booking tickets:", error);
      setError("Failed to book tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="booking-modal-overlay">
      <div className="booking-modal">
        <button className="close-button-ticket" onClick={onClose}>×</button>
        <h2>Book Your Tickets</h2>
        
        {success ? (
          <div className="success-animation">
            <div className="checkmark">
              <svg className="checkmark-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
            <p>Booking Successful!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="booking-form">

            <div className="form-group">
              <label>Select Time Slot</label>
              <div className="time-select-container">
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="time-select"
                  required
                >
                  <option value="">Choose a time slot</option>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Select Date</label>
              <DatePicker
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                minDate={new Date()}
                dateFormat="MMMM d, yyyy"
                className="date-picker"
              />
            </div>

            <div className="tickets-section">
              <h3>Tickets</h3>
              <div className="ticket-inputs">
                <div className="ticket-input">
                  <label>Adult (₹100)</label>
                  <div className="input-group">
                    <button 
                      type="button" 
                      onClick={() => decrementTicket("adult")}
                      disabled={tickets.adult === 0}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={tickets.adult}
                      onChange={(e) => handleTicketChange("adult", e.target.value)}
                      min="0"
                    />
                    <button 
                      type="button" 
                      onClick={() => incrementTicket("adult")}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="ticket-input">
                  <label>Child (₹50)</label>
                  <div className="input-group">
                    <button 
                      type="button" 
                      onClick={() => decrementTicket("child")}
                      disabled={tickets.child === 0}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={tickets.child}
                      onChange={(e) => handleTicketChange("child", e.target.value)}
                      min="0"
                    />
                    <button 
                      type="button" 
                      onClick={() => incrementTicket("child")}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="ticket-input">
                  <label>Senior Citizen (₹75)</label>
                  <div className="input-group">
                    <button 
                      type="button" 
                      onClick={() => decrementTicket("senior")}
                      disabled={tickets.senior === 0}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={tickets.senior}
                      onChange={(e) => handleTicketChange("senior", e.target.value)}
                      min="0"
                    />
                    <button 
                      type="button" 
                      onClick={() => incrementTicket("senior")}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div 
              className={`parking-section ${showParking ? 'expanded' : ''}`}
              onClick={() => setShowParking(!showParking)}
            >
              <button
                type="button"
                className="parking-toggle"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowParking(!showParking);
                }}
              >
                {showParking ? "Hide Parking Options" : "Show Parking Options"}
              </button>
              
              {showParking && (
                <div className="parking-inputs" onClick={(e) => e.stopPropagation()}>
                  <div className="parking-input">
                    <label>Two Wheeler (₹20)</label>
                    <div className="input-group">
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          decrementParking("twoWheeler");
                        }}
                        disabled={parking.twoWheeler === 0}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={parking.twoWheeler}
                        onChange={(e) => handleParkingChange("twoWheeler", e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        min="0"
                      />
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          incrementParking("twoWheeler");
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="parking-input">
                    <label>Three Wheeler (₹30)</label>
                    <div className="input-group">
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          decrementParking("threeWheeler");
                        }}
                        disabled={parking.threeWheeler === 0}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={parking.threeWheeler}
                        onChange={(e) => handleParkingChange("threeWheeler", e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        min="0"
                      />
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          incrementParking("threeWheeler");
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="parking-input">
                    <label>Car/Jeep (₹50)</label>
                    <div className="input-group">
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          decrementParking("carJeep");
                        }}
                        disabled={parking.carJeep === 0}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={parking.carJeep}
                        onChange={(e) => handleParkingChange("carJeep", e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        min="0"
                      />
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          incrementParking("carJeep");
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="parking-input">
                    <label>Bus (₹100)</label>
                    <div className="input-group">
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          decrementParking("bus");
                        }}
                        disabled={parking.bus === 0}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={parking.bus}
                        onChange={(e) => handleParkingChange("bus", e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        min="0"
                      />
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          incrementParking("bus");
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            

            <div className="bill-details-section">
              <button
                type="button"
                className="bill-details-toggle"
                onClick={() => setShowBillDetails(!showBillDetails)}
              >
                {showBillDetails ? "Hide Bill Details" : "View Bill Details"}
              </button>
              
              {showBillDetails && (
                <div className="bill-details">
                  <div className="bill-section">
                    <h4>Tickets</h4>
                    {tickets.adult > 0 && (
                      <div className="bill-item">
                        <span>Adult × {tickets.adult}</span>
                        <span>₹{tickets.adult * PRICES.tickets.adult}</span>
                      </div>
                    )}
                    {tickets.child > 0 && (
                      <div className="bill-item">
                        <span>Child × {tickets.child}</span>
                        <span>₹{tickets.child * PRICES.tickets.child}</span>
                      </div>
                    )}
                    {tickets.senior > 0 && (
                      <div className="bill-item">
                        <span>Senior × {tickets.senior}</span>
                        <span>₹{tickets.senior * PRICES.tickets.senior}</span>
                      </div>
                    )}
                    {(tickets.adult > 0 || tickets.child > 0 || tickets.senior > 0) && (
                      <div className="bill-subtotal">
                        <span>Tickets Subtotal</span>
                        <span>₹{calculateBill().ticketsSubtotal}</span>
                      </div>
                    )}
                  </div>

                  {(parking.twoWheeler > 0 || parking.threeWheeler > 0 || parking.carJeep > 0 || parking.bus > 0) && (
                    <div className="bill-section">
                      <h4>Parking</h4>
                      {parking.twoWheeler > 0 && (
                        <div className="bill-item">
                          <span>Two Wheeler × {parking.twoWheeler}</span>
                          <span>₹{parking.twoWheeler * PRICES.parking.twoWheeler}</span>
                        </div>
                      )}
                      {parking.threeWheeler > 0 && (
                        <div className="bill-item">
                          <span>Three Wheeler × {parking.threeWheeler}</span>
                          <span>₹{parking.threeWheeler * PRICES.parking.threeWheeler}</span>
                        </div>
                      )}
                      {parking.carJeep > 0 && (
                        <div className="bill-item">
                          <span>Car/Jeep × {parking.carJeep}</span>
                          <span>₹{parking.carJeep * PRICES.parking.carJeep}</span>
                        </div>
                      )}
                      {parking.bus > 0 && (
                        <div className="bill-item">
                          <span>Bus × {parking.bus}</span>
                          <span>₹{parking.bus * PRICES.parking.bus}</span>
                        </div>
                      )}
                      <div className="bill-subtotal">
                        <span>Parking Subtotal</span>
                        <span>₹{calculateBill().parkingSubtotal}</span>
                      </div>
                    </div>
                  )}

                  <div className="bill-total">
                    <span>Total Amount</span>
                    <span>₹{calculateBill().total}</span>
                  </div>
                </div>
              )}
            </div>

            {error && <p className="error-message">{error}</p>}
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Processing..." : `Pay ₹${calculateBill().total}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default BookingModal; 