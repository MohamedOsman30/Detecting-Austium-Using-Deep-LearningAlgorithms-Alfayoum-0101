import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faCamera,
  faGear,
  faArrowRightFromBracket,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../comps/header";
import Footer from "../comps/footer";
import PasswordPopup from "./PasswordPopup";
import DeletePopup from "./DeletePopup";
import Succes from "./Succes";
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";
const UserEdit = () => {
  const { language } = useLanguage();
    const t = useTrans();
  const [user, setUser] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });


  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("No authentication token found. Please log in again.");
      window.location.href = "/login";
      return;
    }

    const savedUser = localStorage.getItem(`userData_${token}`); 
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setFormData({
        firstName: userData.first_name || "",
        lastName: userData.last_name || "",
        email: userData.email || "",
        phone: userData.phone_number || "",
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

      const response = await fetch("http://project-api.com/api/updateinfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user information.");
      }

      const updatedUser = await response.json();
      setUser(updatedUser.user);
      localStorage.setItem(`userData_${token}`, JSON.stringify(updatedUser.user)); 
      setIsSuccessPopupOpen(true);
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      localStorage.removeItem(`userData_${token}`); 
    }
    localStorage.removeItem("authToken");
    window.location.href = "/#";
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

      const response = await fetch("http://project-api.com/api/deleteaccount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete account");
      }

      alert("Account deleted successfully!");
      localStorage.removeItem(`userData_${token}`);
      localStorage.removeItem("authToken");
      window.location.href = "/#";
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const response = await fetch("http://project-api.com/api/updateProfilePhoto", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload profile photo.");
      }

      const updatedUser = await response.json();
      setUser(updatedUser.user);
      localStorage.setItem(`userData_${token}`, JSON.stringify(updatedUser.user)); 
      setIsSuccessPopupOpen(true);
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
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
                <img
                  src={`http://project-api.com/${user.photo}`}
                  alt="Profile"
                  className="profile-photo"
                />
              ) : (
                <div className="icon-user">
                  <FontAwesomeIcon icon={faCircleUser} size="2xl" />
                </div>
              )}
              <div className="camera-icon">
                <label htmlFor="photo-upload">
                  <FontAwesomeIcon icon={faCamera} size="2xl" style={{ cursor: "pointer" }} />
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handlePhotoUpload}
                />
              </div>
            </div>
            <h2 className="user-name">
              {user.first_name} {user.last_name}
            </h2>
          </div>
          <div className="sidebar-links">
            <div className="settings-link">
              <FontAwesomeIcon className="icon-set ss" icon={faGear} size="2xl" />
              <p className="sidebar-button settings-button ss">{t("AccountSettings")}</p>
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
            <h2 className="info-title2">{t("EditMyAccount")}</h2>
            <p className="card-title2">
              {t("Keepyourpersonaldetailsprivate")} <br />
              {t("Informationyouadd")}
            </p>
            <p className="per-info">{t("PersonalInformation")}</p>
            <form onSubmit={handleSubmit}>
              <div className="info-grid2">
                <div className="info-item2">
                  <label className="info-label2">{t("FirstName")}</label>
                  <div className="input-container2">
                    <input
                      type="text"
                      className="info-input2"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="info-item2">
                  <label className="info-label2">{t("LastName")}</label>
                  <div className="input-container2">
                    <input
                      type="text"
                      className="info-input2"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="info-item2">
                  <label className="info-label2">{t("Email")}</label>
                  <div className="input-container2">
                    <input
                      type="text"
                      className="info-input2"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="info-item2">
                  <label className="info-label2">{t("Phone")}</label>
                  <div className="input-container2">
                    <input
                      type="text"
                      className="info-input2"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
               
                <div className="info-item2">
  <label className="info-label2">{t("Password")}</label>
  <button type="button" className="btn-change" onClick={togglePopup}>
                  {t("Change")}
                </button>
</div>
                

                <p className="delt mod">{t("Deleteyourdataandaccount")}</p>
                <div className="delete-info-container11">
                  <p className="delete-info ddd">
                    {t("Permanentlydeleteyourdataandeverything")} <br />
                    {t("associatedwithyouraccount")}
                  </p>
                  <button type="button" className="delt-btn schedule s-info" onClick={toggleDeletePopup}>
                    {t("DeleteAccount")}
                  </button>
                </div>
              </div>

              <button type="submit" className="saving-btn" disabled={isLoading}>
                {isLoading ? t("Saving") : t("Save")}
                <FontAwesomeIcon className="down-icon" icon={faDownload} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {isPopupOpen && <PasswordPopup isOpen={isPopupOpen} togglePopup={togglePopup} />}
      {isDeletePopupOpen && (
        <DeletePopup
          isOpen={isDeletePopupOpen}
          togglePopup={toggleDeletePopup}
          onDeleteAccount={handleDeleteAccount}
          onClick={handleLogout}
        />
      )}
      {isSuccessPopupOpen && (
        <Succes isOpen={isSuccessPopupOpen} onClose={() => setIsSuccessPopupOpen(false)} />
      )}

      <Footer />
    </main>
  );
};

export default UserEdit;