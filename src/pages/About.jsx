import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';

const About = () => {
  return (
    <div className="about-page">
      <Navbar />

      <header className="hero about-hero">
        <div className="hero-inner">
          <h1>About Our Platform</h1>
          <p className="lead">A modern, community-driven bug bounty management platform connecting security researchers with companies.</p>
        </div>
      </header>

      <main className="content">
        <section className="section">
          <h2>Mission</h2>
          <p>We empower security researchers to responsibly disclose vulnerabilities while helping companies find and remediate real security issues quickly and safely.</p>
        </section>

        <section className="section">
          <h2>Who is this for?</h2>
          <ul>
            <li><strong>Researchers:</strong> Submit reports, build reputations, and earn bounties.</li>
            <li><strong>Companies:</strong> Run programs, triage reports, and pay bounties securely.</li>
            <li><strong>Triage Teams:</strong> Centralized review, analytics, and automations.</li>
          </ul>
        </section>

        <section className="section">
          <h2>Values</h2>
          <ul>
            <li>Responsible disclosure and clear rules</li>
            <li>Transparent reward structures</li>
            <li>Privacy and data protection</li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
