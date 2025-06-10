import React, { useState, useEffect } from 'react';
import Footer from "../comps/footerLink2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faCalendarDays, faCommentDots } from '@fortawesome/free-regular-svg-icons';
import { faCamera, faArrowRightFromBracket, faUserDoctor, faBed, faCheck, faEye, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Accept from "./Accept";
import Cancel from "./Cancel";
import Details from "./details";
import axios from 'axios';
import Header2 from "../comps/header2"
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";
const Appointemnt = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSecondPopupOpen, setIsSecondPopupOpen] = useState(false);
  const [isThirdPopupOpen, setIsThirdPopupOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [refresh, setRefresh] = useState(false); // Added for refreshing data
const { language, setLanguage } = useLanguage();
    const t = useTrans();
  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Get the authentication token
        const response = await fetch("http://project-api.com/api/getAllAppointments", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Add authentication header
          },
        });

        if (!response.ok) throw new Error("Failed to fetch appointments");
        const data = await response.json();
        setAppointments(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [refresh]); // Add refresh to dependency array

  // Load doctor data from localStorage
  useEffect(() => {
    const loadDoctorData = () => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        const savedDoctor = localStorage.getItem(`doctorData_${authToken}`);
        if (savedDoctor) {
          setDoctor(JSON.parse(savedDoctor));
        }
      }
    };
    loadDoctorData();
  }, []);

  // Handle accepting an appointment
  const handleAcceptAppointment = async (id) => {
    try {
      const token = localStorage.getItem('authToken'); // Get the token from localStorage
      const response = await axios.post(
        `http://project-api.com/api/appointments/${id}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the local state to reflect the new status
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === id
            ? { ...appointment, statue: 'Paid' }
            : appointment
        )
      );

      setIsPopupOpen(true); // Open the success popup
      setRefresh(!refresh); // Trigger a refresh to fetch updated data
    } catch (error) {
      console.error("Error accepting appointment:", error);
      setIsPopupOpen(true); // Open the popup for error handling (optional)
    }
  };
  const handleDeleteAppointment = async (id) => {
    try {
      const token = localStorage.getItem('authToken'); // Get the token from localStorage
      const response = await axios.delete(
        `http://project-api.com/api/appointments/${id}/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the local state to remove the deleted appointment
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment.id !== id)
      );

      setIsSecondPopupOpen(true); // Open the success popup
      setRefresh(!refresh); // Trigger a refresh to fetch updated data
    } catch (error) {
      console.error("Error deleting appointment:", error);
      setIsSecondPopupOpen(true); // Open the popup for error handling
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsThirdPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setIsSecondPopupOpen(false);
    setIsThirdPopupOpen(false);
    setSelectedAppointment(null);
  };

  const handleLogout = () => {
    localStorage.removeItem(`doctorData_${localStorage.authToken}`);
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  if (loading) return <div>Loading appointments...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!doctor) return <div>Loading doctor data...</div>;

  return (
    <main className={`video-page ${language === "ar" ? "rtl" : "ltr"}`}>
      <Header2/>
      <div className="user-profile-container">
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
            <h2 className="user-name">Dr. {doctor.first_name} {doctor.last_name}</h2>
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
          <div className="info-card appointments-container">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{t("Name")}</th>
                    <th>{t("Age")}</th>
                    <th>{t("Gender")}</th>
                    <th>{t("Phone")}</th>
                    <th>{t("Date")}</th>
                    <th>{t("Status")}</th>
                    <th>{t("Action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment, index) => (
                    <tr key={appointment.id}>
                      <td>{index + 1}</td>
                      <td>{appointment.name}</td>
                      <td>{appointment.age}</td>
                      <td>{appointment.gender}</td>
                      <td>{appointment.phone}</td>
                      <td>{new Date(appointment.date).toLocaleDateString()}</td>
                      <td className={appointment.statue.toLowerCase()}>{appointment.statue}</td>
                      <td>
                        <button className="edit" onClick={() => handleViewDetails(appointment)}>
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          className="truee"
                          onClick={() => handleAcceptAppointment(appointment.id)}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button className="delete" onClick={() => handleDeleteAppointment(appointment.id)}>
                          <FontAwesomeIcon icon={faXmark} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isPopupOpen && (
  <div className="popup-overlay">
    <Accept closePopup={() => setIsPopupOpen(false)} />
  </div>
)}

{isSecondPopupOpen && (
  <div className="popup-overlay">
    <Cancel closePopup={() => setIsSecondPopupOpen(false)} />
  </div>
)}

{isThirdPopupOpen && selectedAppointment && (
  <div className="popup-overlay">
    <Details closePopup={closePopup} appointment={selectedAppointment} />
  </div>
)}

      <Footer />
    </main>
  );
};

export default Appointemnt;