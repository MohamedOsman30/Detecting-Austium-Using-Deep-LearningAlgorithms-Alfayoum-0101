import React, { useState } from "react";
import axios from "axios";
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";
const EmailRePasswordPopup = ({ isOpen, onClose, openRePasswordPopup }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const t = useTrans();
  const handleSendOtp = async () => {
    setError(""); // Clear any previous error messages

    // Validation: Check if email is provided
    if (!email) {
      setError(t("Pleaseenter"));
      return;
    }

    try {
      setLoading(true);

      // Send request to send OTP to the provided email
      const response = await axios.post(
        "http://project-api.com/api/forgot-password",
        { email }
      );

      console.log("Response:", response.data); // Log response for debugging
      alert(t("OTPsentsuccessfully"));

      // Close this popup and open RePasswordPopup
      onClose(); // Close EmailRePasswordPopup
      openRePasswordPopup(email); // Open RePasswordPopup with the email
    } catch (err) {
      console.error("OTP send error:", err.response?.data || err);
      setError(
        err.response?.data.message || "Failed to send OTP. Please try again."
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

        {/* Email Input Field */}
        <div className="info-item2 cc">
          <label className="info-label2 cc5">{t("Email")}</label>
          <input
            type="email"
            className="info-input3 cc2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("Enteryouremail")}
          />
        </div>

        {/* Buttons */}
        <div>
          <button
            className="btn-cancel"
            onClick={onClose} // Ensure onClose is called here
            disabled={loading}
            style={{ marginRight: "10px" }}
          >
            {t("Cancel")}
          </button>
          <button
            className="btn-change1"
            onClick={handleSendOtp}
            disabled={loading}
          >
            {loading ? "Sending OTP..." : t("SendOTP")}
          </button>
        </div>
      </div>
    </div>
    </main>
  );
};

export default EmailRePasswordPopup;