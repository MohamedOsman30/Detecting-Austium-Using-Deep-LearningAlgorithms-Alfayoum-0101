import React from 'react';
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Logo from "../assets/Photo/WhatsApp_Image_2024-11-03_at_6.21.50_PM__1_-removebg-preview.png";
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faInstagramSquare } from '@fortawesome/free-brands-svg-icons';
import { faTwitterSquare } from '@fortawesome/free-brands-svg-icons';
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";
const Footer = () => {
  const { language } = useLanguage();
  const t = useTrans();
  return (
    <div>
       <footer className=" text-lg-start text-muted footer1">
    {/* Section: Links  */}
    <section className="ff">
      <div className="container text-md-start ">
        {/* Grid row */}
        <div className="row mt-3">
          {/* Grid column */}
          <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
            {/* Content */}
            <h6 className="text-uppercase fw-bold mb-4">
              <img className='logo-footer'
                src={Logo}
                alt=""
              />
            </h6>
          
          </div>
          
          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
            {/* Links */}
            <h6 className="text-uppercase fw-bold mb-4 fz">{t("Services")}</h6>
            <p>
              <a href="booking" className="text-reset footerLink">
              {t("Booking")}
              </a>
            </p>
            <p>
              <a href="detection" className="text-reset footerLink">
              {t("AutismDetection")}
              </a>
            </p>
            
          </div>
          
          <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4 ff">
            {/* Links */}
            <h6 className="text-uppercase fw-bold mb-4 fz">{t("Activity")}</h6>
          
            <p>
              <a href="videos" className="text-reset footerLink">
              {t("InformativeVideos")}
              </a>
            </p>
            <p>
              <a href="articles" className="text-reset footerLink">
              {t("Articles")}
              </a>
            </p>
          </div>
          {/* Grid column */}
          {/* Grid column */}
          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
            {/* Links */}
            <h6 className="text-uppercase fw-bold mb-4 fz">{t("Support")}</h6>
            
            <p>
              <a href="http://chatapp.com/login.php"  target="_blank" className="text-reset footerLink">
              {t("Doctorchat")}
              </a>
            </p>
            
          </div>
          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
            {/* Links */}
            <h6 className=" text-center text-uppercase fw-bold mb-4 fz">
            {t("Followus")}
            </h6>
            <div className="text-center contact">
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
          {/* Grid column */}
        </div>
        {/* Grid row */}
      </div>
    </section>
    {/* Section: Links  */}
    {/* Copyright */}
    <div className="text-center p-4 ff">
      <p>{t("Copyright")}</p>
    </div>
    {/* Copyright */}
  </footer>
  {/* End of Footer */}

    </div>
  );
}

export default Footer;