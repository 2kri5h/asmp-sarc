import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import Loader from "./components/Loader/Loader";

// showLoader starts true on every mount. A full page refresh always
// remounts this component from scratch, so the loader naturally plays
// every time the page is refreshed. Client-side <Link> navigation does
// NOT remount AppContent, so the loader does not replay on in-app nav.
function AppContent() {
  const [showLoader, setShowLoader] = React.useState(true);

  return (
    <>
      <Navbar />

      {/*
        The real route always renders immediately underneath the loader —
        whatever URL was refreshed (e.g. /profile) is what's mounted here,
        so when the tear/zoom reveals it, the user lands back where they
        refreshed from instead of being redirected to a fixed splash page.
      */}
      <Routes>
        <Route path="/" element={<Homee />} />
        <Route path="/home" element={<Homee />} />
        <Route path="/team" element={<Team />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/toggle" element={<Toggle />} />
        <Route path="/wishlist" element={<WishList />} />
        <Route path="/events" element={<div id="evetns"><EventImages /></div>} />
        <Route path="/sneakPeeks" element={<Sneakpeak />} />
      </Routes>

      {showLoader && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
          <Loader onComplete={() => setShowLoader(false)} />
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
export default App;
