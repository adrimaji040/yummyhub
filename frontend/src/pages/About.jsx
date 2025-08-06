import React from "react";

const About = () => {
  const features = [
    {
      icon: "📅",
      title: "Weekly Planning",
      description:
        "Create and manage your meal plans for the entire week with our intuitive interface.",
    },
    {
      icon: "🥘",
      title: "Recipe Management",
      description:
        "Store, organize, and share your favorite recipes with detailed ingredients and instructions.",
    },
    {
      icon: "🛒",
      title: "Smart Lists",
      description:
        "Generate shopping lists automatically based on your planned meals and recipes.",
    },
    {
      icon: "💡",
      title: "Inspiration",
      description:
        "Discover new recipes and get meal suggestions tailored to your preferences and dietary needs.",
    },
  ];

  const teamMembers = [
    { name: "Lissette Lindao", role: "Lead Developer", initials: "LL" },
    { name: "Adriana Jimenez", role: "Senior Developer", initials: "AJ" },
    { name: "Adam Hadad", role: "UX Designer", initials: "AH" },
    { name: "Nguyendung Vo", role: "Product Manager", initials: "NV" },
  ];

  const contactItems = [
    { icon: "📧", label: "hello@yummyhub.com" },
    { icon: "🐦", label: "@mealplanner" },
    { icon: "💬", label: "Live Chat Support" },
  ];

  const styles = {
    container: {
      minHeight: "100vh",
      background: "#ffffff",
      padding: "2rem",
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    card: {
      maxWidth: "1100px",
      margin: "0 auto",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      borderRadius: "16px",
      //boxShadow: "0 24px 48px rgba(0, 0, 0, 0.15)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      padding: "3rem",
    },
    header: {
      textAlign: "center",
      marginBottom: "3rem",
    },
    logo: {
      width: "80px",
      height: "80px",
      background: "linear-gradient(135deg, rgb(100 108 255), rgb(46 88 52))",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 1rem",
      fontSize: "2rem",
      color: "white",
      animation: "pulse 2s infinite",
    },
    title: {
      fontSize: "2.5rem",
      color: "#212121",
      marginBottom: "0.5rem",
      fontWeight: 700,
      margin: 0,
    },
    subtitle: {
      fontSize: "1.25rem",
      color: "#757575",
      fontWeight: 300,
      margin: 0,
    },
    sectionTitle: {
      color: "#424242",
      marginBottom: "1rem",
      fontSize: "1.75rem",
      fontWeight: 600,
      position: "relative",
      paddingBottom: "0.5rem",
    },
    sectionTitleAfter: {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "50px",
      height: "3px",
      background:
        "linear-gradient(135deg, rgb(129, 199, 132), rgb(51 102 203))",
      borderRadius: "2px",
    },
    text: {
      marginBottom: "1.5rem",
      color: "#424242",
      fontSize: "1.1rem",
      lineHeight: 1.7,
    },
    featuresGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "1.5rem",
      margin: "2rem 0",
    },
    featureCard: {
      background: "linear-gradient(135deg, #fafafa, #f5f5f5)",
      padding: "2rem",
      borderRadius: "12px",
      textAlign: "center",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      border: "1px solid rgba(0, 0, 0, 0.05)",
      cursor: "pointer",
    },
    featureIcon: {
      width: "60px",
      height: "60px",
      background: "linear-gradient(135deg, #1976d2, #9c27b0)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 1rem",
      color: "white",
      fontSize: "1.5rem",
    },
    featureTitle: {
      color: "#212121",
      marginBottom: "0.5rem",
      fontSize: "1.25rem",
      fontWeight: 600,
    },
    featureDesc: {
      color: "#666",
      fontSize: "0.95rem",
      margin: 0,
      lineHeight: 1.5,
    },
    team: {
      textAlign: "center",
      marginTop: "3rem",
      paddingTop: "2rem",
      borderTop: "2px solid #eeeeee",
    },
    teamGrid: {
      display: "flex",
      justifyContent: "center",
      gap: "2rem",
      flexWrap: "wrap",
      marginTop: "2rem",
    },
    teamMember: {
      textAlign: "center",
    },
    teamAvatar: {
      width: "80px",
      height: "80px",
      background: "linear-gradient(135deg, #81c784, #ffb74d)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 0.5rem",
      color: "#333",
      fontSize: "1.5rem",
      fontWeight: "bold",
    },
    teamName: {
      fontSize: "1.1rem",
      fontWeight: 600,
      margin: "0.5rem 0 0.25rem 0",
      color: "#212121",
    },
    teamRole: {
      fontSize: "0.9rem",
      color: "#757575",
      margin: 0,
    },
    contact: {
      background: "linear-gradient(135deg, rgb(25, 118, 210), rgb(46 88 52))",
      color: "white",
      padding: "2rem",
      borderRadius: "12px",
      textAlign: "center",
      marginTop: "2rem",
    },
    contactTitle: {
      color: "white",
      marginBottom: "1rem",
      fontSize: "1.75rem",
      fontWeight: 600,
    },
    contactText: {
      color: "rgba(255, 255, 255, 0.9)",
      marginBottom: "1.5rem",
      fontSize: "1.1rem",
    },
    contactGrid: {
      display: "flex",
      justifyContent: "center",
      gap: "1.5rem",
      flexWrap: "wrap",
    },
    contactItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      color: "rgba(255, 255, 255, 0.9)",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      padding: "0.5rem 1rem",
      borderRadius: "20px",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      transition: "background-color 0.3s ease",
    },
    divider: {
      margin: "2rem 0",
      border: "none",
      height: "1px",
      background: "#e0e0e0",
    },
  };

  const handleFeatureHover = (e) => {
    e.target.style.transform = "translateY(-5px)";
    e.target.style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.1)";
  };

  const handleFeatureLeave = (e) => {
    e.target.style.transform = "translateY(0)";
    e.target.style.boxShadow = "none";
  };

  const handleContactHover = (e) => {
    e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
  };

  const handleContactLeave = (e) => {
    e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          @media (max-width: 768px) {
            .about-card {
              padding: 2rem 1rem !important;
            }
            .about-title {
              font-size: 2rem !important;
            }
            .features-grid {
              grid-template-columns: 1fr !important;
            }
            .contact-grid {
              flex-direction: column !important;
              gap: 1rem !important;
            }
          }
        `}
      </style>

      <div style={styles.container}>
        <div style={styles.card} className="about-card">
          {/* Header Section */}
          <div style={styles.header}>
            <div style={styles.logo}>🍽️</div>
            <h1 style={styles.title} className="about-title">
              Effortless Eats
            </h1>
            <p style={styles.subtitle}>
              Satisfy your cravings in a flash! Explore our Quick & Easy Meals
            </p>
          </div>

          {/* Mission Section */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ ...styles.sectionTitle, position: "relative" }}>
              Our Mission
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "50px",
                  height: "3px",
                  background: "linear-gradient(135deg, #f44336, #ff9800)",
                  borderRadius: "2px",
                }}
              ></div>
            </h2>
            <p style={styles.text}>
              We believe that meal planning should be simple, enjoyable, and
              accessible to everyone. Our platform helps you organize your
              weekly meals, discover new recipes, and maintain a healthy
              lifestyle without the stress of daily meal decisions.
            </p>
          </div>

          {/* Features Section */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ ...styles.sectionTitle, position: "relative" }}>
              What We Offer
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "50px",
                  height: "3px",
                  background: "linear-gradient(135deg, #f44336, #ff9800)",
                  borderRadius: "2px",
                }}
              ></div>
            </h2>
            <div style={styles.featuresGrid} className="features-grid">
              {features.map((feature, index) => (
                <div
                  key={index}
                  style={styles.featureCard}
                  onMouseEnter={handleFeatureHover}
                  onMouseLeave={handleFeatureLeave}
                >
                  <div style={styles.featureIcon}>{feature.icon}</div>
                  <h3 style={styles.featureTitle}>{feature.title}</h3>
                  <p style={styles.featureDesc}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ ...styles.sectionTitle, position: "relative" }}>
              Why Choose Us?
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "50px",
                  height: "3px",
                  background: "linear-gradient(135deg, #f44336, #ff9800)",
                  borderRadius: "2px",
                }}
              ></div>
            </h2>
            <p style={styles.text}>
              Our meal planning application is designed with simplicity and
              functionality in mind. Whether you're a busy professional, a
              parent juggling multiple schedules, or someone looking to eat
              healthier, our tools adapt to your lifestyle and help you stay
              organized.
            </p>
            <p style={styles.text}>
              We're committed to making meal planning an enjoyable part of your
              routine, not a chore. Join thousands of users who have already
              simplified their meal planning with our platform.
            </p>
          </div>

          <hr style={styles.divider} />

          {/* Team Section */}
          <div style={styles.team}>
            <h2 style={styles.sectionTitle}>Meet the Team</h2>
            <div style={styles.teamGrid}>
              {teamMembers.map((member, index) => (
                <div key={index} style={styles.teamMember}>
                  <div style={styles.teamAvatar}>{member.initials}</div>
                  <h4 style={styles.teamName}>{member.name}</h4>
                  <p style={styles.teamRole}>{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div style={styles.contact}>
            <h2 style={styles.contactTitle}>Get in Touch</h2>
            <p style={styles.contactText}>
              Have questions, suggestions, or feedback? We'd love to hear from
              you!
            </p>
            <div style={styles.contactGrid} className="contact-grid">
              {contactItems.map((item, index) => (
                <div
                  key={index}
                  style={styles.contactItem}
                  onMouseEnter={handleContactHover}
                  onMouseLeave={handleContactLeave}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
