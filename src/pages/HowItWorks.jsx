import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  return (
    <div className="howitworks-page">
      <Navbar />

      <header className="hero how-hero">
        <div className="hero-inner">
          <h1>How It Works</h1>
          <p className="lead">A quick guide for researchers and companies to get started.</p>
        </div>
      </header>

      <main className="content">
        <section className="section">
          <h2>For Researchers</h2>
          <ol>
            <li>Create an account and verify your profile.</li>
            <li>Browse programs on the <Link to="/programs">Programs</Link> page.</li>
            <li>Submit clear reports with reproduction steps and POC.</li>
            <li>Track your reports on <Link to="/my-reports">My Reports</Link> and collect bounties.</li>
          </ol>
        </section>

        <section className="section">
          <h2>For Companies</h2>
          <ol>
            <li>Create a company account and configure your program.</li>
            <li>Set reward ranges and scope.</li>
            <li>Use the Triage dashboard to review and pay bounties.</li>
            <li>Monitor analytics and tune your program.</li>
          </ol>
        </section>

        <section className="section">
          <h2>Best Practices</h2>
          <ul>
            <li>Provide clear scope and rules.</li>
            <li>Reward accurate, high-quality reports.</li>
            <li>Keep communication constructive and private.</li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;
