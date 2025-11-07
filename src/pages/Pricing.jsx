import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const plans = [
    { name: 'Starter', price: '$49/mo', features: ['Up to 5 programs', 'Basic analytics', 'Email support'] },
    { name: 'Growth', price: '$149/mo', features: ['Up to 25 programs', 'Advanced analytics', 'Priority support'] },
    { name: 'Enterprise', price: '$499/mo', features: ['Unlimited programs', 'SLA & dedicated support', 'Custom integrations'] }
  ];

  return (
    <div className="pricing-page">
      <Navbar />

      <header className="hero pricing-hero">
        <div className="hero-inner">
          <h1>Pricing</h1>
          <p className="lead">Plans built for security teams of every size.</p>
        </div>
      </header>

      <main className="content">
        <div className="pricing-grid">
          {plans.map(plan => (
            <div key={plan.name} className="plan-card">
              <h3>{plan.name}</h3>
              <div className="plan-price">{plan.price}</div>
              <ul className="plan-features">
                {plan.features.map(f => <li key={f}>{f}</li>)}
              </ul>
              <Link to="/company-signup" className="btn btn-primary">Get Started</Link>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
