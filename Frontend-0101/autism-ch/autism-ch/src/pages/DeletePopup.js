import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";
const DeletePopup = ({ isOpen, togglePopup, onDeleteAccount }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
 const { language } = useLanguage();
  const t = useTrans();
  const handleDeleteAccount = async () => {
    try {
      await onDeleteAccount(password); 
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClose = () => {
    setPassword("");
    setError(""); 
    togglePopup(); 
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2 className="set-p">{t("Deleteyouraccount")}</h2>
        <p className="delt-p">
          {t("Deletingyouraccountisirreversible")}<br />
          {t("Youwillloseallyourdatapermanently")}
        </p>
        <p className="delt-p1">{t("Pleaseenteryourpasswordtodeleteaccount")}</p>
        <div className="info-item2 cc">
          
          <input
            type="password"
            className="info-input2 cc4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password" // Disable autocomplete
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button className="close-button2" onClick={handleClose}>
          {t("Cancel")}
        </button>
        <button className="dd" onClick={handleDeleteAccount}>
        {t("DeleteAccount")}
        </button>
      </div>
    </div>
  );
};

export default DeletePopup;