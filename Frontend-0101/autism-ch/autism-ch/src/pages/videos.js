import React, { useEffect, useRef, useState } from "react";
import Header from "../comps/header";
import Footer from "../comps/footer";
import Vidp2 from "../assets/Autism rocks.jpeg";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faCommentDots } from "@fortawesome/free-regular-svg-icons";
import { faShareNodes, faEye } from "@fortawesome/free-solid-svg-icons";
import AOS from "aos"; // Import AOS library
import "aos/dist/aos.css"; // Import AOS CSS
// Chatbot imports
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { companyInfo } from "./companyInfo";
import './chat.css';
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";
const Videos = () => {
  const { language } = useLanguage();
  const t = useTrans();

  useEffect(() => {
    AOS.init();
  }, []);

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
      // Make the API call to get the bot's response
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

      // Update the chat history with the bot's response
      setChatHistory((history) => [
        ...history.slice(0, -1), // Remove the "Thinking..." placeholder
        { role: "model", text: data.response },
      ]);
    } catch (error) {
      // Handle error if the API call fails
      setChatHistory((history) => [
        ...history.slice(0, -1), // Remove the "Thinking..." placeholder
        { role: "model", text: `Error: ${error.message}`, isError: true },
      ]);
    }
  };

  useEffect(() => {
    // Auto-scroll whenever chat history updates
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [chatHistory]);

  const cardData = [
    {
      id: 1,
      vid: "https://www.youtube.com/embed/j3PrAqJ-H9k?si=sCepIlbVx0RfBY1t",
      title: t("autismSpectrum"),
      views: "4.5M",
      comments: "10.113",
    },
    {
      id: 2,
      vid: "https://www.youtube.com/embed/Nf5GlbRkRys?si=hwNdlJLZ0bNaFVZ5",
      title: t("howToHandle"),
      views: "425K",
      comments: "15.113",
    },
    {
      id: 3,
      vid: "https://www.youtube.com/embed/9j6fxcRXF60?si=lwx-nbFnA1XM5nFD",
      title: t("bestTips"),
      views: "263K",
      comments: "15.113",
    },
    {
      id: 4,
      vid: "https://www.youtube.com/embed/DZXjJVrm1Jw?si=s7-ktddJYtqyzjcG",
      title: t("autism10Things"),
      views: "1.10M",
      comments: "1.436",
    },
    {
      id: 5,
      vid: "https://www.youtube.com/embed/TJuwhCIQQTs?si=AXDWhSBTnPCxUU8y",
      title: t("quickLearnWhat"),
      views: "19.4M",
      comments: "23.75",
    },
    {
      id: 6,
      vid: "https://www.youtube.com/embed/hwaaphuStxY?si=VMTAOZLVu6t5oJFv",
      title: t("whatIsAutismCincinnati"),
      views: "437K",
      comments: "11.234",
    },
    {
      id: 7,
      vid: "https://www.youtube.com/embed/dUbsyd8Fnyw?si=fM6X19cWGw_g6fAf",
      title: t("fastFacts"),
      views: "373K",
      comments: "56.833",
    },
    {
      id: 8,
      vid: "https://www.youtube.com/embed/MecSNTf4Rw0?si=S_lNDdPu9YNkMQ3m",
      title:t("theresAllKinds"),
      views: "551K",
      comments: "19.126",
    },
    {
      id: 9,
      vid: "https://www.youtube.com/embed/SgqZY0JQgBU?si=tNWxf9GkXKDPVcYf",
      title: t("understandingAutism"),
      views: "103K",
      comments: "59.234",
    },
    {
      id: 10,
      vid: "https://www.youtube.com/embed/advXGBQ0dI4?si=52Ymnm15EALH4xbX",
      title: t("differenceNotDeficit"),
      views: "324K",
      comments: "12.897",
    },
    {
      id: 11,
      vid: "https://www.youtube.com/embed/y6g8QHWkKZU?si=n1oRROEH6wVeYaUD",
      title: t("differentKindBrilliant"),
      views: "749K",
      comments: "78.654",
    },
    {
      id: 12,
      vid: "https://www.youtube.com/embed/VAogdfYPstU?si=oD6DP82W6jMgmUWf",
      title: t("amazingKids"),
      views: "827K",
      comments: "12.089",
    },
  ];

  return (
    <main className={`video-page ${language === "ar" ? "rtl" : "ltr"}`}>
      <Header />
      <div className="video-container">
        <div className="base1">
          <div className="text-p" data-aos="fade-right">
            <p>
            {t("autismDescription")}
            </p>
          </div>
          <img src={Vidp2} alt="vid2" className="video-p2" />
        </div>
        <h3 className="header-card" data-aos="fade-up">
        {t("understand")} <span className="diff-color">{t("child")}</span>
        </h3>
        <div className="card-vid-con">
          {cardData.map((card) => (
            <div key={card.id} className="card-video" data-aos="fade-up">
              <iframe
                width="260"
                height="315"
                src={card.vid}
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
              <h2>{card.title}</h2>
              <div className="icons-video">
                <FontAwesomeIcon icon={faEye} className="icon" />
                <p>{card.views} </p>
                <FontAwesomeIcon icon={faCommentDots} className="icon" />
                <p>{card.comments} </p>
                <FontAwesomeIcon icon={faShareNodes} className="icon23" />
              </div>
            </div>
          ))}
        </div>

        {/* Chatbot UI */}
        <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
          <button onClick={() => setShowChatbot((prev) => !prev)} id="chatbot-toggler">
            <span className="material-symbols-rounded">mode_comment</span>
            <span className="material-symbols-rounded">close</span>
          </button>

          <div className="chatbot-popup">
            {/* Chatbot Header */}
            <div className="chat-header">
              <div className="header-info">
                <ChatbotIcon />
                <h2 className="logo-text">Chatbot</h2>
              </div>
              <button onClick={() => setShowChatbot((prev) => !prev)} className="material-symbols-rounded">
                keyboard_arrow_down
              </button>
            </div>

            {/* Chatbot Body */}
            <div ref={chatBodyRef} className="chat-body">
              <div className="message bot-message">
                <ChatbotIcon />
                <p className="message-text">
                  Hey there 👋 <br /> How can I help you today?
                </p>
              </div>

              {/* Render the chat history dynamically */}
              {chatHistory.map((chat, index) => (
                <ChatMessage key={index} chat={chat} />
              ))}
            </div>

            {/* Chatbot Footer */}
            <div className="chat-footer">
              <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
            </div>
          </div>
        </div>

        
      </div>
      <Footer />
      </main>
  );
};

export default Videos;