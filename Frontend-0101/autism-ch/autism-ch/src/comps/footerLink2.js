import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "../assets/Photo/WhatsApp_Image_2024-11-03_at_6.21.50_PM__1_-removebg-preview.png";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faInstagramSquare } from "@fortawesome/free-brands-svg-icons";
import { faTwitterSquare } from "@fortawesome/free-brands-svg-icons";
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";
const footerLink2 = () => {
  const { language, setLanguage } = useLanguage();
        const t = useTrans();
  return (
    <div>
      <footer className="text-lg-start text-muted footer1">
        {/* Section: Links */}
        <section className="ff">
          <div className="container text-md-start">
            {/* Grid row */}
            <div className="row mt-3 justify-content-center">
              {/* Logo in center */}
              <div className="col-12 text-center mb-4">
  <img className="logo-footer" src={Logo} alt="Logo" />
</div>


              {/* Social Media Icons in center */}
              <div className="col-12 d-flex flex-column align-items-center mb-4">
                <h6 className="text-uppercase fw-bold mb-4 fz">{t("Followus")}</h6>
                <div className="contact d-flex justify-content-center">
                  <a href="#" className="footerLink2 me-3">
                    <FontAwesomeIcon icon={faFacebook} />
                  </a>
                  <a href="#" className="footerLink2 me-3">
                    <FontAwesomeIcon icon={faInstagramSquare} />
                  </a>
                  <a href="#" className="footerLink2 me-3">
                    <FontAwesomeIcon icon={faTwitterSquare} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Copyright */}
        <div className="text-center p-4 ff">
          <p>{t("Copyright")}</p>
        </div>
      </footer>
    </div>
  );
};

export default footerLink2;