import React, { useState } from 'react';
import Cancel1 from "../assets/cancel.jpg";
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";
const Cancel = ({ closePopup }) => {
  const { language } = useLanguage();
  const t = useTrans();

      
  return (
    <div>
        <div className="con-success s2">
                    <div className="icon-success s1 c1"> 
                     <img src={Cancel1} alt="" className='success cancel'/>
                    </div>
                    <div className="info-success s4 c4">
                    {t("RemoveAppointment")}
                    </div>
                    <div className='s3 c3'>
                    "{t("Theappointment")}<br/>
                     {t("Pleasefeel")}"
                    </div>
                    <button className=' b22 b222' onClick={closePopup}>{t("Ok")}</button>
                  </div>
    </div>
  );
}

export default Cancel;

