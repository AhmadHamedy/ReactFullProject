import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-icons">
        <a href="#" aria-label="Instagram">
          <i className="fab fa-instagram"></i>
        </a>

        <a href="#" aria-label="Twitter">
          <i className="fab fa-x-twitter"></i>
        </a>

        <a href="#" aria-label="Facebook">
          <i className="fab fa-facebook-f"></i>
        </a>

        <a href="#" aria-label="LinkedIn">
          <i className="fab fa-linkedin-in"></i>
        </a>
      </div>

      <p className="footer-text">© 2025 Prime Bite</p>
    </footer>
  );
}
