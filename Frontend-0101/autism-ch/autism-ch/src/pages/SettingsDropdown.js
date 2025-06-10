import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faUserPen, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";
const SettingsDropdown = ({ onLogout }) => {
  const [doctor, setDoctor] = useState(null);
const { language, setLanguage } = useLanguage();
      const t = useTrans();
  const loadDoctorData = () => {
    const authToken = localStorage.getItem("authToken"); 
    if (authToken) {
      const savedDoctor = localStorage.getItem(`doctorData_${authToken}`);
      if (savedDoctor) {
        setDoctor(JSON.parse(savedDoctor));
      }
    }
  };

  useEffect(() => {
    loadDoctorData(); 
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(`doctorData_${localStorage.authToken}`);
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
    <main className={`video-page ${language === "ar" ? "rtl" : "ltr"}`}>
    <div className="settings-dropdown-container">
      <h4 className="dropdown-header">{t("Welcome")}, Dr. {doctor.first_name} 👋</h4>
      <hr />
      <Link className="settings-link" to="/docEdit">
      <div className="icon22">
      <FontAwesomeIcon icon={faUserPen} className="i1" />
      <span className="dropdown-item">{t("ProfileSettings")}</span>
      </div>
      </Link>
      <Link className="settings-link" to="/schdule">
      <div className="icon22"><FontAwesomeIcon icon={faCalendarDays} className="i1" />
      <span className="dropdown-item">{t("ManageMySchedule")}</span></div>
      </Link>
      <div className="icon22" onClick={handleLogout}>
      <FontAwesomeIcon className=' i1' icon={faArrowRightFromBracket} />
      <span className="dropdown-item">{t("SignOut")}</span>
      </div>
    </div>
    </main>
  );
};

export default SettingsDropdown;