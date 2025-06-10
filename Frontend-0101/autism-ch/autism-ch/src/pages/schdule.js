import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faCalendarDays, faCommentDots } from '@fortawesome/free-regular-svg-icons';
import { faCamera, faArrowRightFromBracket, faUserDoctor, faBed, faDownload } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Footer from "../comps/footerLink2";
import axios from 'axios';
import Header2 from "../comps/header2";
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";
const Schedule = () => {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
const { language, setLanguage } = useLanguage();
      const t = useTrans();
  // Function to format time in AM/PM
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    
    // Extract hours and minutes (assuming format is "HH:00" or "H:00")
    const [hoursStr] = timeString.split(':');
    const hours = parseInt(hoursStr, 10);
    
    if (hours >= 12) {
      const displayHours = hours === 12 ? 12 : hours - 12;
      return `${displayHours}:00 PM`;
    } else {
      const displayHours = hours === 0 ? 12 : hours; // Handle midnight (0:00)
      return `${displayHours}:00 AM`;
    }
  };

  useEffect(() => {
    // Load doctor data
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      const savedDoctor = localStorage.getItem(`doctorData_${authToken}`);
      if (savedDoctor) {
        setDoctor(JSON.parse(savedDoctor));
      }
    }

    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://project-api.com/api/getPatients', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Format appointments with formatted time
      const scheduleData = response.data.data.map((patient, index) => ({
        id: patient.id || `temp-${index}`,
        day: patient.day,
        time: patient.time,
        formattedTime: formatTime(patient.time), // Add formatted time
        availability: patient.Availablety || 'Available',
      
        email: patient.email
      }));
      
      setAppointments(scheduleData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilityChange = (id, newAvailability) => {
    const updatedAppointments = appointments.map(appointment => 
      appointment.id === id 
        ? { ...appointment, availability: newAvailability } 
        : appointment
    );
    
    setAppointments(updatedAppointments);
    
    // Update selected appointments
    if (newAvailability === 'Unavailable') {
      setSelectedAppointments(prev => [...prev, id]);
    } else {
      setSelectedAppointments(prev => prev.filter(appId => appId !== id));
    }
  };

  const handleCancelSelected = async () => {
    if (selectedAppointments.length === 0) {
      alert('Please select at least one appointment to cancel');
      return;
    }
  
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }
  
      // Convert to numeric IDs
      const numericIds = selectedAppointments
        .map(id => Number(id))
        .filter(id => !isNaN(id) && id > 0);
  
      if (numericIds.length === 0) {
        alert('Invalid appointment selection');
        return;
      }
  
      // Step 1: Cancel appointments
      const cancelResponse = await axios.post(
        'http://project-api.com/api/appointments/cancelation',
        { appointment_ids: numericIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );
  
      if (!cancelResponse.data.success) {
        throw new Error(cancelResponse.data.message || 'Cancellation failed');
      }
  
      // Get updated appointment IDs from cancellation response
      const updatedIds = cancelResponse.data.processed_ids || numericIds;
      
      // Step 2: Wait 3 seconds before sending emails
      setTimeout(async () => {
        try {
          let emailMessage = '';
          
          if (updatedIds.length > 0) {
            const emailResponse = await axios.post(
              'http://project-api.com/api/appointments/send-cancellation-emails',
              { appointment_ids: updatedIds },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                timeout: 10000
              }
            );
  
            if (emailResponse.data.success) {
              emailMessage = `Emails sent: ${emailResponse.data.emails_sent}.`;
              if (emailResponse.data.failed_emails.length > 0) {
                emailMessage += ` Failed to send ${emailResponse.data.failed_emails.length} emails.`;
              }
            } else {
              emailMessage = 'Email sending failed.';
            }
          }
  
          // Refresh data and show final message
          await fetchAppointments();
          setSelectedAppointments([]);
          
          alert(`Cancelled ${cancelResponse.data.updated} appointments. ${emailMessage}`);
          
        } catch (emailError) {
          console.error('Email sending error:', emailError);
          alert(`Appointments cancelled but email sending failed: ${emailError.message}`);
        }
      }, 3000);
  
      // Immediate feedback for cancellation
      alert(`Successfully cancelled ${cancelResponse.data.updated} appointments. Sending emails...`);
  
    } catch (error) {
      let errorMessage = 'Failed to cancel appointments. ';
      
      if (error.response) {
        errorMessage += `Server error: ${error.response.data.message || error.response.statusText}`;
      } else if (error.request) {
        errorMessage += 'No response from server. Check your network connection.';
      } else {
        errorMessage += error.message;
      }
  
      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
        return;
      }
  
      alert(errorMessage);
      console.error('Cancellation error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(`doctorData_${localStorage.authToken}`);
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  if (loading) return <div>Loading appointments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className={`video-page ${language === "ar" ? "rtl" : "ltr"}`}>
      <Header2/>
      <div className="user-profile-container">
        <div className="sidebar">
          <div className="user-avatar-section">
            <div className="user-avatar">
              {doctor?.photo ? (
                <img src={`http://project-api.com/${doctor.photo}`} alt="Profile" className="profile-photo" />
              ) : (
                <div className="icon-user">
                  <FontAwesomeIcon icon={faCircleUser} size="2xl" />
                </div>
              )}
            </div>
            <h2 className="user-name">
              {doctor ? `Dr. ${doctor.first_name} ${doctor.last_name}` : "Doctor"}
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
          <div className="info-card scd-doc">
            <p className="tit-schdule">{t("AppointmentSchedule")}</p>
            <p className="info-text">
              {t("Selectappointments")}
            </p>
            <hr />
            <div className="schedule-table">
              <div className="hed-schd">
                <span>{t("Day")}</span>
                <span>{t("Time")}</span>
                
                <span>{t("Status")}</span>
              </div>
              {appointments.map((appointment) => (
                <div key={appointment.id} className="schedule-row">
                  <span className="day">{appointment.day}</span>
                  <span className="time">{appointment.formattedTime}</span>
                  
                  <select
                    className="availablety"
                    value={appointment.availability}
                    onChange={(e) => handleAvailabilityChange(appointment.id, e.target.value)}
                  >
                    <option value="Available">{t("Available")}</option>
                    <option value="Unavailable">{t("Unavailable")}</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
          <button 
            className="saving-btn sss"
            onClick={handleCancelSelected}
            disabled={selectedAppointments.length === 0}
          >
            {t("Save")} ({selectedAppointments.length})
            <FontAwesomeIcon className='down-icon' icon={faDownload} />
          </button>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Schedule;