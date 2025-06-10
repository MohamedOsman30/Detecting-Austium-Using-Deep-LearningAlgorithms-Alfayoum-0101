import Header from "./comps/header";
import "./App.css";
import Footer from "./comps/footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Videos from "./pages/videos";
import Articles from "./pages/articles";
import Patients from "./pages/patients";
import Booking from "./pages/booking";
import Detection from "./pages/detection";
import Home from "./pages/home";
import Success from "./pages/BookSuc";
import Carticle from "./pages/Carticle";
import AOS from "aos";
import BookForm from "./pages/BookForm"
import "aos/dist/aos.css";
import UserProfile from "./pages/UserProfile";
import Useredit from "./pages/useredit";
import DocEdit from "./pages/docEdit"
import Docprof from "./pages/docProf"
import AuthCallback from "./pages/AuthCallback"
import Appointemnt from "./pages/appointemnt"
import Schdule from "./pages/schdule"
import BookingSuccess from './pages/BookingSuccess';
import BookingCanceled from './pages/BookingCanceled';
import { LanguageProvider } from "./contexts/LanguageContext";
function App() {


  return (
    <LanguageProvider>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/detection" element={<Detection />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/BookSuc" element={<Success/>} />
        <Route path="/BookForm" element={<BookForm/>} />
        <Route path="/UserProfile" element={<UserProfile/>} />
        <Route path="/useredit" element={<Useredit/>} />
        <Route path="/articles/:id" element={<Carticle/>}/>
        <Route path="/docEdit" element={<DocEdit/>}/>
        <Route path="/docProf" element={<Docprof/>}/>
        <Route path="/AuthCallback" element={<AuthCallback/>}/>
        <Route path="/appointemnt" element={<Appointemnt/>}/>
        <Route path="/patients" element={<Patients/>}/>
        <Route path="/schdule" element={<Schdule/>}/>
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/booking-canceled" element={<BookingCanceled />} />
      </Routes>
      
      <footer />
    </Router>
    </LanguageProvider>
  );
}

export default App;

