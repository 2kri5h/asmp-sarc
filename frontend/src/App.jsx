import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import React from "react";
import "./App.css";
import Team from "./components/Team/Team";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Sneakpeak from "./components/SneakPeak/SneakPeak";
import EventImages from "./components/Events/Events";
import Profile from "./components/Profile/Profile";
import Navbar from "./components/Header/Navbar";
import Homee from "./components/Home/Homee";
import Toggle from "./components/Toggle/Toggle";
import WishList from "./components/Wishlist/Wishlist";

// Inside your routing configuration
function App() {
  return (
    <>
      <Router>
        <Navbar></Navbar>
        <Routes>
          <Route path="" element={<Homee></Homee>}></Route>
          <Route path="/team" element={<Team />}></Route>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/toggle" element={<Toggle />} />
          <Route path="/wishlist" element={<WishList />} />
          <Route path="/events" element={<div id="evetns"><EventImages /></div>} />
          <Route path="/sneakPeeks" element={<Sneakpeak />} />
        </Routes>
      </Router>
    </>
  );
}
export default App;
