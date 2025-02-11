import React from "react";
import { Routes, Route } from "react-router-dom"; // ✅ Import Routes
import Dashboard from "./Dashboard"; // ✅ Main dashboard
import Info from "./Info"; // ✅ Info page

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/info" element={<Info />} />
    </Routes>
  );
};

export default App;
