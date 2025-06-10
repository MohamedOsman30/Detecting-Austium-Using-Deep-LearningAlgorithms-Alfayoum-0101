import { useEffect, useRef, useState } from "react";
import Article1 from "../assets/Article 1 home.jpeg";
import Article2 from "../assets/Article 2 home.jpg";
import Article3 from "../assets/Article 3.jpeg";
import F1 from "../assets/detection.jpg";
import F2 from "../assets/doctor.jpg";
import F3 from "../assets/doctor chat home.jpg";
import Carsoul1 from "../assets/home 1.png";
import Carsoul2 from "../assets/carsoul23 (2).jpg";
import Carsoul3 from "../assets/do1.jpg";
import { faComments } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AOS from "aos"; 
import "aos/dist/aos.css"; 
import Header from "../comps/header";
import Footer from "../comps/footer";


import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { companyInfo } from "./companyInfo";
import'./chat.css';
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";
const Home = () => {
  const { language } = useLanguage();
  const t = useTrans();
  useEffect(() => {
    AOS.init();
  }, []);

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
    chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div>
      <Header/>
      <div className="container-home">
        <div id="carouselExampleIndicators" class="carousel slide">
          <div class="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="0"
              class="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>
          <div class="carousel-inner">
            <div class="carousel-item active">
            <img
                src={Carsoul1}
                class="d-block  w-100"
                style={{ height: '90vh', objectFit: 'cover' }}
                alt="..."
              />
              <div class="carousel-caption container-caption">
                <h2 className="h2-caption">
                {t("understandC")} <br />
                <a href="./articles"><button>{t("revart")}</button></a>  
                </h2>
              </div>
            </div>
            <div class="carousel-item">
              <img
                src={Carsoul2}
                class=" d-block w-100"
                style={{ height: '90vh', objectFit: 'cover' }}
                alt="..."
              />
              <div class="carousel-caption container-caption">
                <h2 className="h2-caption">
                {t("learn")}  <br />
                  <a href="./videos"><button>{t("revvid")}</button></a>
                </h2>
              </div>
            </div>
            <div class="carousel-item">
              <img
                src={Carsoul3}
                class="d-block  w-100"
                style={{ height: '90vh', objectFit: 'cover' }}
                alt="..."
              />
             <div class="carousel-caption container-caption">
                <h2 className="h2-caption">
                {t("register")}<br />
                  <a href="./BookForm"><button>{t("book")}</button></a>
                </h2>
              </div>
            </div>
          </div>
        </div>
       
       

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




        <div className="statemnt1">
          <p
            className="b-state"
            data-aos="fade-up"
            data-aos-duration="1000" // مدة الحركة: 2000 مللي ثانية (2 ثانية)
          >
            {" "}
            {t("empower")}
          </p>
          <p
            className="state "
            data-aos="fade-up"
            data-aos-duration="1000" // مدة الحركة: 2000 مللي ثانية (2 ثانية)
          >
            {" "}
            “{t("join")}“ <br /> 
            
          </p>
        </div>

        <div className="container-all-card">
          <h3 className="header-card" data-aos="zoom-in">
            {" "}
            {t("knowMore")} 
          </h3>

          <div className="container-card">
            <div className="row row-cols-1 row-cols-md-3 g-4">
              <div className="col">
                <div className="card h-90" data-aos="fade-up">
                  <img src={Article1} className="card-img-top" alt="..." />
                  <div className="layer">
                    <p className="layer-p">
                    {t("what")}  <span className="diff-color">{t("autism")} </span>
                    </p>
                    <a href="./articles/1"><button className="card-b">{t("viewart")}</button></a>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title c">Card title</h5>
                    <p className="card-text c">
                      This is a wider card with supporting text below as a
                      natural lead-in to additional content. This content is a
                      little bit longer.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card h-90" data-aos="fade-up">
                  <img src={Article2} className="card-img-top" alt="..." />
                  <div className="layer">
                    <p className="layer-p">
                    {t("cause")} &nbsp;
                    <span className="diff-color">{t("autism2")}</span>
                    </p>
                    <a href="./articles/4"><button className="card-b">{t("viewart")}</button></a>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title c">Card title</h5>
                    <p className="card-text c">
                      This is a wider card with supporting text below as a
                      natural lead-in to additional content. This content is a
                      little bit longer.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card h-90" data-aos="fade-up">
                  <img src={Article3} className="card-img-top" alt="..." />
                  <div className="layer">
                    <p className="layer-p">
                    {t("history")} &nbsp;
                    <span className="diff-color">{t("autism2")}</span>
                    </p>
                    <a href="./articles/10"><button className="card-b">{t("viewart")}</button></a>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title c">Card title</h5>
                    <p className="card-text c">
                      This is a wider card with supporting text below as a
                      natural lead-in to additional content. This content is a
                      little bit longer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
          <a href="./articles"><button className="button-article" data-aos="fade-up">
          {t("viewArticles")}
            </button></a>
        </div>
        <div className="statemnt1">
          <p className="state" data-aos="fade-up" data-aos-duration="1000">
            {" "}
            {t("state1")}
          </p>
        </div>
        <div className="container-all-card">
          <h3 className="header-card" data-aos="zoom-in">
            {" "}
            {t("understand")}  {t("child")}
          </h3>

          <div className="container-card">
            <div className="row row-cols-1 row-cols-md-3 g-4">
              <div className="col">
                <div className="card h-90" data-aos="fade-up">
                  <iframe
                    className="vid"
                    height="250"
                    src="https://www.youtube.com/embed/j3PrAqJ-H9k?si=jRGXRS8COUxx91kB"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                  <div className="layer">
                    <p className="layer-p">
                    {t("atypical")}
                    </p>
                  
                  </div>
                  <div className="card-body">
                    <h5 className="card-title c">Card title</h5>
                    <p className="card-text c">
                      This is a wider card with supporting text below as a
                      natural lead-in to additional content. This content is a
                      little bit longer.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card h-90" data-aos="fade-up">
                  <iframe
                    className="vid"
                    height="250"
                    src="https://www.youtube.com/embed/Nf5GlbRkRys?si=kZriZ7KJbUBW-NQS"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                  <div className="layer">
                    <p className="layer-p">
                    {t("tip")}
                    </p>
                    
                  </div>
                  <div className="card-body">
                    <h5 className="card-title c">Card title</h5>
                    <p className="card-text c">
                      This is a wider card with supporting text below as a
                      natural lead-in to additional content. This content is a
                      little bit longer.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card h-90" data-aos="fade-up">
                  <iframe
                    className="vid"
                    height="250"
                    src="https://www.youtube.com/embed/9j6fxcRXF60?si=8vSX5j_6fFMGRsVv"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                  <div className="layer">
                    <p className="layer-p">
                    {t("viewVideos")}
                    </p>
                    
                  </div>
                  <div className="card-body">
                    <h5 className="card-title c">Card title</h5>
                    <p className="card-text c">
                      This is a wider card with supporting text below as a
                      natural lead-in to additional content. This content is a
                      little bit longer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <a href="./videos" >  <button className="button-article" data-aos="fade-up">
          {t("viewVideos")}
            </button></a>
        </div>
        <div className="statemnt1">
          <p className="state" data-aos="fade-up" data-aos-duration="1000">
          {t("state2")}
          </p>
        </div>

        <div className="container-all-card">
          <h3 className="header-card" data-aos="zoom-in">
            {" "}
            {t("extra")}
          </h3>

          <div className="container-card">
            <div className="row row-cols-1 row-cols-md-3 g-4">
              <div className="col">
                <div className="card h-90" data-aos="fade-up">
                  <img src={F1} className="card-img-top" alt="..." />
                  <div className="layer">
                    <p className="layer-p">
                    <span className="diff-color">{t("check")}</span> {t("ch")} <br />
                    </p>
                    <a href="./detection"><button className="card-b">{t("detect")}</button></a>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title c">Card title</h5>
                    <p className="card-text c">
                      This is a wider card with supporting text below as a
                      natural lead-in to additional content. This content is a
                      little bit longer.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card h-90" data-aos="fade-up">
                  <img src={F2} className="card-img-top" alt="..." />
                  <div className="layer">
                    <p className="layer-p">
                    <span className="diff-color">{t("boo")}</span> {t("app")}
                    </p>
                    <a href="./BookForm"><button className="card-b">{t("bookNow")}</button></a>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title c">Card title</h5>
                    <p className="card-text c">
                      This is a wider card with supporting text below as a
                      natural lead-in to additional content. This content is a
                      little bit longer.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card h-90" data-aos="fade-up">
                  <img src={F3} className="card-img-top" alt="..." />
                  <div className="layer">
                    <p className="layer-p">
                    <span className="diff-color">{t("contact")}</span> <br />
                    {t("do")}
                    </p>
                    <button className="card-b" onClick={() => window.open("http://chatapp.com/login.php", "_blank")}>{t("doctorChat")}</button>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title c">Card title</h5>
                    <p className="card-text c">
                      This is a wider card with supporting text below as a
                      natural lead-in to additional content. This content is a
                      little bit longer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <br />
            <br />
            <br />
          </div>
        
        </div>
        <br />
        <br />
        <br />
      </div>
      <Footer/>
    </div> // base
  );
};

export default Home;