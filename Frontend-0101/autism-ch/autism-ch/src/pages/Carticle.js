import React from "react";
import Header from "../comps/header";
import Footer from "../comps/footer";
import Child from "../assets/child.jpeg";
import { useParams } from "react-router-dom";

import P1 from "../assets/1.jpg";
import P2 from "../assets/2.png";
import P3 from "../assets/3.jpg";
import P4 from "../assets/4.jpg";
import P5 from "../assets/5.jpg";
import P6 from "../assets/6.jpeg";
import P7 from "../assets/7.jpg";
import P8 from "../assets/8.jpg";
import P9 from "../assets/9.jpg";
import P10 from "../assets/10.jpg";
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";
const Carticle = () => {
  const { language } = useLanguage();
    const t = useTrans();
  const articles = [
    {
      id: 1,
      title: t("WHAT_IS_AUTISM"),
      content: t("ASD_DEFINITION"), // Removed curly braces and fixed syntax
      imageUrl: P4,
    },
{
      id: 2,
      title: t("NEUROBIOLOGICAL"),
      content:
        t("TheNeurobiological"),
      imageUrl: P8,
    },
    {
      id: 3,
      title: t("EARLY_SIGNS"),
      content:
        t("Earlyidentification"),
      imageUrl: P1,
    },
    {
      id: 4,
      title: t("CAUSES_OF_AUTISM"),
      content:
        t("TheetiologyofAutism"),
      imageUrl: P6,
    },
    {
      id: 5,
      title: t("REVOLUTIONIZING"),
      content: t("Technologicaladvancements"),
      imageUrl: P9,
    },
    {
      id: 6,
      title: t("DETECTING_AUTISM"),
      content:
        t("Eyemovement"),
      imageUrl:P10,
    },
    {
      id: 7,
      title: t("COMPREHENSIVE_TREATMENT"),
      content: t("Thefutureofprevention"),
      imageUrl: P2,
    },
{
      id: 8,
      title: t("EFFECTIVE_TREATMENT"),
      content: t("treatmentapproaches"),
      imageUrl: P7,
    },
{
      id: 9,
      title: t("FIRST_CASE"),
      content: t("Thefirstdocumentedcase"),
      imageUrl: P3,
    },
{
      id: 10,
      title: t("HISTORY_OF_AUTISM"),
      content: t("Thehistoryofautism"),
      imageUrl:P5,
    },
  ];

  const { id } = useParams(); // جلب ID المقالة من الـ URL
  const article = articles.find((article) => article.id === parseInt(id)); // البحث عن المقالة المطلوبة

  if (!article) {
    return <h2>Article not found</h2>;
  }
  return (
    <div>
      <Header />
      <div className="container-articles-page">
        <div className="articles-header">
          <div className="oval">
            <img src={Child} alt="" className="img-head" />
          </div>
          <br />
          <p className="p-head-art">
            <span className="gray1">{t("Talkabout")}</span>
            <br />
            <span className="blue">{t("Autism")}</span>
            <br />
            <span className="gray2">{t("Spectrum")}</span>
            <br />
            <span className="gray3">{t("Disorder")}</span>
          </p>

          <div className="half-circle"></div>
          <div className="circle"></div>
          <div className="half-circle2-w"></div>
          <div className="circle2-w"></div>
          <div className="circle3-w"></div>
          <div className="circle4-b"></div>
          <div className="half-circle3-b"></div> <br />
          <p className="qout">
            - {t("Autismisnot")}-
          </p>
          <p className="quot2">- {t("StuartDuncan")}</p>
          <hr className="hr2"/>
        </div>{" "}
        <br /> <br /> <br /> <br />
        <br />
        <br />
      </div>

      <div className="container container1 mt-4">
  <div className="border p-4 rounded bg-light d-flex align-items-start">
    <div className="me-3 artic">
      <span className="h3 c-title">{article.title}</span>
      <p className="c-p">{article.content}</p>
    </div>
    <img 
      src={article.imageUrl}
      alt={article.title}
      className="img-fluid" 
      style={{ maxWidth: '300px', height: 'auto' }}  // تحديد حجم الصورة
    />
  </div>
</div>


      <Footer />
    </div>
  );
};

export default Carticle;
