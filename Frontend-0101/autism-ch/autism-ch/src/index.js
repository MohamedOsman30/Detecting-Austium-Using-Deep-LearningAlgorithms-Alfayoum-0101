import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"
import Videos from "./pages/videos";
import Articles from "./pages/articles";
import Booking from "./pages/booking";
import Detection from "./pages/detection";
import Home from "./pages/home";
import Success from "./pages/BookSuc";
import BookForm from './pages/BookForm';
import Carticle from "./pages/Carticle";
import UserProfile from "./pages/UserProfile";
import Useredit from "./pages/useredit";
import AuthCallback from "./pages/AuthCallback";
import Docprof from "./pages/docProf"
import DocEdit from "./pages/docEdit"
import Appointemnt from "./pages/appointemnt"
import Patients from "./pages/patients";
import Schdule from "./pages/schdule"
import BookingSuccess from './pages/BookingSuccess';
import BookingCanceled from './pages/BookingCanceled';
import { LanguageProvider } from "./contexts/LanguageContext";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";

const router = createBrowserRouter([
{
  path: "/",
  element:  <Home/>,
  errorElement: <h1>SORRY</h1>
},
{
  path: "/videos",
  element:  <Videos/>,
  errorElement: <h1>SORRY</h1>
},

{
  path: "/articles",
  element:  <Articles/>,
  errorElement: <h1>SORRY</h1>
},
{
  path: "/booking",
  element:  <Booking/>,
  errorElement: <h1>SORRY</h1>
},
{
  path: "/detection",
  element:  <Detection/>,
  errorElement: <h1>SORRY</h1>
},
{
  path: "/BookSuc",
  element:  <Success/>,
  errorElement: <h1>SORRY</h1>
},
{
  path: "/Carticle",
  element:  <Carticle/>,
  errorElement: <h1>SORRY</h1>
},
{
  path: "/BookForm",
  element:  <BookForm/>,
  errorElement: <h1>SORRY</h1>
},{
  path: "/UserProfile",
  element:  <UserProfile/>,
  errorElement: <h1>SORRY</h1>
},
{
  path: "/useredit",
  element:  <Useredit/>,
  errorElement: <h1>SORRY</h1>
},
{
  path: "/articles/:id",
  element:  <Carticle/>,
  errorElement: <h1>SORRY</h1>
},
{
  path: "/docProf",
  element:  <Docprof/>,
  errorElement: <h1>SORRY</h1>
}
,
{
  path: "/docEdit",
  element:  <DocEdit/>,
  errorElement: <h1>SORRY</h1>
},
{
  path: "/AuthCallback",
  element:  <AuthCallback/>,
  errorElement: <h1>SORRY</h1>
},
{
  path: "/Appointemnt",
  element:  <Appointemnt/>,
  errorElement: <h1>SORRY</h1>
},
{
  path: "/patients",
  element:  <Patients/>,
  errorElement: <h1>SORRY</h1>
},
{
  path: "/schdule",
  element:  <Schdule/>,
  errorElement: <h1>SORRY</h1>
},
{
  path: "/booking-success",
  element:  <BookingSuccess />,
  errorElement: <h1>SORRY</h1>
},
{
  path: "/booking-canceled",
  element:  <BookingCanceled />,
  errorElement: <h1>SORRY</h1>
},

]

)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

