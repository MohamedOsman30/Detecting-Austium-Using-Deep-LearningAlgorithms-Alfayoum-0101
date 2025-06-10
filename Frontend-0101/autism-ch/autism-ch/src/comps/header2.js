import React, { useState, useRef, useEffect } from "react";
import Logo from "../assets/Photo/WhatsApp_Image_2024-11-03_at_6.21.50_PM__1_-removebg-preview.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faGear } from "@fortawesome/free-solid-svg-icons";
import SettingsDropdown from "../pages/SettingsDropdown";
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";
const Header2 = () => {
  const { language, setLanguage } = useLanguage();
    const t = useTrans();
  const [showDropdown, setShowDropdown] = useState(false);
  const [doctor, setDoctor] = useState({ photo: "" }); // Initialize doctor state
  const dropdownRef = useRef(null);

  const loadDoctorData = () => {
    const authToken = localStorage.getItem("authToken"); 
    if (authToken) {
      const savedDoctor = localStorage.getItem(`doctorData_${authToken}`);
      if (savedDoctor) {
        setDoctor(JSON.parse(savedDoctor));
      }
    }
  };

  const profile = () => {
    // Add your profile click handler logic here
    console.log("Profile clicked");
  };

  useEffect(() => {
    loadDoctorData();
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className={language === "ar" ? "rtl" : "ltr"}>
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand custom-navbar-brand" href="#">
          <img src={Logo} alt="Logo" className="logo" />
          <span className="name">{t("AUTISMCHAMPIONS")}</span>
        </a>

        <div className="d-flex align-items-center gap-3 ms-auto" ref={dropdownRef}>
          <FontAwesomeIcon
            icon={faGear}
            className="usericon2"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          <div className={`dropdown-menu ${showDropdown ? "show" : ""}`}>
            <SettingsDropdown />
          </div>
          <div className="language-switcher">
                <button 
                  onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
                  aria-label={language === "ar" ? "Switch to English" : "التغيير إلى العربية"}
                >
                  {language === "ar" ? "EN" : "AR"}
                </button>
              </div>
          <div className="user-profile">
            <img
              src={`http://project-api.com/${doctor.photo}`} 
              alt="Profile"
              style={{ 
                width: "35px", 
                height: "35px", 
                borderRadius: "50%", 
                marginTop: "10px", 
                cursor: 'pointer' 
              }}
              onClick={profile}
            />
          </div>
        </div>
      </div>
    </nav>
    </header>
  );
};

export default Header2;