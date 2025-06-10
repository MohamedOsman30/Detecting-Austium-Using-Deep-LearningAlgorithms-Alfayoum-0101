import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";
import Login from "../pages/login";
import Signup from "../pages/signup";
import Logo from "../assets/Photo/WhatsApp_Image_2024-11-03_at_6.21.50_PM__1_-removebg-preview.png";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

const Header = () => {
  const { language, setLanguage } = useLanguage();
  const t = useTrans();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Load user data from localStorage
  useEffect(() => {
    const loadUserData = () => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        const savedUser = localStorage.getItem(`userData_${authToken}`);
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      }
    };

    loadUserData();

    const handleStorageChange = () => {
      loadUserData();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const navigateToProfile = () => {
    window.location.href = "/UserProfile";
  };

  return (
    <header className={language === "ar" ? "rtl" : "ltr"}>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid header">
          <img src={Logo} alt="Autism Champions Logo" className="logo" />
          <div className="navbar-brand name">{t("AUTISMCHAMPIONS")}</div>
          
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse header" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <Link className="nav-link" to="/">{t("HOME")}</Link>
              <Link className="nav-link" to="/detection">{t("DETECTION")}</Link>
              <Link className="nav-link" to="/videos">{t("VIDEOS")}</Link>
              <Link className="nav-link" to="/articles">{t("ARTICLES")}</Link>
              <Link className="nav-link" to="/booking">{t("BOOKING")}</Link>
              
              <div className="language-switcher">
                <button 
                  onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
                  aria-label={language === "ar" ? "Switch to English" : "التغيير إلى العربية"}
                >
                  {language === "ar" ? "EN" : "AR"}
                </button>
              </div>

              {user ? (
                <div className="user-profile">
                  <img
                    src={`http://project-api.com/${user.photo}`}
                    alt={t("PROFILE_PICTURE")}
                    className="profile-picture"
                    style={{ width: "35px", height: "35px", borderRadius: "50%", marginTop: "10px", cursor: 'pointer' }}
                    onClick={navigateToProfile}
                  />
                </div>
              ) : (
                <button 
                  onClick={() => setIsLoginOpen(true)} 
                  className="open-login-btn"
                  aria-label={t("LOGIN")}
                >
                  <FontAwesomeIcon icon={faUser} className="usericon" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Login
        isOpen={isLoginOpen}
        closeModal={() => setIsLoginOpen(false)}
        openSignUp={() => {
          setIsLoginOpen(false);
          setIsSignUpOpen(true);
        }}
        onLoginSuccess={handleLoginSuccess}
      />

      <Signup 
        isOpen={isSignUpOpen} 
        closeModal={() => setIsSignUpOpen(false)} 
      />
    </header>
  );
};

export default Header;