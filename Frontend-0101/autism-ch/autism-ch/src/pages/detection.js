import { useEffect, useRef, useState } from "react";
import Header from "../comps/header";
import Footer from "../comps/footer";
import Son from "../assets/son.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-regular-svg-icons';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

// Chatbot imports
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { companyInfo } from "./companyInfo";
import './chat.css';
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";
const Detection = () => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const { language } = useLanguage();
  const t = useTrans();
  // Chatbot state and logic
  const chatBodyRef = useRef();
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "model",
      text: companyInfo,
    },
  ]);

  // Handle button click to trigger file input
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Validate the file
  const validateFile = (file) => {
    if (!file) {
      setError("No file selected.");
      return false;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return false;
    }

    // Check file size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return false;
    }

    return true;
  };

  // Handle file selection
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!validateFile(file)) return;

    // Display the selected image
    setSelectedImage(URL.createObjectURL(file));
    setError(null); // Clear any previous errors

    // Send the file to the Flask API
    await sendImageToAPI(file);
  };

  // Handle drag-and-drop functionality
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (!validateFile(file)) return;

    // Display the dropped image
    setSelectedImage(URL.createObjectURL(file));
    setError(null); // Clear any previous errors

    // Send the file to the Flask API
    await sendImageToAPI(file);
  };

  // Send the image to the Flask API
  const sendImageToAPI = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      // Check if the API returned an error
      if (result.error) {
        setError(result.error); // Set the specific error message
        setPrediction(null); // Clear any previous prediction
      } else if (result.prediction) {
        setPrediction(result.prediction); // Set the prediction result
        setError(null); // Clear any errors
      } else {
        setError("Unexpected response from the server.");
      }
    } catch (error) {
      console.error('Error:', error);
      setError("An error occurred while processing the image.");
    }
  };

  // Generate chatbot response
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

  // Auto-scroll chat body when chat history updates
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [chatHistory]);

  return (
    <main className={`video-page ${language === "ar" ? "rtl" : "ltr"}`}>
      <Header />
      <div className="container-detect">
        <img src={Son} alt="" className="son" />
        <div
          className={`info-detect ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {selectedImage ? (
            <img src={selectedImage} alt="Selected" className="preview-image" />
          ) : (
            t("Selectanimage")
          )}
        </div>

        {prediction && (
          <div className="prediction-result">
            <h3>Prediction: {prediction}</h3>
          </div>
        )}
        <button className="b-detect" onClick={handleButtonClick}>
          <FontAwesomeIcon icon={faCamera} className="cam" />
        </button>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileChange}
        />

        {/* Display error message */}
        {error && (
          <div className="error-message">
            <p style={{ color: "red" }}>{error}</p>
          </div>
        )}

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

export default Detection;