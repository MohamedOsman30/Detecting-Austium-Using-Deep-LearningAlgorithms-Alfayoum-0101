import React, { useEffect, useState } from 'react';
import Footer from "../comps/footerLink2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { faUserDoctor, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons';
import { faBed } from '@fortawesome/free-solid-svg-icons';
import { faCommentDots } from '@fortawesome/free-regular-svg-icons';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import DeletePopup from "./DeletePopup"; 
import PasswordPopup from "./PasswordPopup"; 
import Header2 from "../comps/header2"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";
const DocEdit = () => {
  const [doctor, setDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState(null);
  const { language, setLanguage } = useLanguage();
      const t = useTrans();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone_number: "",
    price: "",
  });

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('No Token Found, Please Login again.');
      window.location.href = "/";
      return;
    }
    if (authToken) {
      const savedDoctor = localStorage.getItem(`doctorData_${authToken}`);
      if (savedDoctor) {
        const doctorData = JSON.parse(savedDoctor);
        setDoctor(doctorData);
        setFormData({
          phone_number: doctorData.phone_number || "",
          price: doctorData.price || "",
        });
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPhotoLoading(true);
      setPhotoError(null);

      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found. Please log in again.");
        }

        const formDataPhoto = new FormData();
        formDataPhoto.append("photo", file);

        const response = await axios.post(
          "http://project-api.com/api/updateProfilePhoto", 
          formDataPhoto,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        setDoctor(response.data.user);
        localStorage.setItem(`doctorData_${token}`, JSON.stringify(response.data.user));
        alert("Profile photo updated successfully!");
      } catch (err) {
        setPhotoError(err.response?.data?.message || "Failed to update profile photo");
        alert(`Error: ${err.response?.data?.message || "Failed to update profile photo"}`);
      } finally {
        setPhotoLoading(false);
      }
    }
  };

  const handleRemovePhoto = async () => {
    if (!window.confirm("Are you sure you want to remove your profile photo?")) return;
    
    setPhotoLoading(true);
    setPhotoError(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const response = await axios.put(
        "http://project-api.com/api/profile/remove-photo",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setDoctor(response.data.user);
      localStorage.setItem(`doctorData_${token}`, JSON.stringify(response.data.user));
      alert("Profile photo removed successfully!");
    } catch (err) {
      setPhotoError(err.response?.data?.message || "Failed to remove profile photo");
      alert(`Error: ${err.response?.data?.message || "Failed to remove profile photo"}`);
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const response = await axios.post(
        "http://project-api.com/api/updateinfo",
        {
          phone_number: formData.phone_number,
          price: formData.price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setDoctor(response.data.user);
      localStorage.setItem(`doctorData_${token}`, JSON.stringify(response.data.user));
      alert("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      alert(`Error: ${err.response?.data?.message || "Failed to update profile"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(`doctorData_${localStorage.authToken}`);
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const toggleDeletePopup = () => {
    setIsDeletePopupOpen(!isDeletePopupOpen);
  };

  const handleDeleteAccount = async (password) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const response = await axios.post(
        "http://project-api.com/api/deleteaccount",
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      alert("Account deleted successfully!");
      localStorage.removeItem(`doctorData_${token}`);
      localStorage.removeItem("authToken");
      window.location.href = "/";
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to delete account");
    }
  };

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
    <main className={`video-page ${language === "ar" ? "rtl" : "ltr"}`}>
      <Header2/>
      
      <div className="user-profile-container">
        <div className="sidebar">
          <div className="user-avatar-section">
            <div className="user-avatar">
              {doctor.photo ? (
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
            <h2 className="user-name">{doctor.first_name} {doctor.last_name}</h2>
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
            <h2 className="info-title2">{t("UpdateProfileInformation")}</h2>
            <p className="card-title2">{t("Easilyupdate")}</p>
            <span className="icon-user icon-user1">
              <FontAwesomeIcon icon={faCircleUser} />
            </span>
            <span className="per-info1">{t("Uploadyourpicture")}</span> <br />
            <span className='card-title21'>{t("Forbestresults")}</span>
            <button 
              className="btn-change upload" 
              onClick={() => document.getElementById('file-upload').click()}
              disabled={photoLoading}
            >
              {photoLoading ? t('Uploading...') : t('Upload')}
            </button>
            <input 
              id="file-upload" 
              type="file" 
              style={{display: 'none'}} 
              onChange={handleImageChange} 
              accept="image/*"
              disabled={photoLoading}
            />
            <button 
              className="btn-change remove" 
              onClick={handleRemovePhoto}
              disabled={photoLoading || !doctor.photo || doctor.photo.includes('OIP.jpg')}
            >
              {photoLoading ? t('Removing...') : t('Remove')}
            </button>
            {photoError && <div className="error-message">{photoError}</div>}
            
            <div className="info-grid2 info-grid21">
              <div className="info-item2">
                <label className="info-label2">{t("PhoneNumber")} </label>
                <div className="input-container2">
                  <input 
                    type="text" 
                    className="info-input2" 
                    name="phone_number" 
                    value={formData.phone_number} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              <div className="info-item2">
                <label className="info-label2">{t("consultationPrice")}</label>
                <div className="input-container2">
                  <input 
                    type="text" 
                    className="info-input2" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              <button 
                className="saving-btn" 
                onClick={handleSubmit} 
                disabled={isLoading}
              >
                {isLoading ? t("Updating...") : t("Update")}
                <FontAwesomeIcon className='down-icon' icon={faDownload} />
              </button><br />
              <div className="info-item2">
                <label className="info-label2">{t("Password")}</label>
                <button className="btn-change" onClick={togglePopup}>{t("Change")} </button>
              </div>
                          
              <p className='delt mod'>{t("ModifyMyConsultationTimes")}</p>
              <div className="delete-info-container11">
                <p className="delete-info ddd">
                  {t("Wouldyouliketomodifyyourschedule")}
                  {t("Adjustyourappointmenttimeandconfirmthechanges")}.
                </p>
                <button 
                  className="delt-btn schedule s-info" 
                  onClick={() => navigate('/appointemnt')}
                >
                  {t("ScheduleAppointment")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <PasswordPopup isOpen={isPopupOpen} togglePopup={togglePopup} />
      )}

      {isDeletePopupOpen && (
        <DeletePopup
          isOpen={isDeletePopupOpen}
          togglePopup={toggleDeletePopup}
          onDeleteAccount={handleDeleteAccount}
        />
      )}

      <Footer />
    </main>
  );
};

export default DocEdit;