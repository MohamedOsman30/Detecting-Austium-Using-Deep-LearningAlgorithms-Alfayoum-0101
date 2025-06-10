import React from "react";
import Success from "../assets/checkmark_mint.png";
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";
const Succes = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
   const { language } = useLanguage();
    const t = useTrans();

  return (
    <main className={`video-page ${language === "ar" ? "rtl" : "ltr"}`}>
    <div className="popup-overlay3" onClick={onClose}>
      <div className="popup-content3" onClick={(e) => e.stopPropagation()}>
        <div className="icon-success3">
          <img src={Success} alt="Success" className="success" />
        </div>
        <div className="info-success3">
          {t("UpdateInformation")} <br /> {t("Successfully")}
        </div>
        <button className="close-btn3" onClick={onClose}>
        {t("Ok")}
        </button>
      </div>
    </div>
    </main>
  );
};

export default Succes;