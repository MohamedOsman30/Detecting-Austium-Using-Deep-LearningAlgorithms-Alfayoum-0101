import React, { useEffect, useState } from 'react';
import Footer from "../comps/footerLink2";
import Header2 from "../comps/header2"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons';
import { faBed } from '@fortawesome/free-solid-svg-icons';
import { faCommentDots } from '@fortawesome/free-regular-svg-icons';

import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";
const DocProf = () => {
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

 
  const schedule = [
    { 
      day: doctor.Day1, 
      timeSlots: [
        `${doctor.time1} AM - 12 PM`,  // Morning slot
        `1 PM - ${doctor.time2-12} PM`   // Afternoon slot
      ] 
    },
    { 
      day: doctor.Day2, 
      timeSlots: [
        `${doctor.time1} AM - 12 PM`,  // Morning slot
        `1 PM - ${doctor.time2-12} PM`    // Afternoon slot
      ] 
    }
  ];

  return (
    <main className={`video-page ${language === "ar" ? "rtl" : "ltr"}`}>
      <Header2/>
      <h1 className="welcome-message">{t("Welcome")}, Dr.{doctor.first_name}👋</h1>
      <div className="user-profile-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="user-avatar-section">
            <div className="user-avatar">
              {doctor.photo ? (
                <img src={`http://project-api.com/${doctor.photo}`} alt="Profile" className="profile-photo" />
              ) : (
                <div className="icon-user">
                  <FontAwesomeIcon icon={faCircleUser} size="2xl" />
                </div>
              )}
            </div>
          </div>
          <h2 className="user-name">Dr.{doctor.first_name} {doctor.last_name}</h2>
          <div className="sidebar-links icon-set2">
            <div className="settings-link ">
              <Link className="settings-link" to="/docProf">
                <FontAwesomeIcon icon={faUserDoctor} className='icon-set  ' />
                <p className="sidebar-button settings-button">{t("Profile")}</p>
              </Link>
            </div>
            <div className="settings-link">
              <Link className="settings-link" to="/appointemnt">
                <FontAwesomeIcon icon={faCalendarDays} className='icon-set'/>
                <p className="sidebar-button settings-button">{t("Appointement")}</p>
              </Link>
            </div>
            <div className="settings-link">
              <Link className="settings-link" to="/Patients">
                <FontAwesomeIcon icon={faBed} className='icon-set'/>
                <p className="sidebar-button settings-button">{t("Patients")}</p>
              </Link>
            </div>
            <div className="settings-link">
              <Link className="settings-link" to="http://chatapp.com/login.php" target="_blank">
                <FontAwesomeIcon icon={faCommentDots} className='icon-set'/>
                <p className="sidebar-button settings-button">{t("FollowUPChats")}</p>
              </Link>
            </div>
            <div className="logout-link" onClick={handleLogout}>
                         <FontAwesomeIcon className="icon-set" icon={faArrowRightFromBracket} size="2xl" />
                         <p className="sidebar-button logout-button" style={{ cursor: 'pointer' }}>{t("Logout")}</p>
                       </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="info-card">
            <h2 className="info-title22">{t("PersonalInformation")}</h2>
            <div className="info-grid-doc">
              <div className="info-item-doc">
                <label className="info-label-doc">{t("FullName")}</label>
                <div className="input-container-doc">
                  <input type="text" className="info-input-doc" value={`${doctor.first_name} ${doctor.last_name}`} readOnly />
                  <FontAwesomeIcon className='icon-check-doc' icon={faCheck} size="xl" />
                </div>
              </div>
              <div className="info-item-doc">
                <label className="info-label-doc">{t("EmailAddress")}</label>
                <div className="input-container-doc">
                  <input type="email" className="info-input-doc" value={doctor.email} readOnly />
                  <FontAwesomeIcon className='icon-check-doc' icon={faCheck} size="xl" />
                </div>
              </div>
              <div className="info-item-doc">
                <label className="info-label-doc">{t("Specialty")}</label>
                <div className="input-container-doc">
                  <input type="text" className="info-input-doc" value={doctor.title} readOnly />
                  <FontAwesomeIcon className='icon-check-doc' icon={faCheck} size="xl" />
                </div>
              </div>
              <div className="info-item-doc">
                <label className="info-label-doc">{t("PhoneNumber")}</label>
                <div className="input-container-doc">
                  <input type="number" className="info-input-doc" value={doctor.phone_number} readOnly />
                  <FontAwesomeIcon className='icon-check-doc' icon={faCheck} size="xl" />
                </div>
              </div>
            </div>
            
            <h2 className="info-title22">{t("TimeTable")}</h2>
            <div className="container-time">
              <div className="table-wrapper-prof">
                <div className="table-content">
                  {schedule.map((daySchedule, index) => (
                    <React.Fragment key={index}>
                      {daySchedule.timeSlots.map((time, timeIndex) => (
                        <div key={`${index}-${timeIndex}`} className="table-row">
                          <div className="day">
                            <span className="icon-prof">&#x1F551;</span>
                            <span className="day-name">{daySchedule.day}</span>
                          </div>
                          <span className="time">
                            Time: <span className="highlight">{time}</span>
                          </span>
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </main>
  );
}

export default DocProf;