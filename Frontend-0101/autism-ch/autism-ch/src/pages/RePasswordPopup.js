import React, { useState } from "react";
import axios from "axios";
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";
const RePasswordPopup = ({ isOpen, onClose, email }) => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const t = useTrans();
  const handleSave = async () => {
    setError(""); // Clear any previous error messages

    // Validation: Check if OTP is provided
    if (!otp) {
      setError(t("PleaseentertheOTP"));
      return;
    }

    // Validation: Check if passwords match
    if (newPassword !== confirmPassword) {
      setError(t("Passwordsnotmatch"));
      return;
    }

    // Validation: Check password length
    if (newPassword.length < 8) {
      setError(t("Passwordmust8characters"));
      return;
    }

    try {
      setLoading(true);

      // Send request to reset password
      const response = await axios.post(
        "http://project-api.com/api/reset-password",
        {
          email,
          otp,
          password: newPassword,
          password_confirmation: confirmPassword,
        }
      );

      console.log("Response:", response.data); // Log response for debugging
      alert(t("Passwordresetsuccessfully"));
      onClose(); // Close the popup on success
    } catch (err) {
      console.error("Password reset error:", err.response?.data || err);
      setError(
        err.response?.data.message || "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <main className={`video-page ${language === "ar" ? "rtl" : "ltr"}`}>
    <div className="popup-overlay">
      <div className="popup-content">
        <h2 className="set-p">{t("ResetYourPassword")}</h2>
        {error && <p className="error-message">{error}</p>}

        {/* OTP Input Field */}
        <div className="info-item2 cc">
          <label className="info-label2 cc5">OTP</label>
          <input
            type="text"
            className="info-input2 cc2"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
        </div>

        {/* New Password Input Field */}
        <div className="info-item2 cc">
          <label className="info-label2 cc5">{t("NewPassword")}</label>
          <input
            type="password"
            className="info-input2 cc2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        {/* Confirm Password Input Field */}
        <div className="info-item2 cc">
          <label className="info-label2 cc5">{t("ConfirmPassword")}</label>
          <input
            type="password"
            className="info-input2 cc2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        {/* Buttons */}
        <div>
          <button
            className="btn-cancel"
            onClick={onClose}
            disabled={loading}
            style={{ marginRight: "10px" }}
          >
            {t("Cancel")}
          </button>
          <button
            className="btn-change1"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? t("Saving") : t("Save")}
          </button>
        </div>
      </div>
    </div>
    </main>
  );
};

export default RePasswordPopup;