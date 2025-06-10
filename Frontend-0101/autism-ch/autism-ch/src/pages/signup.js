import React, { useState } from "react";
import SignupP from "../assets/sign up photo.png";
import RigSuc from "./RigSuc"; // Import success popup
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";
const Signup = ({ isOpen, closeModal }) => {
  const { language } = useLanguage();
  const t = useTrans();
  const [isChecked, setIsChecked] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    "first-name": "",
    "last-name": "",
    phone: "",
    email: "",
    pass: "",
    "confirm-pass": "",
  });



  const handleGoogleLogin = () => {
    window.location.href = "http://project-api.com/api/auth/google";
};



  const handleCheckboxChange = () => {
    setIsChecked((prevChecked) => !prevChecked);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.pass !== formData["confirm-pass"]) {
      alert("Passwords do not match");
      return;
    }

    if (!isChecked) {
      alert("You must agree to the Terms and Conditions and Privacy Policy");
      return;
    }

    const dataToSend = {
      first_name: formData["first-name"],
      last_name: formData["last-name"],
      email: formData.email,
      phone_number: formData.phone,
      password: formData.pass,
    };

    try {
      const response = await fetch("http://project-api.com/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Success:", result);

      // Open the success popup instead of alert
      setIsSuccessPopupOpen(true);
      
    } catch (error) {
      console.error("Error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  const goToLogin = () => {
    setIsSuccessPopupOpen(false);
    closeModal(); // Close Signup Modal
    
  };

  if (!isOpen) return null;

  return (
    <main className={`video-page ${language === "ar" ? "rtl" : "ltr"}`}>
      <div className="modal-overlay2">
        <div className="modal-content2">
          <button className="close-btn2" onClick={closeModal}>
            X
          </button>
          <h2 className="SIGN-UP">{t("CREATEACCOUNT")}</h2>
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="text"
              id="first-name"
              placeholder={t("FirstName")}
              value={formData["first-name"]}
              onChange={handleInputChange}
            />
            <input
              type="text"
              id="last-name"
              placeholder={t("LastName")}
              value={formData["last-name"]}
              onChange={handleInputChange}
            />
            <input
              type="tel"
              id="phone"
              placeholder={t("Phone")}
              value={formData.phone}
              onChange={handleInputChange}
            />
            <input
              type="email"
              id="email"
              placeholder={t("Email")}
              value={formData.email}
              onChange={handleInputChange}
            />
            <input
              type="password"
              id="pass"
              placeholder={t("Password")}
              value={formData.pass}
              onChange={handleInputChange}
            />
            <input
              type="password"
              id="confirm-pass"
              placeholder={t("ConfirmPassword")}
              value={formData["confirm-pass"]}
              onChange={handleInputChange}
            />
            <label htmlFor="checkbox" className="label">
              <input
                type="checkbox"
                id="checkbox"
                className="check"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <span className="agree">
              {t("agree")}
                <span className="diff-color">{t("Terms")}</span> {t("and")}{" "}
                <span className="diff-color">{t("Privacy")}</span>
              </span>
            </label>
            <br />
            <button type="submit" className="b-sign-up">
            {t("SIGNUP")}
            </button>


            
<button  className="b-sign-up b-sign-up-g " style={{ marginTop: "30px" }} onClick={handleGoogleLogin}>
          <FontAwesomeIcon icon={faGoogle} />&nbsp;
          {t("SignUpwithGoogle")}
              

            </button>


            
            <img src={SignupP} className="signupP" alt="" />
          </form>
        </div>
      </div>

      {/* Success Popup */}
      {isSuccessPopupOpen && <RigSuc isOpen={isSuccessPopupOpen} onClose={goToLogin} />}

      
    </main>
  );
};

export default Signup;
