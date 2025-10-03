import { Link } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';

const Landing = () => {
  const features = [
    {
      icon: '🎯',
      title: 'Target Practice',
      description: 'Hunt bugs across top companies and earn bounties for your discoveries.'
    },
    {
      icon: '💰',
      title: 'Earn Rewards',
      description: 'Get paid for finding vulnerabilities. Bounties range from $100 to $50,000+.'
    },
    {
      icon: '📊',
      title: 'Track Progress',
      description: 'Monitor your reports, earnings, and ranking on your personalized dashboard.'
    },
    {
      icon: '🏆',
      title: 'Build Reputation',
      description: 'Climb the leaderboard and establish yourself as a top security researcher.'
    },
    {
      icon: '🔒',
      title: 'Secure Platform',
      description: 'All communications and submissions are encrypted and handled with care.'
    },
    {
      icon: '🤝',
      title: 'Fair Payouts',
      description: 'Transparent payment process with clear timelines and fair evaluations.'
    }
  ];

  return (
    <div className="landing-page">
      <Navbar />
      
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Hunt Bugs.<br />
              Earn Bounties.<br />
              <span className="hero-highlight">Make Impact.</span>
            </h1>
            <p className="hero-description">
              Join the elite community of security researchers. Find vulnerabilities,
              help companies stay secure, and get rewarded for your skills.
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="btn btn-primary btn-large">
                Start Hunting →
              </Link>
              <Link to="/companies" className="btn btn-secondary btn-large">
                Browse Programs
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-box">
                <div className="stat-number">$2.5M+</div>
                <div className="stat-label">Paid to Hackers</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">150+</div>
                <div className="stat-label">Active Programs</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">5000+</div>
                <div className="stat-label">Bugs Found</div>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="floating-card card-1">
              <div className="bug-icon">🐛</div>
              <div className="bug-severity critical">CRITICAL</div>
              <div className="bug-bounty">$15,000</div>
            </div>
            <div className="floating-card card-2">
              <div className="bug-icon">🔒</div>
              <div className="bug-severity high">HIGH</div>
              <div className="bug-bounty">$5,000</div>
            </div>
            <div className="floating-card card-3">
              <div className="bug-icon">⚠️</div>
              <div className="bug-severity medium">MEDIUM</div>
              <div className="bug-bounty">$1,500</div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="features" id="features">
        <div className="features-container">
          <h2 className="section-title">Why BugHuntr?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Start Your Bug Hunting Journey?</h2>
          <p className="cta-description">
            Join thousands of security researchers earning rewards for making the web safer.
          </p>
          <Link to="/signup" className="btn btn-primary btn-large">
            Create Free Account →
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Landing;

