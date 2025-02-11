import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Use ReactDOM.createRoot
import { BrowserRouter } from "react-router-dom"; // ✅ Ensure router is here
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")); // ✅ Use createRoot
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
