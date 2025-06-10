import React, { useState, useEffect, useRef } from "react";
import Header from "../comps/header";
import Footer from "../comps/footer";
import { faComments } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign, faPhone } from "@fortawesome/free-solid-svg-icons";
import Doc11 from "../assets/doc11.png";
import BookForm from "./BookForm";
import AOS from "aos";
import "aos/dist/aos.css";
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { companyInfo } from "./companyInfo";
import "./chat.css";
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";

const Booking = () => {
  const { language } = useLanguage();
  const t = useTrans();

  const [originalDoctors, setOriginalDoctors] = useState([]);
  const [displayDoctors, setDisplayDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init();
  }, []);

  // Fetch doctors' data
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://project-api.com/api/doctors");
        if (!response.ok) {
          throw new Error("Failed to fetch doctors data");
        }
        const data = await response.json();
        setOriginalDoctors(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Translate doctors' data when originalDoctors or language changes
  useEffect(() => {
    if (!originalDoctors || originalDoctors.length === 0) return;

    const translateDoctors = async () => {
      if (language === "en") {
        setDisplayDoctors(originalDoctors);
        return;
      }

      try {
        const textsToTranslate = originalDoctors.flatMap((doctor) => [
          doctor.title,
          doctor.Day1,
          doctor.Day2,
        ]);
        const uniqueTexts = [...new Set(textsToTranslate)].filter((text) => text); // Remove duplicates and empty strings

        if (uniqueTexts.length === 0) {
          setDisplayDoctors(originalDoctors);
          return;
        }

        const translatedTexts = await translateTexts(uniqueTexts, language);

        const translationMap = {};
        uniqueTexts.forEach((text, index) => {
          translationMap[text] = translatedTexts[index] || text; // Fallback to original if translation fails
        });

        const translatedDoctors = originalDoctors.map((doctor) => ({
          ...doctor,
          title: translationMap[doctor.title] || doctor.title,
          Day1: translationMap[doctor.Day1] || doctor.Day1,
          Day2: translationMap[doctor.Day2] || doctor.Day2,
        }));

        setDisplayDoctors(translatedDoctors);
      } catch (error) {
        console.error("Translation error:", error.message);
        setDisplayDoctors(originalDoctors); // Fallback to original data
      }
    };

    translateDoctors();
  }, [originalDoctors, language]);

  // Function to call MyMemory Translation API
  const translateTexts = async (texts, targetLanguage) => {
    const url = "https://api.mymemory.translated.net/get";
    const translatedTexts = [];

    for (const text of texts) {
      try {
        const response = await fetch(
          `${url}?q=${encodeURIComponent(text)}&langpair=en|${targetLanguage}`
        );
        if (!response.ok) {
          throw new Error(`Translation failed for "${text}"`);
        }
        const data = await response.json();
        const translatedText =
          data.responseStatus === 200 && data.matches?.length > 0
            ? data.matches[0].translation
            : text;
        translatedTexts.push(translatedText);
      } catch (error) {
        console.warn(`Failed to translate "${text}": ${error.message}`);
        translatedTexts.push(text); // Fallback to original text
      }
    }

    return translatedTexts;
  };

  // Chatbot State and Logic
  const chatBodyRef = useRef();
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "model",
      text: companyInfo,
    },
  ]);

  const generateBotResponse = async (userMessage) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.response || "Something went wrong!");
      }

      setChatHistory((history) => [
        ...history.slice(0, -1),
        { role: "model", text: data.response },
      ]);
    } catch (error) {
      setChatHistory((history) => [
        ...history.slice(0, -1),
        { role: "model", text: `Error: ${error.message}`, isError: true },
      ]);
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className={`video-page ${language === "ar" ? "rtl" : "ltr"}`}>
      <Header />
      <div className="con-booking">
        <div className="con-img-book">
          <img src={Doc11} alt="" className="doc11" />
          <div className="info-book-img">
            <h2 className="head-info">
              {t("WeHave")} <br /> <span className="diff-color">{t("Qualified")}</span> {t("Doctors")}
            </h2>
            <p className="head2-info">
              {t("Weprovide")} <br /> {t("tryto")}
            </p>
            <button
              className="card-b5"
              onClick={() => window.open("http://chatapp.com/login.php", "_blank")}
            >
              {t("Doctorchat")}
            </button>
          </div>
        </div>

        <p className="state5" data-aos="fade-up">
          {t("Findtheright")}
        </p>

        <div className="card-doc-con">
          {displayDoctors.map((doctor) => (
            <div key={doctor.id} className="card-doc" data-aos="fade-up">
              <div className="con-img-doc">
                <img
                  src={`http://project-api.com/${doctor.photo}`}
                  alt={`${doctor.first_name} ${doctor.last_name}`}
                  className="card-image"
                />
              </div>
              <h2 className="title">
                Dr. {doctor.first_name} {doctor.last_name}
              </h2>
              <p className="specialist">{doctor.title}</p>
              <div className="con-icon">
                <div className="dollar">
                  <FontAwesomeIcon icon={faDollarSign} className="input-icon" />
                  <br />
                  <p className="p-price">
                    {t("consultationPrice")} <br /> {doctor.price} EGP
                  </p>
                </div>
                <div className="call">
                  <FontAwesomeIcon icon={faPhone} className="input-icon" />
                  <br />
                  <div className="num">{doctor.phone_number}</div>
                </div>
              </div>
              <p className="available">
                {t("AvailableAt")}:{" "}
                <span className="diff-color">
                  {doctor.Day1} {t("and")} {doctor.Day2}
                </span>
              </p>
              <p className="from">
                {t("From")}:{" "}
                <span className="diff-color">
                  {doctor.time1} {t("am")} {t("to")} {doctor.time2 - 12} {t("pm")}
                </span>
              </p>
              <button
                onClick={() => (window.location.href = "/BookForm")}
                className="b-booking"
              >
                {t("BookNow")}
              </button>
            </div>
          ))}
        </div>

        <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
          <button onClick={() => setShowChatbot((prev) => !prev)} id="chatbot-toggler">
            <span className="material-symbols-rounded">mode_comment</span>
            <span className="material-symbols-rounded">close</span>
          </button>
          <div className="chatbot-popup">
            <div className="chat-header">
              <div className="header-info">
                <ChatbotIcon />
                <h2 className="logo-text">Chatbot</h2>
              </div>
              <button
                onClick={() => setShowChatbot((prev) => !prev)}
                className="material-symbols-rounded"
              >
                keyboard_arrow_down
              </button>
            </div>
            <div ref={chatBodyRef} className="chat-body">
              <div className="message bot-message">
                <ChatbotIcon />
                <p className="message-text">
                  Hey there 👋 <br /> How can I help you today?
                </p>
              </div>
              {chatHistory.map((chat, index) => (
                <ChatMessage key={index} chat={chat} />
              ))}
            </div>
            <div className="chat-footer">
              <ChatForm
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
                generateBotResponse={generateBotResponse}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Booking;