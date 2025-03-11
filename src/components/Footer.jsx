import "./Footer.css"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <h3 className="footer-title">Sant Dnyaneshwar Udyan</h3>
            <p>Experience nature, culture, and entertainment at Paithan's premier garden.</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#water-show">Water Show</a>
              </li>
              <li>
                <a href="#activities">Activities</a>
              </li>
              <li>
                <a href="#location">Location</a>
              </li>
              <li>
                <a href="#book">Book Tickets</a>
              </li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Information</h4>
            <ul>
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Events</a>
              </li>
              <li>
                <a href="#">Gallery</a>
              </li>
              <li>
                <a href="#">Terms & Conditions</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
            </ul>
          </div>

          <div className="footer-newsletter">
            <h4>Subscribe to our Newsletter</h4>
            <p>Get updates on events, special offers, and more!</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Your Email Address" required />
              <button type="submit" className="btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Sant Dnyaneshwar Udyan. All Rights Reserved.</p>
          <p>
            Designed with <span className="heart">❤</span> in Paithan
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

