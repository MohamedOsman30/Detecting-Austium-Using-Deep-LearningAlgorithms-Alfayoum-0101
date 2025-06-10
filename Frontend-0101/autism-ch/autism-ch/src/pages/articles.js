import React, { useEffect, useRef, useState } from "react";
import Header from "../comps/header";
import Footer from "../comps/footer";
import { faComments } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Child from "../assets/child.jpeg";
import { Link } from "react-router-dom";
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
import AOS from "aos"; 
import "aos/dist/aos.css"; 

import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { companyInfo } from "./companyInfo";
import './chat.css';


import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";



const Articles = () => {
  const { language } = useLanguage();
  const t = useTrans();

    const articles = [
    { id: 1, title: t("WHAT_IS_AUTISM"), description: t("DES_1"), imageUrl: P4 },
    { id: 2, title: t("NEUROBIOLOGICAL"), description: t("DES_2"), imageUrl: P8 },
    { id: 3, title: t("EARLY_SIGNS"), description: t("DES_3"), imageUrl: P1 },
    { id: 4, title: t("CAUSES_OF_AUTISM"), description: t("DES_4"), imageUrl: P6 },
    { id: 5, title: t("REVOLUTIONIZING"), description: t("DES_5"), imageUrl: P9 },
    { id: 6, title: t("DETECTING_AUTISM"), description: t("DES_6"), imageUrl: P10 },
    { id: 7, title: t("COMPREHENSIVE_TREATMENT"), description: t("DES_7"), imageUrl: P2 },
    { id: 8, title: t("EFFECTIVE_TREATMENT"), description: t("DES_8"), imageUrl: P7 },
    { id: 9, title: t("FIRST_CASE"), description: t("DES_9"), imageUrl: P3 },
    { id: 10, title: t("HISTORY_OF_AUTISM"), description: t("DES_10"), imageUrl: P5 },
  ];


  const chunkedArticles = [];
  for (let i = 0; i < articles.length; i += 2) {
    chunkedArticles.push(articles.slice(i, i + 2));
  }



  
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

          <div className="half-circle" data-aos="fade-right"></div>
          <div className="circle"></div>

          <div className="half-circle2-w"></div>
          <div className="circle2-w"></div>
          <div className="circle3-w"></div>
          <div className="circle4-b"></div>
          <div className="half-circle3-b"></div> <br />

          <p className="qout">
            -{t("Autismisnot")}-
          </p>
          <p className="quot2">-{t("StuartDuncan")}</p>
          <hr className="hr2" />
        </div> <br /> <br /> <br /> <br /><br /><br />

        <div className="cards-container-artsec">
          {chunkedArticles.map((row, index) => (
            <div key={index} className={`card-row row-${index + 1}`}>
              {row.map((article) => (
                <div key={article.id} className="card-art">
                  <img src={article.imageUrl} alt={article.title} />
                  <div>
                    <h3>{article.title}</h3>
                    <p>{article.description}</p>
                    <Link to={`/articles/${article.id}`} className="link">{t("ReadMore")} </Link>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
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

      
      <Footer />
    </div>
  );
};

export default Articles;