import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";
const Details = ({ closePopup, appointment }) => {
  const { language } = useLanguage();
    const t = useTrans();
  if (!appointment) return null;

  // Function to format time in AM/PM
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    
    const [hoursStr] = timeString.split(':');
    const hours = parseInt(hoursStr, 10);
    
    if (hours >= 12) {
      const displayHours = hours === 12 ? 12 : hours - 12;
      return `${displayHours}:00 ${t("pm")}`;  // Call t() function outside the string
    } else {
      const displayHours = hours === 0 ? 12 : hours;
      return `${displayHours}:00 ${t("am")}`;  // Call t() function outside the string
    }
  };

  return (
    <main className={`video-page ${language === "ar" ? "rtl" : "ltr"}`}>
    <div className="con-success s2 ss2">
      <div className="class-det">
        <div className="info-success s4 cc4 cc6">{t("AppointmentDetails")}</div>
        <button className="btnx" onClick={closePopup}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
      
      <div className="s3 c3 cc3 cc33">
        <div className="icon-user ii">
          {appointment.photo ? (
            <img
              src={`http://project-api.com/${appointment.photo}`}
              alt="Profile"
              style={{ width: "63px", height: "63px", borderRadius: "50%" }}
            />
          ) : (
            <div className="default-avatar">
              <span>No Photo</span>
            </div>
          )}
        </div>
        <span className="user-name u">{appointment.name}</span>
      </div>

      <div className="details-container">
        <div className="details-row">
          <p><strong>{t("Email")} </strong> {appointment.email} </p>
          <p><strong>{t("ChildName")}:</strong> {appointment.child_name}</p>
        </div>
        <div className="details-row">
          <p><strong>{t("Phone")}:</strong> {appointment.phone}</p>
          <p><strong>{t("ChildAge")}:</strong> {appointment.age} {t("yearsold")}</p>
        </div>
        <div className="details-row">
          <p><strong>{t("Gender")}:</strong> {appointment.gender}</p>
          <p><strong>{t("BookingDay")}:</strong> {appointment.day}</p>
        </div>
        <div className="details-row">
          <p><strong>{t("consultationPricee")}:</strong> {appointment.price} {t("EGP")}</p>
          <p><strong>{t("BookingTime")}:</strong> {formatTime(appointment.time)}</p>
        </div>
      </div>
    </div>
    </main>
  );
};

export default Details;