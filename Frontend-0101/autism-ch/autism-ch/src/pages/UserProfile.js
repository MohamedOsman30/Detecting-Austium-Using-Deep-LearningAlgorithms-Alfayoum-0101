import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faCircleUser, faCamera, faGear, faArrowRightFromBracket, faCheck } from "@fortawesome/free-solid-svg-icons";
import Header from "../comps/header";
import Footer from "../comps/footer";
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";
const UserProfile = () => {
  const [user, setUser] = useState(null);
 const { language } = useLanguage();
  const t = useTrans();


  const loadUserData = () => {
    const authToken = localStorage.getItem("authToken"); 
    if (authToken) {
      const savedUser = localStorage.getItem(`userData_${authToken}`); 
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  };

 
  useEffect(() => {
    loadUserData(); 

    
    const handleStorageChange = (event) => {
      if (event.key === `userData_${localStorage.getItem("authToken")}`) { 
        loadUserData();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); 

  
  const handleLogout = () => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      localStorage.removeItem(`userData_${authToken}`); 
    }
    localStorage.removeItem("authToken"); 
    window.location.href = "/";
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <main className={`video-page ${language === "ar" ? "rtl" : "ltr"}`}>
      <Header />
      <h1 className="welcome-message">{t("Welcome")}, {user.first_name} 👋</h1>
      <div className="user-profile-container">
        <div className="sidebar">
          <div className="user-avatar-section">
            <div className="user-avatar">
              {user.photo ? (
                <img src={`http://project-api.com/${user.photo}`} alt="Profile" className="profile-photo" />
              ) : (
                <div className="icon-user">
                  <FontAwesomeIcon icon={faCircleUser} size="2xl" />
                </div>
              )}
            </div>
          </div>
          <div className="sidebar-links up">
            <div className="settings-link">
            <Link className="settings-link" to="/useredit">
              <FontAwesomeIcon className='icon-set' icon={faGear} size="2xl" />
              <p className="sidebar-button settings-button">{t("AccountSettings")}</p>
              </Link>
            </div>
             <div className="logout-link">
                         <FontAwesomeIcon className="icon-set" icon={faArrowRightFromBracket} size="2xl" />
                         <p
                           onClick={handleLogout}
                           className="sidebar-button logout-button"
                           style={{ cursor: "pointer" }}
                         >
                           {t("Logout")}
                         </p>
                       </div>
          </div>
          
        </div>

        <div className="main-content">
          <div className="info-card">
            <h2 className="info-title">{t("YourInfo")}</h2>
            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">{t("FirstName")}</label>
                <div className="input-container">
                  <input type="text" className="info-input" value={user.first_name} readOnly />
                  <FontAwesomeIcon className="icon-check" icon={faCheck} size="2xl" />
                </div>
              </div>
              <div className="info-item">
                <label className="info-label">{t("LastName")}</label>
                <div className="input-container">
                  <input type="text" className="info-input" value={user.last_name} readOnly />
                  <FontAwesomeIcon className="icon-check" icon={faCheck} size="2xl" />
                </div>
              </div>
              <div className="info-item">
                <label className="info-label">{t("Email")}</label>
                <p className="email-com">
                {t("Youremailaddresslinkedto")} AutismChampions.com
                </p>
                <div className="input-container">
                  <input type="text" className="info-input" value={user.email} readOnly />
                  <FontAwesomeIcon className="icon-check" icon={faCheck} size="2xl" />
                </div>
              </div>
              <div className="info-item">
                <label className="info-label">{t("AccountStatus")}</label>
                <div className="input-container">
                  <input type="text" className="info-input" value="Active" readOnly />
                  <FontAwesomeIcon className="icon-check" icon={faCheck} size="2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      </main>
    
    
  );
};

export default UserProfile;


