import { Link } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';

const Landing = () => {
  const bountyCards = [
    { icon: '🐛', severity: 'CRITICAL', amount: '$15,000', color: 'critical' },
    { icon: '🔒', severity: 'HIGH', amount: '$5,000', color: 'high' },
    { icon: '⚠️', severity: 'MEDIUM', amount: '$1,500', color: 'medium' },
    { icon: '💡', severity: 'LOW', amount: '$500', color: 'low' }
  ];

  const stats = [
    { value: '$2.5M+', label: 'Total Payouts', icon: '💰' },
    { value: '150+', label: 'Active Programs', icon: '🎯' },
    { value: '5000+', label: 'Bugs Found', icon: '🐞' },
    { value: '2400+', label: 'Researchers', icon: '👥' }
  ];

  const features = [
    {
      icon: '⚡',
      title: 'Fast Payouts',
      description: 'Get rewarded quickly for valid vulnerabilities. Average payout time is 7 days.'
    },
    {
      icon: '🛡️',
      title: 'Protected Platform',
      description: 'Your submissions are encrypted and handled with military-grade security.'
    },
    {
      icon: '📈',
      title: 'Grow Your Skills',
      description: 'Access learning resources, challenges, and connect with top researchers.'
    }
  ];

  const companies = [
    { name: 'TechCorp', logo: '🚀', programs: 12 },
    { name: 'SecureBank', logo: '🏦', programs: 8 },
    { name: 'CloudNet', logo: '☁️', programs: 15 },
    { name: 'DataFlow', logo: '📊', programs: 6 }
  ];

  return (
    <div className="landing-page-revamped">
      <Navbar />
      
      {/* Hero Section - Completely New Layout */}
      <section className="hero-revamped">
        <div className="hero-grid">
          {/* Left: Main Content */}
          <div className="hero-main">
            <div className="hero-badge">
              <span className="badge-icon">🔥</span>
              <span className="badge-text">Join 2400+ Elite Researchers</span>
            </div>
            
            <h1 className="hero-mega-title">
              Discover Bugs.
              <br />
              <span className="title-outline">Secure Systems.</span>
              <br />
              <span className="title-gradient">Earn Big.</span>
            </h1>
            
            <p className="hero-lead">
              Turn your security skills into real rewards. Hunt vulnerabilities across 
              150+ programs and get paid $100 to $50,000+ per valid bug.
            </p>

            {/* Quick Action Cards */}
            <div className="quick-actions-grid">
              <Link to="/signup" className="action-card-primary">
                <span className="action-icon">🎯</span>
                <div className="action-content">
                  <h3>Start Hunting</h3>
                  <p>Sign up free</p>
                </div>
                <span className="action-arrow">→</span>
              </Link>
              
              <Link to="/companies" className="action-card-secondary">
                <span className="action-icon">🏢</span>
                <div className="action-content">
                  <h3>Browse Programs</h3>
                  <p>150+ companies</p>
                </div>
                <span className="action-arrow">→</span>
              </Link>
            </div>

            {/* Login Pills */}
            <div className="login-pills">
              <span className="pills-label">Quick Access:</span>
              <Link to="/login" className="pill researcher">
                🔍 Researcher
              </Link>
              <Link to="/company-login" className="pill company">
                🏢 Company
              </Link>
              <Link to="/triage-login" className="pill triage">
                ⚖️ Triage
              </Link>
            </div>
          </div>

          {/* Right: Bounty Showcase */}
          <div className="hero-showcase">
            <div className="bounty-stack">
              {bountyCards.map((card, index) => (
                <div key={index} className={`bounty-card-float ${card.color}`}>
                  <div className="card-icon">{card.icon}</div>
                  <div className="card-severity">{card.severity}</div>
                  <div className="card-amount">{card.amount}</div>
                </div>
              ))}
            </div>
            
            <div className="showcase-decoration">
              <div className="deco-circle"></div>
              <div className="deco-square"></div>
              <div className="deco-triangle"></div>
            </div>
          </div>
        </div>

        {/* Bottom Stats Bar */}
        <div className="stats-bar">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <span className="stat-icon">{stat.icon}</span>
              <div className="stat-details">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works - Unique Timeline */}
      <section className="how-it-works">
        <div className="section-container">
          <h2 className="section-heading">
            <span className="heading-line"></span>
            <span className="heading-text">Your Journey to $$$</span>
            <span className="heading-line"></span>
          </h2>

          <div className="timeline-flow">
            <div className="timeline-step">
              <div className="step-number">01</div>
              <div className="step-card">
                <h3>🎯 Choose Target</h3>
                <p>Browse 150+ bug bounty programs from top companies</p>
              </div>
            </div>
            
            <div className="timeline-connector">→</div>
            
            <div className="timeline-step">
              <div className="step-number">02</div>
              <div className="step-card">
                <h3>🔍 Hunt Bugs</h3>
                <p>Find vulnerabilities using your security expertise</p>
              </div>
            </div>
            
            <div className="timeline-connector">→</div>
            
            <div className="timeline-step">
              <div className="step-number">03</div>
              <div className="step-card">
                <h3>📝 Submit Report</h3>
                <p>Document your findings with our secure platform</p>
              </div>
            </div>
            
            <div className="timeline-connector">→</div>
            
            <div className="timeline-step">
              <div className="step-number">04</div>
              <div className="step-card">
                <h3>💰 Get Paid</h3>
                <p>Receive rewards within 7 days of validation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Asymmetric Grid */}
      <section className="features-revamped">
        <div className="features-asymmetric">
          <div className="feature-large">
            <div className="feature-visual">
              <div className="visual-chart">
                <div className="chart-bar" style={{ height: '60%' }}></div>
                <div className="chart-bar" style={{ height: '85%' }}></div>
                <div className="chart-bar" style={{ height: '100%' }}></div>
                <div className="chart-bar" style={{ height: '45%' }}></div>
              </div>
            </div>
            <div className="feature-content">
              <h3>📊 Track Everything</h3>
              <p>Monitor your submissions, earnings, and reputation in real-time. 
                 Advanced analytics help you understand your performance and grow.</p>
              <Link to="/signup" className="feature-link">
                See Your Dashboard →
              </Link>
            </div>
          </div>

          <div className="features-small-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-small">
                <span className="feature-icon-small">{feature.icon}</span>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Companies Marquee */}
      <section className="companies-showcase">
        <div className="section-container">
          <h2 className="section-heading-center">
            Trusted by Leading Companies
          </h2>
          
          <div className="companies-carousel">
            {companies.map((company, index) => (
              <div key={index} className="company-pill">
                <span className="company-logo">{company.logo}</span>
                <span className="company-name">{company.name}</span>
                <span className="company-programs">{company.programs} programs</span>
              </div>
            ))}
            {/* Duplicate for seamless scroll effect */}
            {companies.map((company, index) => (
              <div key={`dup-${index}`} className="company-pill">
                <span className="company-logo">{company.logo}</span>
                <span className="company-name">{company.name}</span>
                <span className="company-programs">{company.programs} programs</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Split Design */}
      <section className="cta-revamped">
        <div className="cta-split">
          <div className="cta-content">
            <h2 className="cta-mega">
              Ready to Make
              <br />
              <span className="cta-highlight">Security Pay?</span>
            </h2>
            <p className="cta-text">
              Join the elite community of security researchers earning real money 
              while making the internet safer for everyone.
            </p>
            <div className="cta-buttons">
              <Link to="/signup" className="cta-btn-primary">
                <span>Create Free Account</span>
                <span className="btn-shine"></span>
              </Link>
              <Link to="/companies" className="cta-btn-ghost">
                View All Programs
              </Link>
            </div>
          </div>
          
          <div className="cta-visual">
            <div className="visual-stack">
              <div className="stack-card card-1">
                <span className="card-emoji">🎉</span>
                <span className="card-text">$10,000 earned</span>
              </div>
              <div className="stack-card card-2">
                <span className="card-emoji">⭐</span>
                <span className="card-text">Top 100 Researcher</span>
              </div>
              <div className="stack-card card-3">
                <span className="card-emoji">🏆</span>
                <span className="card-text">50 Bugs Found</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Landing;

