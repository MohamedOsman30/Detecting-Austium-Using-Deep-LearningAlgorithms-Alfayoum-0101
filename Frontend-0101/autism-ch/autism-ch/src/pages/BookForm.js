import React, { useState, useEffect } from "react";
import BookSuc from "./BookSuc";
import Login from "../pages/login";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendar } from "react-icons/fa";
import { format } from 'date-fns';
import Header from "../comps/header";
import { useLanguage } from "../contexts/LanguageContext";
import useTrans from "../hooks/usetrans";
const BookForm = () => {
  const { language } = useLanguage();
    const t = useTrans();
  
  const [formData, setFormData] = useState({
    name: "",
    chName: "",
    gender: "",
    email: "",
    phone: "",
    age: "",
    doctor: "",
    day: "",
    date: "",
    time: "",
    price: "",
    doctorname: "",
    status: "Unpaid",
    history: "",
  });

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      const savedUser = localStorage.getItem(`userData_${authToken}`);
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setFormData((prevData) => ({
          ...prevData,
          name: user.name,
          photo: user.photo,
        }));
      } else {
        setShowLoginModal(true);
      }
    } else {
      setShowLoginModal(true);
    }
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://project-api.com/api/doctors");
        if (!response.ok) throw new Error("Failed to fetch doctors data");
        const data = await response.json();
        setDoctors(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchBookedAppointments = async () => {
      try {
        const response = await fetch("http://project-api.com/api/appointment-details");
        if (!response.ok) throw new Error("Failed to fetch booked appointments");
        const data = await response.json();
        setBookedAppointments(data.data);
      } catch (error) {
        console.error("Error fetching booked appointments:", error);
      }
    };
    fetchBookedAppointments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;

    if (name === "doctor") {
      parsedValue = parseInt(value, 10);
    }

    setFormData({ ...formData, [name]: parsedValue });

    if (name === "doctor") {
      const selectedDoctor = doctors.find((doctor) => doctor.id === parsedValue);
      if (selectedDoctor) {
        setFormData((prevData) => ({
          ...prevData,
          price: selectedDoctor.price,
          doctorname: `Dr. ${selectedDoctor.first_name} ${selectedDoctor.last_name}`,
          day: "",
          date: "",
          time: "",
        }));
      }
    }
  };

  const handleDateChange = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const dayName = format(date, 'EEEE');
    setFormData({ ...formData, date: formattedDate, day: dayName, time: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setShowLoginModal(true);
      return;
    }

    const transformedData = {
      ...formData,
      child_name: formData.chName,
      history: formData.history || "No history",
      date: formData.date,
      day: formData.day,
    };

    try {
      console.log("Submitting form data:", transformedData);
      const response = await fetch("http://project-api.com/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error response:", errorData);
        throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log("API response received:", data);
      const sessionId = data.session_id;

      if (!sessionId) {
        throw new Error("No session_id returned from API");
      }

      if (!window.Stripe) {
        throw new Error("Stripe.js not loaded");
      }

      const stripe = window.Stripe('pk_test_51RKQrfFY0pmFpDLoE36cwhlFIEC3ujTNyjUTYB1Ao6X3lGEbTuaEiSuk4IyLoCfgEMeJYc7Awez7b4yvZ5VHZv2V003205K0no');
      console.log("Redirecting to Stripe Checkout with session ID:", sessionId);
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Stripe redirect error:", error);
        alert(`Stripe redirect failed: ${error.message}`);
        throw new Error(`Stripe redirect error: ${error.message}`);
      }
    } catch (error) {
      console.error("Submission error:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const getAvailableDates = (availableDays) => {
    const dates = [];
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    const range = 30;

    for (let i = 0; i < range; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = daysOfWeek[date.getDay()];
      if (availableDays.includes(dayName)) {
        dates.push(date);
      }
    }

    return dates;
  };

  const selectedDoctor = doctors.find((doctor) => doctor.id === formData.doctor);
  const availableDays = selectedDoctor ? [selectedDoctor.Day1, selectedDoctor.Day2] : [];
  const availableDates = getAvailableDates(availableDays);

  const generateTimeSlots = () => {
    if (!selectedDoctor || !formData.day || !formData.date) return [];

    const isAvailableDay = [selectedDoctor.Day1, selectedDoctor.Day2].includes(formData.day);
    if (!isAvailableDay) return [];

    const existingBookings = bookedAppointments.filter(
      (appointment) =>
        appointment.doctor === formData.doctor &&
        appointment.date === formData.date &&
        appointment.day === formData.day
    );

    const bookedTimes = existingBookings.map((appointment) => appointment.time);

    const time1 = parseInt(selectedDoctor.time1, 10);
    const time2 = parseInt(selectedDoctor.time2, 10);

    const morningSlots = [];
    for (let hour = time1; hour < 12; hour++) {
      const timeString = `${hour}:00`;
      if (!bookedTimes.includes(timeString)) {
        morningSlots.push({
          value: timeString,
          display: `${hour === 0 ? 12 : hour}:00 AM`,
          period: "Morning",
        });
      }
    }

    const afternoonSlots = [];
    const endHour = Math.max(12, time2);
    for (let hour = 12; hour <= endHour; hour++) {
      const timeString = `${hour}:00`;
      if (!bookedTimes.includes(timeString)) {
        const displayHour = hour > 12 ? hour - 12 : hour;
        afternoonSlots.push({
          value: timeString,
          display: `${displayHour}:00 PM`,
          period: "Afternoon",
        });
      }
    }

    return [...morningSlots, ...afternoonSlots];
  };

  const availableTimeSlots = generateTimeSlots();

  const CustomInput = ({ value, onClick }) => (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.5rem",
        border: "1px solid #ccc",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      <FaCalendar /> <span>{value || t("SelectDay")}</span>
    </div>
  );

  const selectedDate = formData.date ? new Date(formData.date) : null;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className={`video-page ${language === "ar" ? "rtl" : "ltr"}`}>
      <Header />
    <div className="form-container">
      
      <Login
        isOpen={showLoginModal}
        closeModal={() => setShowLoginModal(false)}
        onLoginSuccess={(userData) => {
          const authToken = localStorage.getItem("authToken");
          if (authToken) {
            localStorage.setItem(`userData_${authToken}`, JSON.stringify(userData));
          }
          setFormData((prevData) => ({
            ...prevData,
            name: userData.name,
            photo: userData.photo,
          }));
          setShowLoginModal(false);
        }}
      />
      <form onSubmit={handleSubmit} className="form-box">
        <div className="form-grid">
          {[
            { name: "name", placeholder: t("YourName") },
            { name: "chName", placeholder: t("ChildName") },
            { name: "age", placeholder: t("ChildAge") },
            { name: "phone", placeholder: t("PhoneNumber"), type: "tel" },
            { name: "email", placeholder: t("Email"), type: "email" },
          ].map(({ name, placeholder, type = "text" }) => (
            <input
              key={name}
              type={type}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              className="form-input"
              required
            />
          ))}
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="">{t("SelectGender")}</option>
            <option value="Male">{t("Male")}</option>
            <option value="Female">{t("Female")}</option>
          </select>
          <select
            name="doctor"
            value={formData.doctor}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="">{t("SelectDoctor")}</option>
            {doctors.map(({ id, first_name, last_name }) => (
              <option key={id} value={id}>{`Dr. ${first_name} ${last_name}`}</option>
            ))}
          </select>
          <div className="form-input">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              includeDates={availableDates}
              customInput={<CustomInput />}
              dateFormat="yyyy-MM-dd"
              required
            />
          </div>
          <select
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="">{t("SelectTime")}</option>
            {availableTimeSlots.length > 0 && (
              <>
                <optgroup label={t("Afternoon")}>
                  {availableTimeSlots
                    .filter(slot => slot.period === 'Afternoon')
                    .map((slot, index) => (
                      <option key={`pm-${index}`} value={slot.value}>
                        {slot.display}
                      </option>
                    ))}
                </optgroup>
                <optgroup label={t("Morning")}>
                  {availableTimeSlots
                    .filter(slot => slot.period === 'Morning')
                    .map((slot, index) => (
                      <option key={`am-${index}`} value={slot.value}>
                        {slot.display}
                      </option>
                    ))}
                </optgroup>
              </>
            )}
          </select>
        </div>
        <textarea
          name="history"
          placeholder={t("History")}
          value={formData.history}
          onChange={handleChange}
          className="form-textarea"
        ></textarea>
        <button type="submit" className="form-button">
          {t("Confirm")}
        </button>
      </form>
      <BookSuc isOpen={showSuccessPopup} onClose={() => setShowSuccessPopup(false)} />
    </div>
    </main>
  );
};

export default BookForm;