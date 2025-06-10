import React, { useState } from "react";
import axios from "axios";
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";
const PasswordPopup = ({ isOpen, togglePopup }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const t = useTrans();
  const handleSave = async () => {
    setError(""); 

    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

   
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    const token = localStorage.getItem("authToken");

    
    if (!token) {
      setError("You are not authenticated. Please log in again.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://project-api.com/api/updatepassword",
        {
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data); 
      alert("Password updated successfully!");
      togglePopup(); 
    } catch (err) {
      console.error("Password update error:", err.response?.data || err);
      
      if (err.response) {
        setError(err.response.data.message || "Failed to update password. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    togglePopup();
  };

  if (!isOpen) return null;

  return (
    <main className={`video-page ${language === "ar" ? "rtl" : "ltr"}`}>
    <div className="popup-overlay">
      <div className="popup-content">
        <h2 className="set-p">{t("SetyourPassword")}</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="info-item2 cc">
          <label className="info-label2 cc1">{t("NewPassword")}</label>
          <input
            type="password"
            className="info-input2 cc2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <div className="info-item2 cc">
          <label className="info-label2 cc1">{t("Typeitagain")}</label>
          <input
            type="password"
            className="info-input2 cc2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <button className="close-button" onClick={handleClose} disabled={loading}>
          {t("Cancel")}
        </button>
        <button className="btn-change" onClick={handleSave} disabled={loading}>
          {loading ? t("Saving") : t("Save")}
        </button>
      </div>
    </div>
    </main>
  );
};

export default PasswordPopup;