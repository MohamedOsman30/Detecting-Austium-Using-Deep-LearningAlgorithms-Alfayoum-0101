import React from "react";
import Success from "../assets/success.png";

const BookSuc = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay1" onClick={onClose}>
      <div className="popup-content1" onClick={(e) => e.stopPropagation()}>
        <div className="icon-success1">
          <img src={Success} alt="Success" className="success" />
        </div>
        <div className="info-success1">
          Online Booking <br /> Successfully
        </div>
        <button className="close-btn1" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default BookSuc;
