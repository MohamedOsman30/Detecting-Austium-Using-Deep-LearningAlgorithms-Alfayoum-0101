import React from "react";
import Success from "../assets/checkmark_mint.png";
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";

const RigSuc = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const t = useTrans();

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${language === "ar" ? "rtl" : "ltr"}`}>
      <div className="popup-content3" onClick={(e) => e.stopPropagation()}>
        <div className="icon-success3">
        <img src={Success} alt="Success" className="success" />
        </div>
        <div className="info-success3">
        {t("RegistrationUser")} <br /> {t("Successfully")}
        </div>
        <button className="close-btn3" onClick={onClose}>
          {t("Ok")}
        </button>
      </div>
    </div>
  );
};

export default RigSuc;