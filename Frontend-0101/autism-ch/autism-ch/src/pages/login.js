import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoginP from "../assets/sign in photo.png";
import SignUp from "./signup";
import EmailRePasswordPopup from "./EmailRePasswordPopup"; // Import EmailRePasswordPopup
import RePasswordPopup from "./RePasswordPopup"; // Import RePasswordPopup
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";
const Login = ({ isOpen, closeModal, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showEmailRePasswordPopup, setShowEmailRePasswordPopup] = useState(false); // State for EmailRePasswordPopup
  const [showRePasswordPopup, setShowRePasswordPopup] = useState(false); // State for RePasswordPopup
  const [resetEmail, setResetEmail] = useState(""); // Store email for password reset
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = useTrans();
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("http://project-api.com/api/login", {
        email,
        password,
        user_type: userType,
      });

      console.log("Login successful:", response.data);

      const authToken = response.data.data.token;
      localStorage.setItem("authToken", authToken);

      if (userType === "doctor") {
        localStorage.setItem(`doctorData_${authToken}`, JSON.stringify(response.data.data));
      } else {
        localStorage.setItem(`userData_${authToken}`, JSON.stringify(response.data.data));
      }

      onLoginSuccess(response.data.data);

      if (userType === "doctor") {
        navigate("/docProf");
      } else {
        navigate("/");
      }

      closeModal();
      localStorage.removeItem(`userData`);
    } catch (err) {
      setError(err.response?.data.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const openSignUp = () => {
    setShowSignUp(true);
  };

  const closeSignUp = () => {
    setShowSignUp(false);
  };

  const openEmailRePasswordPopup = () => {
    setShowEmailRePasswordPopup(true); // Open EmailRePasswordPopup
  };

  const closeEmailRePasswordPopup = () => {
    setShowEmailRePasswordPopup(false); // Close EmailRePasswordPopup
  };

  const openRePasswordPopup = (email) => {
    setResetEmail(email); // Store the email for RePasswordPopup
    setShowEmailRePasswordPopup(false); // Close EmailRePasswordPopup
    setShowRePasswordPopup(true); // Open RePasswordPopup
  };

  const closeRePasswordPopup = () => {
    setShowRePasswordPopup(false); // Close RePasswordPopup
  };

  return (
    <main className={`video-page ${language === "ar" ? "rtl" : "ltr"}`}>
      <div className="modal-overlay">
        <div className="modal-content">
          <img src={LoginP} className="loginp" alt="Login" />
          <button className="close-btn" onClick={closeModal}>X</button>
          <h2 className="SIGN-IN">{t("SIGNIN")}</h2>
          {error && <p className="error-message">{error}</p>}
          <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="email" className="email">{t("Email")}</label>
            <input
              type="email"
              id="input-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="password" className="pass">{t("Password")}</label>
            <input
              type="password"
              id="input-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="form-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="usert"
                  value="user"
                  checked={userType === "user"}
                  onChange={() => setUserType("user")}
                /> {t("User")}
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="usert"
                  value="doctor"
                  checked={userType === "doctor"}
                  onChange={() => setUserType("doctor")}
                /> {t("Doctor")}
              </label>
            </div>
            <button type="submit" className="b-sign-in" disabled={isLoading}>
              {isLoading ? t("SIGNING_INLODING") : t("SIGNIN")}
            </button>
            
              <a href="#" onClick={openEmailRePasswordPopup} className="forget">
              {t("Forgotpassword")}
              </a>
          
            <p className="acc">
            {t("NOaccount")}{" "}
              <span>
                <a href="#" className="register" onClick={openSignUp}>
                {t("RegisterHere")}
                </a>
              </span>
            </p>
            
          </form>
        </div>
      </div>

      {/* SignUp Popup */}
      <SignUp isOpen={showSignUp} closeModal={closeSignUp} />

      {/* EmailRePasswordPopup */}
      <EmailRePasswordPopup
        isOpen={showEmailRePasswordPopup}
        onClose={closeEmailRePasswordPopup}
        openRePasswordPopup={openRePasswordPopup}
      />

      {/* RePasswordPopup */}
      <RePasswordPopup
        isOpen={showRePasswordPopup}
        onClose={closeRePasswordPopup}
        email={resetEmail} // Pass the email to RePasswordPopup
      />
    </main>
  );
};

export default Login;