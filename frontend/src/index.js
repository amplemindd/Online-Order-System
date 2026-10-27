// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// // import App from './App';
// import reportWebVitals from './reportWebVitals';
// // import Loginform from './component/form';
// import Navi from './component/navi';
// // import CalculateBill from './component/price';
// import Project from './component/project';
// import Mainapp from './clswork/mainapp';
// import Mainappp from './homework/mainappp';
// import Appp from './Appp';
// import AddProductForm from './project/AddProductForm';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <AddProductForm/>
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();


import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import AddProductForm from "./project/AddProductForm";
import PrivacyPolicy from "./project/PrivacyPolicy";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <PrivacyPolicy />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();