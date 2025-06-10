import React, { useState, useEffect } from 'react';
import Footer from "../comps/footerLink2";
import Header2 from "../comps/header2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faCalendarDays, faCommentDots } from '@fortawesome/free-regular-svg-icons';
import { faCamera, faArrowRightFromBracket, faUserDoctor, faBed } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";
// Define formatTime outside the components
const formatTime = (timeString) => {
  const { language } = useLanguage();
  const t = useTrans();
  if (!timeString) return "N/A";
  
  const [hoursStr] = timeString.split(':');
  const hours = parseInt(hoursStr, 10);
  
  if (hours >= 12) {
    const displayHours = hours === 12 ? 12 : hours - 12;
    return `${displayHours}:00 ${t("pm")}`;  // Call t() function outside the string
  } else {
    const displayHours = hours === 0 ? 12 : hours;
    return `${displayHours}:00 ${t("am")}`;  // Call t() function outside the string
  }
};

const PatientCard = ({ patient }) => {
   const { language } = useLanguage();
    const t = useTrans();
  const displayName = () => {
    if (patient.child_name && patient.name) {
      return ` ${patient.child_name} ${patient.name}`;
    }
    return patient.child_name || patient.name;
  };

  return (
    <div className="patient-card">
      <div className="patient-header">
        <img
          src={`http://project-api.com/${patient.photo}` || "https://via.placeholder.com/150"}
          alt="Patient"
          className="patient-image"
        />
        <div>
          <h2 className="patient-name">{patient.child_name}</h2>
          <p className="patient-id">#{patient.id}</p>
        </div>
      </div>
      <div className="patient-info">
        <p><strong>{t("Name")}:</strong> {displayName()}</p>
        <p><strong>{t("Gender")}:</strong> {patient.gender}</p>
        <p><strong>{t("Day")}:</strong> {patient.day}</p>
        <p><strong>{t("Age")}:</strong> {patient.age} {t("yearsold")}</p>
        <p><strong>{t("Time")}:</strong> {formatTime(patient.time)}</p>
        
        
      </div>
    </div>
  );
};

const Patients = () => {
  
  const [patients, setPatients] = useState([]);
  const [doctor, setDoctor] = useState(null);
const { language, setLanguage } = useLanguage();
      const t = useTrans();
  // Fetch patients from API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        // Validate token exists and is properly formatted
        if (!token || typeof token !== 'string') {
          console.error('Invalid or missing auth token');
          return;
        }

        // Create headers object
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${token.trim()}`); // Ensure proper formatting

        const response = await fetch("http://project-api.com/api/getPatients", {
          method: 'GET',
          headers: headers,
          credentials: 'include' // Add if using cookies
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPatients(data.data || []);
      } catch (error) {
        console.error("Error fetching patients:", error.message);
        setPatients([]);
      }
    };

    fetchPatients();
  }, []);

  // Load doctor data from localStorage
  useEffect(() => {
    const loadDoctorData = () => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        const savedDoctor = localStorage.getItem(`doctorData_${authToken}`);
        if (savedDoctor) {
          try {
            setDoctor(JSON.parse(savedDoctor));
          } catch (e) {
            console.error("Error parsing doctor data:", e);
          }
        }
      }
    };
    loadDoctorData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(`doctorData_${localStorage.authToken}`);
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  return (
    <main className={`video-page ${language === "ar" ? "rtl" : "ltr"}`}>
      <Header2 />
      <div className="user-profile-container">
        {/* Sidebar remains exactly the same as your original */}
        <div className="sidebar">
          <div className="user-avatar-section">
            <div className="user-avatar">
              {doctor?.photo ? (
                <img
                  src={`http://project-api.com/${doctor.photo}`}
                  alt="Profile"
                  className="profile-photo"
                />
              ) : (
                <div className="icon-user">
                  <FontAwesomeIcon icon={faCircleUser} size="2xl" />
                </div>
              )}
            </div>
            <h2 className="user-name">
              {doctor ? `Dr. ${doctor.first_name} ${doctor.last_name}` : "Doctor's Name"}
            </h2>
          </div>
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

        <div className="main-content">
          <div className="info-card">
            <div className="patients-container">
              <div className="patients-grid">
                {patients.map((patient, index) => (
                  <PatientCard key={index} patient={patient} />
                ))}
                {patients.length === 0 && (
                  <div className="no-patients">No patients found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Patients;