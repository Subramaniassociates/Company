import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const locationRef = useRef(null);
  const contactRef = useRef(null);
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [serviceText, setServiceText] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const [typingText, setTypingText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Services text rotation
  const servicesTexts = [
    "Your trusted partner for professional auditing solutions",
    "Your reliable partner for comprehensive tax services",
    "Your expert partner for GST filing and compliance",
    "Your dedicated partner for financial consulting",
    "Your professional partner for business registration services",
    "Your strategic partner for loan and project documentation"
  ];

  // Hero background images
  const heroImages = [
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
  ];

  // Function to handle WhatsApp click
  const handleWhatsAppClick = () => {
    const phoneNumber = '9791562237';
    const message = 'Hello, I would like to know more about your auditing services.';
    const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Function to handle email click
  const handleEmailClick = () => {
    const email = 'subramaniassociateshsr@gmail.com';
    const subject = 'Auditing Services Inquiry';
    const body = 'Hello, I am interested in your auditing services. Please provide more information.';
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu when clicking on a link
  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    // Rotate service text every 3 seconds
    const textInterval = setInterval(() => {
      setServiceText((prev) => (prev + 1) % servicesTexts.length);
    }, 3000);

    // Rotate hero images every 2 seconds
    const imageInterval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 2000);

    return () => {
      clearInterval(textInterval);
      clearInterval(imageInterval);
    };
  }, [servicesTexts.length, heroImages.length]);

  useEffect(() => {
    // Typing effect for the last word of service text
    const currentServiceText = servicesTexts[serviceText];
    const words = currentServiceText.split(' ');
    const lastWord = words[words.length - 1];
    const baseText = words.slice(0, -1).join(' ') + ' ';

    if (!isDeleting && typingIndex < lastWord.length) {
      // Typing forward
      const timeout = setTimeout(() => {
        setTypingText(baseText + lastWord.substring(0, typingIndex + 1));
        setTypingIndex(typingIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else if (!isDeleting && typingIndex === lastWord.length) {
      // Pause at the end
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 1000);
      return () => clearTimeout(timeout);
    } else if (isDeleting && typingIndex > 0) {
      // Deleting backward
      const timeout = setTimeout(() => {
        setTypingText(baseText + lastWord.substring(0, typingIndex - 1));
        setTypingIndex(typingIndex - 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else if (isDeleting && typingIndex === 0) {
      // Finished deleting, reset for next text
      setIsDeleting(false);
    }
  }, [serviceText, typingIndex, isDeleting, servicesTexts]);

  useEffect(() => {
    // Initialize typing text
    const currentServiceText = servicesTexts[serviceText];
    const words = currentServiceText.split(' ');
    const lastWord = words[words.length - 1];
    const baseText = words.slice(0, -1).join(' ') + ' ';
    setTypingText(baseText);
    setTypingIndex(0);
    setIsDeleting(false);
  }, [serviceText, servicesTexts]);

  useEffect(() => {
    // Starfield animation
    const createStars = () => {
      const hero = heroRef.current;
      if (!hero) return;

      // Clear existing stars
      const existingStars = hero.querySelectorAll('.star');
      existingStars.forEach(star => star.remove());

      for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        hero.appendChild(star);
      }
    };

    createStars();

    // Scroll animations and section tracking
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
          entry.target.classList.add('section-visible');
        }
      });
    }, observerOptions);

    // Animation observer for elements
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });

    // Observe sections for active state
    if (aboutRef.current) sectionObserver.observe(aboutRef.current);
    if (servicesRef.current) sectionObserver.observe(servicesRef.current);
    if (locationRef.current) sectionObserver.observe(locationRef.current);
    if (contactRef.current) sectionObserver.observe(contactRef.current);

    // Observe elements for animations
    document.querySelectorAll('.service-card, .about-content, .contact-form, .stat, .contact-item, .map-container').forEach(el => {
      animationObserver.observe(el);
    });

    // Smooth scroll for navigation links
    const handleSmoothScroll = (e) => {
      e.preventDefault();
      const targetId = e.target.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    };

    // Add click event listeners to nav links
    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
      link.addEventListener('click', handleSmoothScroll);
    });

    return () => {
      sectionObserver.disconnect();
      animationObserver.disconnect();
      document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.removeEventListener('click', handleSmoothScroll);
      });
    };
  }, []);

  return (
    <div className="app">
      {/* Navbar Section */}
<nav className={`navbar ${activeSection !== 'home' ? 'scrolled' : ''}`}>
  <div className="logo">
  
    {/* or if using public folder */}
    <img src={`${process.env.PUBLIC_URL}/logo1.png`} alt="Logo" className="logo-img" />
    <span>Subramani & Associates</span>
  </div>
  <ul className={`nav-links ${isMenuOpen ? 'nav-active' : ''}`}>
    <li>
      <a 
        href="#home" 
        className={activeSection === 'home' ? 'active' : ''} 
        onClick={handleNavClick}
      >
        <i className="fas fa-home"></i> Home
      </a>
    </li>
    <li>
      <a 
        href="#about" 
        className={activeSection === 'about' ? 'active' : ''} 
        onClick={handleNavClick}
      >
        <i className="fas fa-info-circle"></i> About
      </a>
    </li>
    <li>
      <a 
        href="#services" 
        className={activeSection === 'services' ? 'active' : ''} 
        onClick={handleNavClick}
      >
        <i className="fas fa-cogs"></i> Services
      </a>
    </li>
    <li>
      <a 
        href="#location" 
        className={activeSection === 'location' ? 'active' : ''} 
        onClick={handleNavClick}
      >
        <i className="fas fa-map-marker-alt"></i> Location
      </a>
    </li>
    <li>
      <a 
        href="#contact" 
        className={activeSection === 'contact' ? 'active' : ''} 
        onClick={handleNavClick}
      >
        <i className="fas fa-envelope"></i> Contact
      </a>
    </li>
  </ul>
  <div className="menu-toggle" onClick={toggleMenu}>
    <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
  </div>
</nav>

      {/* Hero Section */}
      <section id="home" className="hero" ref={heroRef}>
        {/* Background Images */}
        {heroImages.map((image, index) => (
          <div 
            key={index}
            className={`hero-bg-image ${index === currentImage ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        ))}
        
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-word">Welcome to</span>
              <span className="title-word highlight">Subramani & Associates</span>
			   <span className="title-word highlight">Auditor &  Tax Consultants</span>
            </h1>
            <p className="hero-subtitle">
              {typingText}
              <span className="cursor">|</span>
            </p>
            <div className="hero-buttons">
              <a href="#services" className="btn btn-primary">
                <i className="fas fa-rocket"></i> Our Services
              </a>
              <a href="#contact" className="btn btn-secondary">
                <i className="fas fa-phone-alt"></i> Get Started
              </a>
            </div>
          </div>
        </div>
      </section>

 {/* Services Section */}
<section id="services" className="section services" ref={servicesRef}>
  <div className="container">
    <h2 className="section-title">Our Services</h2>
    <div className="services-cards">

      {/* Financial Auditing */}
      <div className="service-card">
        <div className="service-icon">
          <i className="fas fa-file-invoice-dollar"></i>
        </div>
        <h3>Financial Auditing</h3>
        <p>Detailed analysis and verification of financial statements with precision and expertise.</p>
        <ul>
		<li><i className="fas fa-check"></i> Accounting & Bookkeeping</li>
          <li><i className="fas fa-check"></i> Financial Statement Review</li>
          <li><i className="fas fa-check"></i> Transaction Verification</li>
          <li><i className="fas fa-check"></i> Asset Valuation</li>
        </ul>
      </div>
	   {/* Income Tax */}
      <div className="service-card">
        <div className="service-icon">
          <i className="fas fa-receipt"></i>
        </div>
        <h3>Income Tax</h3>
        <p>Complete income tax filing and planning services.</p>
        <ul>
          <li><i className="fas fa-check"></i> Income Tax Filing</li>
          <li><i className="fas fa-check"></i> Tax Planning</li>
        </ul>
      </div>

      {/* GST Filing */}
      <div className="service-card">
        <div className="service-icon">
          <i className="fas fa-file-invoice"></i>
        </div>
        <h3>GST Filing</h3>
        <p>Hassle-free GST registration, filing, and compliance services.</p>
        <ul>
          <li><i className="fas fa-check"></i> GST Registration</li>
          <li><i className="fas fa-check"></i> Monthly/Quarterly Filing</li>
          <li><i className="fas fa-check"></i> GST Compliance</li>
        </ul>
      </div>


      

     
      {/* TDS Management */}
      <div className="service-card">
        <div className="service-icon">
          <i className="fas fa-percentage"></i>
        </div>
        <h3>TDS Management</h3>
        <p>Comprehensive TDS return filing and management services.</p>
        <ul>
          <li><i className="fas fa-check"></i> TDS Filing</li>
          <li><i className="fas fa-check"></i> Deduction Management</li>
          <li><i className="fas fa-check"></i> Compliance Support</li>
        </ul>
      </div>

      {/* Project Reports */}
      <div className="service-card">
        <div className="service-icon">
          <i className="fas fa-file-contract"></i>
        </div>
        <h3>Project Reports</h3>
        <p>Professional documentation and preparation of project reports.</p>
        <ul>
          <li><i className="fas fa-check"></i> Detailed Project Report Preparation</li>
          <li><i className="fas fa-check"></i> Feasibility Analysis</li>
          <li><i className="fas fa-check"></i> Financial Projections</li>
        </ul>
      </div>

      {/* Bank Loans */}
      <div className="service-card">
        <div className="service-icon">
          <i className="fas fa-university"></i>
        </div>
        <h3>Bank Loans</h3>
        <p>Assistance in obtaining business and personal loans with proper guidance.</p>
        <ul>
          <li><i className="fas fa-check"></i> Loan Consultation</li>
          <li><i className="fas fa-check"></i> Documentation Support</li>
          <li><i className="fas fa-check"></i> Bank Coordination</li>
        </ul>
      </div>

      {/* Registration Services */}
      <div className="service-card">
        <div className="service-icon">
          <i className="fas fa-id-card"></i>
        </div>
        <h3>Registration Services</h3>
        <p>Complete documentation and registration services for businesses.</p>
        <ul>
		     <li><i className="fas fa-check"></i> Company Registration</li>
			 <li><i className="fas fa-check"></i> Partnership Deed Registration</li>	
          <li><i className="fas fa-check"></i> New PAN and TAN Registration</li>
          <li><i className="fas fa-check"></i> MSME Registration</li>
		  <li><i className="fas fa-check"></i> ESI & PF Registration</li>

        </ul>
      </div>
	  {/* Compliance Check */}
      <div className="service-card">
        <div className="service-icon">
          <i className="fas fa-shield-alt"></i>
        </div>
        <h3>Compliance Check</h3>
        <p>Ensure your business meets regulatory and statutory requirements seamlessly.</p>
        <ul>
          <li><i className="fas fa-check"></i> Regulatory Compliance</li>
          <li><i className="fas fa-check"></i> Policy Assessment</li>
          <li><i className="fas fa-check"></i> Documentation Review</li>
        </ul>
      </div>

      {/* Risk Assessment */}
      <div className="service-card">
        <div className="service-icon">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <h3>Risk Assessment</h3>
        <p>Identify and mitigate financial risks effectively with proactive strategies.</p>
        <ul>
          <li><i className="fas fa-check"></i> Risk Analysis</li>
          <li><i className="fas fa-check"></i> Mitigation Planning</li>
          <li><i className="fas fa-check"></i> Continuous Monitoring</li>
        </ul>
      </div>

    </div>
  </div>
</section>

      {/* Rest of your components remain the same */}
      {/* About Section */}
      <section id="about" className="section about" ref={aboutRef}>
        <div className="container">
          <h2 className="section-title">About Us</h2>
          <div className="about-content">
            <div className="about-text">
              <p>
                <i className="fas fa-star"></i> <strong>Subramani Associates</strong> is a premier auditing and financial services firm with over 15 years of experience in providing comprehensive business solutions. We specialize in delivering expert auditing, taxation, and financial consulting services tailored to meet the unique needs of each client.
              </p>
              <p>
                <i className="fas fa-star"></i> Our team of certified professionals is committed to ensuring financial accuracy, regulatory compliance, and business growth for organizations of all sizes. We pride ourselves on building long-term relationships with our clients based on trust, integrity, and exceptional service delivery.
              </p>
              <p>
                <i className="fas fa-star"></i> Located in the heart of the business district, we serve clients across various industries with personalized attention and innovative solutions that drive success and sustainability.
              </p>
            </div>
            
            <div className="about-stats">
              <div className="stats">
                <div className="stat">
                  <i className="fas fa-users"></i>
                  <h3>200+</h3>
                  <p>Happy Clients</p>
                </div>
                <div className="stat">
                  <i className="fas fa-chart-bar"></i>
                  <h3>99%</h3>
                  <p>Success Rate</p>
                </div>
                <div className="stat">
                  <i className="fas fa-award"></i>
                  <h3>15+</h3>
                  <p>Years Experience</p>
                </div>
                <div className="stat">
                  <i className="fas fa-check-circle"></i>
                  <h3>500+</h3>
                  <p>Projects Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      



{/* Location Section */}
<section id="location" className="section location" ref={locationRef}>
  <div className="container">
    <h2 className="section-title">Our Location</h2>
    <div className="map-container">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2023.1943748494805!2d77.8201816657244!3d12.714067383684533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae70a415037bc9%3A0xd099a4963a9343ab!2sPrakash%20Nagar%2C%20Dinnur%2C%20Hosur%2C%20Tamil%20Nadu%20635109!5e1!3m2!1sen!2sin!4v1759568722600!5m2!1sen!2sin"
        width="100%"
        height="450"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Subramani Associates Location"
      ></iframe>
    </div>
  </div>
</section>


     {/* Contact Section */}
<section id="contact" className="section contact" ref={contactRef}>
  <div className="container">
    <h2 className="section-title">Contact Us</h2>
    <div className="contact-content">
      <div className="contact-info">
        <div className="contact-item">
          <i className="fas fa-map-marker-alt"></i>
          <div>
            <h3>Visit Us</h3>
            <p>Dinnur, Tamil Nadu 635109</p>
          </div>
        </div>
        <div className="contact-item clickable" onClick={handleWhatsAppClick}>
          <i className="fas fa-phone"></i>
          <div>
            <h3>Call Us / WhatsApp</h3>
            <p className="contact-link">+91 97915 62237</p>
          </div>
        </div>
        <div className="contact-item clickable" onClick={handleEmailClick}>
          <i className="fas fa-envelope"></i>
          <div>
            <h3>Email Us</h3>
            <p className="contact-link">subramaniassociateshsr@gmail.com</p>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <form
        className="contact-form"
        onSubmit={(e) => {
          e.preventDefault(); // prevent page refresh
          const name = e.target[0].value;
          const email = e.target[1].value;
          const message = e.target[2].value;

          // Construct WhatsApp message
          const whatsappMessage = `Hello, I am ${name}.%0AEmail: ${email}%0A%0A${message}`;

          // Open WhatsApp
          window.open(
            `https://wa.me/919791562237?text=${whatsappMessage}`,
            "_blank"
          );
        }}
      >
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <textarea placeholder="Your Message" rows="5" required></textarea>
        <button type="submit" className="btn btn-primary">
          <i className="fas fa-paper-plane"></i> Send Message
        </button>
      </form>
    </div>
  </div>
</section>

      {/* Footer Section */}
<footer>
  <div className="footer-content">
    <div className="footer-section">
      <div className="logo">
       <img src={`${process.env.PUBLIC_URL}/logo1.png`} alt="Logo" className="logo-img" />
        Subramani Associates
      </div>
      <p>Professional auditing and financial solutions for modern businesses.</p>
      <div className="social-links">
        <a href="#"><i className="fab fa-facebook"></i></a>
        <a href="#"><i className="fab fa-twitter"></i></a>
        <a href="#"><i className="fab fa-linkedin"></i></a>
        <a href="https://www.instagram.com/Subramani_mani_07/" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-instagram"></i>
        </a>
      </div>
    </div>
    <div className="footer-section">
      <h3>Quick Links</h3>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#location">Location</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>
    <div className="footer-section">
      <h3>Contact Info</h3>
      <ul>
  <li className="clickable" onClick={handleWhatsAppClick}>
    <i className="fab fa-whatsapp"></i> +91 97915 62237, +91 99654 33311
  </li>
  <li className="clickable" onClick={handleEmailClick}>
    <i className="fas fa-envelope"></i> subramaniassociateshsr@gmail.com
  </li>
  <li className="clickable">
    <i className="fas fa-map-marker-alt"></i> No.47/5, 1st floor, Prakash Nagar, Denkanikottai Main Road, Dinnur, Hosur-635109
  </li>
</ul>

    </div>
  </div>
  <div className="footer-bottom">
    &copy; 2025 Subramani Associates. All rights reserved.
  </div>
</footer>
    </div>
  );
}

export default App;
