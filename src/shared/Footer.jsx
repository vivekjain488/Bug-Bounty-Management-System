const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">🐛 BugFlow</h3>
          <p className="footer-text">
            The future of bug bounty management. Hunt bugs, earn rewards, make the web safer.
          </p>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-subtitle">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#companies">Companies</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-subtitle">Community</h4>
          <ul className="footer-links">
            <li><a href="#discord">Discord</a></li>
            <li><a href="#twitter">Twitter</a></li>
            <li><a href="#github">GitHub</a></li>
            <li><a href="#blog">Blog</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-subtitle">Legal</h4>
          <ul className="footer-links">
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#guidelines">Guidelines</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 BugFlow. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

