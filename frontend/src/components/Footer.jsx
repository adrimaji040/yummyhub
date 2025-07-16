// src/components/Footer.js
import "../css/Footer.css";

// Importa las imágenes al inicio
import googlePlayBadge from "../img/get-it-on-google-play-badge.png";
import playStore from "../img/play-store.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section links">
          <h3>Links</h3>
          <ul>
            <li>
              <a href="#">Recipes</a>
            </li>
            <li>
              <a href="#">Articles</a>
            </li>
            <li>
              <a href="#">Careers</a>
            </li>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
          </ul>
        </div>
        <div className="footer-section legal">
          <h3>Legal & Support</h3>
          <ul>
            <li>
              <a href="#">Terms of Service</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">FAQs</a>
            </li>
          </ul>
        </div>
        <div className="footer-section download">
          <h3>Download the App</h3>
          <ul>
            <li>
              <a href="#">
                <img
                  className="footer-icon"
                  src={googlePlayBadge}
                  alt="Get it on Google Play"
                />
              </a>
            </li>
            <li>
              <a href="#">
                <img
                  className="footer-icon"
                  src={playStore}
                  alt="Download on the App Store"
                />
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-section newsletter">
          <h3>Sign up for our Newsletter</h3>
          <p>
            Subscribe & start receiving your weekly dose of delicious
            inspiration!
          </p>
          <form>
            <input type="email" placeholder="name@domain.com" />
            <button type="submit">Subscribe</button>
          </form>
          <div className="social-media">
            <a href="#">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fab fa-pinterest-p"></i>
            </a>
            <a href="#">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="#">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 YummyHub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
