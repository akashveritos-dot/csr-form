import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle, 
  Edit2, 
  Mail, 
  User, 
  Briefcase, 
  Phone, 
  Building, 
  MessageSquare, 
  Check, 
  Globe,
  Users,
  Sparkles
} from 'lucide-react';

export const StepContainer = ({ children, onBack, index, totalSteps }) => (
  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    {index !== undefined && (
      <div className="step-navigation-header">
        {onBack ? (
          <button className="btn-back-nav" onClick={onBack} aria-label="Go Back">
            <ArrowLeft size={18} />
          </button>
        ) : (
          <div style={{ width: '44px' }} />
        )}
        
        <span className="step-indicator-text">
          Step {index} of {totalSteps}
        </span>
        
        <div style={{ width: '44px' }} />
      </div>
    )}
    {children}
  </div>
);

const CountUp = ({ end, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    const duration = 1500; // Smooth tick up

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Cubic ease out
      const easedPercentage = 1 - Math.pow(1 - percentage, 3);
      
      setCount(Math.floor(easedPercentage * end));

      if (percentage < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

export const HeroStep = ({ onNext }) => (
  <StepContainer>
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="event-tag" style={{ background: 'var(--primary-glow)', color: 'var(--primary-color)', margin: '0 auto 1rem' }}>
        🚀 PARTNERSHIP INSIGHTS
      </div>
      <h1 style={{ marginBottom: '1rem' }}>Partner With Us</h1>
      <p style={{ maxWidth: '520px', margin: '0 auto 2.5rem' }}>
        Amplify your social impact through India's leading CSR & Sustainability media ecosystem.
      </p>
    </motion.div>
    
    <div className="stats-container">
      {[
        { end: 90000, label: "Website Visitors", icon: <Globe size={20} /> },
        { end: 75000, label: "Social Followers", icon: <Users size={20} /> },
        { end: 115000, label: "Newsletter Subscribers", icon: <Mail size={20} /> }
      ].map((stat, i) => (
        <motion.div 
          className="stat-item" 
          key={i}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15, type: 'spring', stiffness: 100 }}
        >
          <div className="stat-icon-box">{stat.icon}</div>
          <div className="stat-number">
            <CountUp end={stat.end} suffix="+" />
          </div>
          <div className="stat-label">{stat.label}</div>
        </motion.div>
      ))}
    </div>

    <motion.button 
      className="btn-primary" 
      onClick={onNext}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      Start Partnership Journey <ArrowRight size={20} style={{ marginLeft: '10px' }} />
    </motion.button>
  </StepContainer>
);

export const EmailStep = ({ value = '', onChange, onNext, onBack, index, totalSteps }) => {
  const [error, setError] = useState('');
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleNext = () => {
    if (isValid) onNext();
    else setError('Please enter a valid email address');
  };

  return (
    <StepContainer onBack={onBack} index={index} totalSteps={totalSteps}>
      <h2>Let's Get Connected</h2>
      <p style={{ maxWidth: '460px', margin: '0 auto 2rem' }}>
        Enter your work email so we can coordinate your customized CSR partnership package.
      </p>
      
      <div className="input-group">
        <div className="input-icon-wrapper">
          <input 
            type="email" 
            className="input-field" 
            placeholder="name@company.com" 
            value={value} 
            onChange={(e) => { onChange('email', e.target.value); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleNext()}
            autoFocus
          />
          <Mail className="field-icon" size={22} />
        </div>
        {error && <span className="error-msg">⚠️ {error}</span>}
      </div>
      
      <motion.button 
        className="btn-primary" 
        onClick={handleNext} 
        disabled={!isValid}
        whileHover={isValid ? { scale: 1.02 } : {}}
        whileTap={isValid ? { scale: 0.98 } : {}}
      >
        Continue <ArrowRight size={20} style={{ marginLeft: '10px' }} />
      </motion.button>
    </StepContainer>
  );
};

export const NameStep = ({ value = '', onChange, onNext, onBack, index, totalSteps }) => {
  const isValid = value.trim().length > 1;

  return (
    <StepContainer onBack={onBack} index={index} totalSteps={totalSteps}>
      <h2>What's Your Full Name?</h2>
      <p style={{ maxWidth: '440px', margin: '0 auto 2rem' }}>
        We love keeping our partnership conversations warm and personalized!
      </p>
      
      <div className="input-group">
        <div className="input-icon-wrapper">
          <input 
            type="text" 
            className="input-field" 
            placeholder="e.g. Akash Sharma" 
            value={value} 
            onChange={(e) => onChange('full_name', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && isValid && onNext()}
            autoFocus
          />
          <User className="field-icon" size={22} />
        </div>
      </div>
      
      <motion.button 
        className="btn-primary" 
        onClick={onNext} 
        disabled={!isValid}
        whileHover={isValid ? { scale: 1.02 } : {}}
        whileTap={isValid ? { scale: 0.98 } : {}}
      >
        Continue <ArrowRight size={20} style={{ marginLeft: '10px' }} />
      </motion.button>
    </StepContainer>
  );
};

export const DesignationStep = ({ value = '', formData = {}, onChange, onNext, onBack, index, totalSteps }) => {
  const isValid = value.trim().length > 1;
  const firstName = formData.full_name ? formData.full_name.split(' ')[0] : '';
  const greeting = firstName ? `Pleasure meeting you, ${firstName}!` : "Pleasure to meet you!";

  // Pre-configured tapping quick roles to make it highly engaging and fast!
  const commonRoles = [
    "CSR Head",
    "Founder & CEO",
    "Sustainability Lead",
    "Marketing Director",
    "Corporate Relations"
  ];

  return (
    <StepContainer onBack={onBack} index={index} totalSteps={totalSteps}>
      <h2>{greeting}</h2>
      <p style={{ maxWidth: '480px', margin: '0 auto 1.8rem' }}>
        What is your designation or role in the organization?
      </p>
      
      <div className="input-group">
        <div className="input-icon-wrapper">
          <input 
            type="text" 
            className="input-field" 
            placeholder="Your designation" 
            value={value} 
            onChange={(e) => onChange('designation', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && isValid && onNext()}
            autoFocus
          />
          <Briefcase className="field-icon" size={22} />
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
        {commonRoles.map((role) => (
          <motion.button
            key={role}
            className="btn-secondary"
            onClick={() => {
              onChange('designation', role);
              setTimeout(onNext, 200); // Tiny delay for a satisfying selection feel
            }}
            style={{ 
              padding: '0.6rem 1.1rem', 
              fontSize: '0.85rem', 
              borderRadius: '100px',
              border: value === role ? '1.5px solid var(--primary-color)' : '1.5px solid #e2e8f0',
              background: value === role ? 'var(--primary-glow)' : 'rgba(255, 255, 255, 0.7)',
              color: value === role ? 'var(--primary-color)' : '#475569'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {role}
          </motion.button>
        ))}
      </div>
      
      <motion.button 
        className="btn-primary" 
        onClick={onNext} 
        disabled={!isValid}
        whileHover={isValid ? { scale: 1.02 } : {}}
        whileTap={isValid ? { scale: 0.98 } : {}}
      >
        Continue <ArrowRight size={20} style={{ marginLeft: '10px' }} />
      </motion.button>
    </StepContainer>
  );
};

export const PhoneStep = ({ value = '', formData = {}, onChange, onNext, onBack, index, totalSteps }) => {
  const isValid = value.trim().length >= 10;
  const firstName = formData.full_name ? formData.full_name.split(' ')[0] : '';
  const conversationalTitle = firstName 
    ? `Great, ${firstName}! What's your phone number?` 
    : "Enter Your Phone Number";

  return (
    <StepContainer onBack={onBack} index={index} totalSteps={totalSteps}>
      <h2>{conversationalTitle}</h2>
      <p style={{ maxWidth: '440px', margin: '0 auto 2rem' }}>
        We'll only use this to schedule a brief partnership sync!
      </p>
      
      <div className="input-group">
        <div className="input-icon-wrapper">
          <input 
            type="tel" 
            className="input-field" 
            placeholder="+91 9876543210" 
            value={value} 
            onChange={(e) => onChange('phone_number', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && isValid && onNext()}
            autoFocus
          />
          <Phone className="field-icon" size={22} />
        </div>
      </div>
      
      <motion.button 
        className="btn-primary" 
        onClick={onNext} 
        disabled={!isValid}
        whileHover={isValid ? { scale: 1.02 } : {}}
        whileTap={isValid ? { scale: 0.98 } : {}}
      >
        Continue <ArrowRight size={20} style={{ marginLeft: '10px' }} />
      </motion.button>
    </StepContainer>
  );
};

export const OrganizationStep = ({ value = '', formData = {}, onChange, onNext, onBack, index, totalSteps }) => {
  const isValid = value.trim().length > 1;
  const firstName = formData.full_name ? formData.full_name.split(' ')[0] : '';
  const conversationalTitle = firstName 
    ? `Which organization are you representing today, ${firstName}?` 
    : "Organisation / Company Name";

  return (
    <StepContainer onBack={onBack} index={index} totalSteps={totalSteps}>
      <h2>{conversationalTitle}</h2>
      <p style={{ maxWidth: '450px', margin: '0 auto 2rem' }}>
        Let's showcase your company's incredible social impact projects!
      </p>
      
      <div className="input-group">
        <div className="input-icon-wrapper">
          <input 
            type="text" 
            className="input-field" 
            placeholder="e.g. Google India" 
            value={value} 
            onChange={(e) => onChange('organization_name', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && isValid && onNext()}
            autoFocus
          />
          <Building className="field-icon" size={22} />
        </div>
      </div>
      
      <motion.button 
        className="btn-primary" 
        onClick={onNext} 
        disabled={!isValid}
        whileHover={isValid ? { scale: 1.02 } : {}}
        whileTap={isValid ? { scale: 0.98 } : {}}
      >
        Continue <ArrowRight size={20} style={{ marginLeft: '10px' }} />
      </motion.button>
    </StepContainer>
  );
};

export const PackageSelectionStep = ({ value = '', formData = {}, onChange, onNext, onBack, index, totalSteps }) => {
  const orgName = formData.organization_name || 'your company';
  
  const packages = [
    {
      id: '4_month_coverage',
      title: '4 Months Coverage & Amplification',
      price: 'INR 40,000 + 18% GST',
      popular: true,
      features: ['4 News coverages', '1 Video Interview', '1 Case Study & Opinion Piece', 'Social & Newsletter Promotion', '1 Delegate Pass']
    },
    {
      id: '6_month_coverage',
      title: '6 Months Coverage & Amplification',
      price: 'INR 75,000 + 18% GST',
      popular: false,
      features: ['6 News coverages', '2 Interviews (1 Video)', '2 Case Studies & Success Stories', 'Social & Newsletter Promotion', '2 Delegate Passes & Standee Display']
    },
    {
      id: '12_month_coverage',
      title: '12 Months National Coverage',
      price: 'INR 1,25,000 + 18% GST',
      popular: false,
      features: ['12 News, 2 Interviews, 4 Case Studies', 'Panel Speaker & Logo Visibility', 'Social & Newsletter Amplification', '3 Delegate Passes & Standee Display']
    },
    {
      id: '1_month_coverage',
      title: '1 Month Starter Coverage',
      price: 'INR 15,000 + 18% GST',
      popular: false,
      features: ['2 News coverages', '1 Interview', 'Social Media & Newsletter Promo']
    },
    {
      id: '2_month_coverage',
      title: '2 Months Standard Coverage',
      price: 'INR 25,000 + 18% GST',
      popular: false,
      features: ['3 News coverages', '1 Interview & 1 Case Study', 'Social Media & Newsletter Promo']
    },
    {
      id: 'event_media_partnership',
      title: 'Event Media Partnership',
      price: 'INR 50,000 + 18% GST',
      popular: false,
      features: ['Full pre/during/post editorial coverage', 'Event Ad & Banner Promotion']
    },
    {
      id: 'newsletter_banner_promotion',
      title: 'Newsletter Banner Promotion',
      price: 'INR 15,000 + 18% GST',
      popular: false,
      features: ['Premium Digital Banner Slot', '1 Week High-Impact Promotion']
    }
  ];

  return (
    <StepContainer onBack={onBack} index={index} totalSteps={totalSteps}>
      <h2>Select a Partnership Package</h2>
      <p style={{ maxWidth: '480px', margin: '0 auto 1.5rem' }}>
        Choose the best CSR amplification plan to expand {orgName}'s reach.
      </p>
      
      <div className="package-scroll-container">
        {packages.map((pkg) => (
          <motion.div 
            key={pkg.id} 
            className={`package-card ${value === pkg.id ? 'selected' : ''}`}
            onClick={() => onChange('selected_package', pkg.id)}
            whileHover={{ scale: 1.01, translateY: -2 }}
            whileTap={{ scale: 0.99 }}
            style={{ 
              border: value === pkg.id ? '2px solid var(--primary-color)' : '1px solid rgba(226, 232, 240, 0.7)',
              background: value === pkg.id ? '#ffffff' : 'rgba(255,255,255,0.6)'
            }}
          >
            <div className="package-header">
              <h3>{pkg.title}</h3>
              {pkg.popular && <span className="popular-badge"><Sparkles size={12} style={{ marginRight: '4px' }} /> Highly Popular</span>}
            </div>
            <div className="package-price">
              {pkg.price}
            </div>
            
            {/* Smooth transition for active package features */}
            <motion.ul 
              className="package-features"
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              {pkg.features.map((f, i) => (
                <li key={i}>
                  <Check className="feature-check-icon" size={15} />
                  <span>{f}</span>
                </li>
              ))}
            </motion.ul>
          </motion.div>
        ))}
      </div>

      <motion.button 
        className="btn-primary" 
        onClick={onNext} 
        disabled={!value}
        whileHover={value ? { scale: 1.02 } : {}}
        whileTap={value ? { scale: 0.98 } : {}}
      >
        Continue <ArrowRight size={20} style={{ marginLeft: '10px' }} />
      </motion.button>
    </StepContainer>
  );
};

export const CustomQueryStep = ({ value = '', formData = {}, onChange, onNext, onBack, index, totalSteps }) => {
  const firstName = formData.full_name ? formData.full_name.split(' ')[0] : '';
  const conversationalTitle = firstName 
    ? `Any special requests for us, ${firstName}?` 
    : "Exploring Customized Partnership?";

  return (
    <StepContainer onBack={onBack} index={index} totalSteps={totalSteps}>
      <h2>{conversationalTitle}</h2>
      <p style={{ maxWidth: '440px', margin: '0 auto 2rem' }}>
        Optional: share details about your target region, special timelines, or key CSR themes.
      </p>
      
      <div className="input-group">
        <div className="input-icon-wrapper">
          <textarea 
            className="input-field" 
            placeholder="I'm looking for a hybrid campaign, custom speakers, or event bundles..." 
            value={value} 
            onChange={(e) => onChange('custom_query', e.target.value)}
            autoFocus
          />
          <MessageSquare className="field-icon" size={22} style={{ top: '1.4rem' }} />
        </div>
      </div>
      
      <motion.button 
        className="btn-primary" 
        onClick={onNext}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Review Application <ArrowRight size={20} style={{ marginLeft: '10px' }} />
      </motion.button>
    </StepContainer>
  );
};

export const FinalReviewStep = ({ formData, onEdit, onSubmit, isSubmitting, onBack, index, totalSteps }) => {
  const getPackageName = (id) => {
    const names = {
      '1_month_coverage': '1 Month Coverage & Amplification',
      '2_month_coverage': '2 Months Coverage & Amplification',
      '4_month_coverage': '4 Months Coverage & Amplification',
      '6_month_coverage': '6 Months Coverage & Amplification',
      '12_month_coverage': '12 Months National Coverage',
      'event_media_partnership': 'Event Media Partnership',
      'newsletter_banner_promotion': 'Newsletter Banner Promotion'
    };
    return names[id] || id;
  };

  const fields = [
    { label: 'Work Email', step: 1, key: 'email' },
    { label: 'Full Name', step: 2, key: 'full_name' },
    { label: 'Designation', step: 3, key: 'designation' },
    { label: 'Phone Number', step: 4, key: 'phone_number' },
    { label: 'Organisation', step: 5, key: 'organization_name' },
    { label: 'Selected Tier', step: 6, key: 'selected_package' },
    { label: 'Custom Queries', step: 7, key: 'custom_query' }
  ];

  // Helper to format values elegantly
  const getFormattedValue = (fieldKey) => {
    const val = formData[fieldKey];
    if (fieldKey === 'selected_package') return getPackageName(val);
    if (!val || val.trim() === '') return 'None';
    return val;
  };

  return (
    <StepContainer onBack={onBack} index={index} totalSteps={totalSteps}>
      <h2>Review Your Details</h2>
      <p style={{ maxWidth: '440px', margin: '0 auto 2rem' }}>
        Confirm everything looks perfect before initiating your impact partnership request.
      </p>
      
      <div className="review-list">
        {fields.map((item, idx) => (
          <motion.div 
            className="review-item" 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
          >
            <div className="review-content">
              <div className="review-label">{item.label}</div>
              <div className="review-value">{getFormattedValue(item.key)}</div>
            </div>
            <motion.button 
              className="btn-review-edit" 
              onClick={() => onEdit(item.step)} 
              aria-label={`Edit ${item.label}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit2 size={15} />
            </motion.button>
          </motion.div>
        ))}
      </div>

      <motion.button 
        className="btn-primary" 
        onClick={onSubmit} 
        disabled={isSubmitting}
        whileHover={!isSubmitting ? { scale: 1.02 } : {}}
        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
      >
        {isSubmitting ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="premium-spinner" style={{ width: '20px', height: '20px', margin: 0, borderWidth: '2px', borderTopColor: '#fff', borderBottomColor: 'rgba(255,255,255,0.3)' }}></span>
            Submitting...
          </span>
        ) : 'Confirm & Submit Application'}
      </motion.button>
    </StepContainer>
  );
};

export const DynamicEventStep = ({ config, onNext, onBack, index, totalSteps }) => {
  return (
    <StepContainer onBack={onBack} index={index} totalSteps={totalSteps}>
      <div className="event-showcase">
        <div className="event-tag">🏆 {config.tag || 'Special Showcase'}</div>
        <h2 style={{ fontSize: '2rem', textAlign: 'left', marginBottom: '0.8rem' }}>{config.title || 'National CSR Summit'}</h2>
        {config.subtitle && <p className="event-subtitle">{config.subtitle}</p>}
        
        <div className="event-image-container">
          <img 
            src={config.image ? config.image.replace(/'/g, '%27') : 'https://via.placeholder.com/800x400'} 
            alt="Event main showcase banner"
            className="event-hero-img"
            onError={(e) => { 
              console.error('Image Load Failed. Attempted URL:', e.target.src);
              e.target.src = 'https://via.placeholder.com/800x400?text=Event+Overview'; 
            }}
          />
        </div>

        {/* Dynamic stat increments representing event impact */}
        <div className="event-stats-grid">
          <div className="event-stat-box">
            <div className="event-stat-val"><CountUp end={500} suffix="+" /></div>
            <div className="event-stat-lbl">CSR Attendees</div>
          </div>
          <div className="event-stat-box">
            <div className="event-stat-val"><CountUp end={35} suffix="+" /></div>
            <div className="event-stat-lbl">Industry Speakers</div>
          </div>
        </div>

        <p className="event-description">
          {config.description || 'Discover key strategies and network with CSR leaders at our upcoming national flagship event.'}
        </p>

        {config.images && config.images.length > 0 && (
          <div className="event-gallery">
            {config.images.map((img, idx) => (
              img && (
                <motion.div 
                  key={idx} 
                  className="gallery-image-box"
                  whileHover={{ scale: 1.05 }}
                >
                  <img 
                    src={img.replace(/'/g, '%27')} 
                    alt={`Event showcase gallery item ${idx}`}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=Event+Highlights'; }}
                  />
                </motion.div>
              )
            ))}
          </div>
        )}

        <motion.button 
          className="btn-primary" 
          onClick={onNext}
          style={{ width: '100%', justifyContent: 'center' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue Partnership Journey <ArrowRight size={20} style={{ marginLeft: '10px' }} />
        </motion.button>
      </div>
    </StepContainer>
  );
};

export const SuccessStep = () => {
  return (
    <StepContainer>
      <div className="success-card">
        <div className="success-check-wrapper">
          <div className="success-check-ring"></div>
          <div className="success-check">
            <CheckCircle size={54} strokeWidth={2.5} />
          </div>
          <div className="success-sparkle sparkle-1" style={{ '--tx': '0px', '--ty': '-30px' }}></div>
          <div className="success-sparkle sparkle-2" style={{ '--tx': '-20px', '--ty': '25px' }}></div>
          <div className="success-sparkle sparkle-3" style={{ '--tx': '-30px', '--ty': '-10px' }}></div>
          <div className="success-sparkle sparkle-4" style={{ '--tx': '30px', '--ty': '10px' }}></div>
        </div>
        
        <h2>Let's Build Impact Together</h2>
        <p style={{ maxWidth: '440px', textAlign: 'center', marginBottom: '2.5rem' }}>
          Your CSR partnership application has been received successfully! Our national accounts team will contact you in under 24 hours to finalize your package details.
        </p>

        <motion.button 
          className="btn-primary" 
          onClick={() => window.location.reload()}
          style={{ background: 'linear-gradient(135deg, var(--secondary-color) 0%, #0284c7 100%)', boxShadow: '0 10px 24px -6px rgba(14, 165, 233, 0.35)' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Return to Portal
        </motion.button>
      </div>
    </StepContainer>
  );
};
