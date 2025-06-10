
import React from "react";
import Success from "../assets/success.jpeg";
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";
const Accept = ({ closePopup }) => {
  const { language } = useLanguage();
    const t = useTrans();
  
  return (
    <div className="con-success s2">
      <div className="icon-success s1">
        <img src={Success} alt="" className="successs" />
      </div>
      <div className="info-success s4">{t("AcceptAppointment")}</div>
      <div className="s3">
        "{t("Yoursession")} <br />
        {t("Were")}"
      </div>
      <button className="b22" onClick={closePopup}>{t("Ok")}</button>
    </div>
  );;
};

export default Accept;