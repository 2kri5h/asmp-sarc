import React, { useState, useEffect } from "react";
import { Spin as Hamburger } from "hamburger-react";
import Checkbox from "./HamburgerIcon";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/images/sarclogo.png";
import {
  NavbarContainer,
  LeftContainer,
  MiddleContainer,
  RightContainer,
  NavbarInnerContainer,
  MiddleInnerContainer,
  NavbarExtendedContainer,
} from "./navbar.style";
import { Zoom } from "swiper/modules";

function NavbarContent({ navigate, location }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const [isBigScreen, setIsBigScreen] = useState(window.innerWidth > 950);
  // const [isLogged, setLogged] = useState(localStorage.getItem('accessToken') ? true : setLogged(false));

  // let accessToken = localStorage.getItem('accessToken')

  const notLoggedNavigationItems = [
    {
      name: "Sneak Peeks",
      to: "sneakPeeks",
      className: "sneakPeeks",
      id: "sneakPeeks",
      navLink: "/sneakPeeks",
    },
    {
      name: "Events",
      to: "events",
      className: "events",
      id: "events",
      navLink: "/events",
    },
    {
      name: "Testimonial",
      to: "testimonials",
      className: "testimonials",
      id: "testimonials",
      navLink: "/",
    },
    {
      name: "Login",
      to: "login",
      className: "login",
      id: "login",
      navLink: "/login",
    },
    {
      name: "Register",
      to: "register",
      className: "register",
      id: "register",
      navLink: "/register",
    },
  ];

  const loggedNavigationItems = [
    {
      name: "Sneak Peeks",
      to: "sneakPeeks",
      className: "sneakPeeks",
      id: "sneakPeeks",
      navLink: "/sneakPeeks",
    },
    {
      name: "Events",
      to: "events",
      className: "events",
      id: "events",
      navLink: "/events",
    },
    {
      name: "Testimonial",
      to: "testimonials",
      className: "testimonials",
      id: "testimonials",
      navLink: "/",
    },
    {
      name: "Wishlist",
      to: "wishlist",
      className: "wishlist",
      id: "wishlist",
      navLink: "/wishlist",
    },
    {
      name: "Choose your Mentors",
      to: "toggle",
      className: "toggle",
      id: "toggle",
      navLink: "/toggle",
    },
    localStorage.getItem("accessToken") && {
      name: "Submit",
      to: "profile",
      className: "profile-nav",
      id: "profile-nav",
      navLink: "/profile",
    },
  ];

  const NavBigScreen = [
    { name: "FAQ", to: "faq", className: "faq", id: "faq", navLink: "/" },
    {
      name: "Team",
      to: "team",
      className: "team",
      id: "team",
      navLink: "/team",
    },
  ];

  const loggedNavSmallScreen = [
    {
      name: "Sneak Peeks",
      to: "sneakPeeks",
      className: "sneakPeeks",
      id: "sneakPeeks",
      navLink: "/sneakPeeks",
    },
    {
      name: "Events",
      to: "events",
      className: "events",
      id: "events",
      navLink: "/events",
    },
    {
      name: "Testimonial",
      to: "testimonials",
      className: "testimonials",
      id: "testimonials",
      navLink: "/",
    },
    { name: "FAQ", to: "faq", className: "faq", id: "faq", navLink: "/" },
    {
      name: "Team",
      to: "team",
      className: "team",
      id: "team",
      navLink: "/team",
    },
    {
      name: "Wishlist",
      to: "wishlist",
      className: "wishlist",
      id: "wishlist",
      navLink: "/wishlist",
    },
    {
      name: "Choose your Mentors",
      to: "toggle",
      className: "toggle",
      id: "toggle",
      navLink: "/toggle",
    },
    {
      name: "Submit",
      to: "profile",
      className: "profile-nav",
      id: "profile-nav",
      navLink: "/profile",
    },
  ];

  const notLoggedNavSmallScreen = [
    {
      name: "Sneak Peeks",
      to: "sneakPeeks",
      className: "sneakPeeks",
      id: "sneakPeeks",
      navLink: "/sneakPeeks",
    },
    {
      name: "Events",
      to: "events",
      className: "events",
      id: "events",
      navLink: "/events",
    },
    {
      name: "Testimonial",
      to: "testimonials",
      className: "testimonials",
      id: "testimonials",
      navLink: "/",
    },
    { name: "FAQ", to: "faq", className: "faq", id: "faq", navLink: "/" },
    {
      name: "Team",
      to: "team",
      className: "team",
      id: "team",
      navLink: "/team",
    },
    {
      name: "Login",
      to: "login",
      className: "login",
      id: "login",
      navLink: "/login",
    },
    {
      name: "Register",
      to: "register",
      className: "register",
      id: "register",
      navLink: "/register",
    },
  ];

  const handleItemClick = (item) => {
    const navigateRoutes = [
      "/team",
      "/register",
      "/login",
      "/profile",
      "/toggle",
      "/sneakPeeks",
      "/events",
      "/wishlist",
    ];

    if (navigateRoutes.includes(item.navLink)) {
      // Reset scroll position so the new route opens at the top
      // instead of inheriting the scroll offset from the page you left.
      window.scrollTo(0, 0);

      if (navigate) {
        navigate(item.navLink);
      } else {
        window.location.href = item.navLink;
      }
    } else if (item.navLink === "/") {
      if (navigate) {
        navigate("/");
      } else {
        window.location.href = "/";
      }
      setTimeout(() => handleScroll(item.to), 100);
    } else {
      if (navigate) {
        navigate(item.navLink);
      } else {
        window.location.href = item.navLink;
      }
      handleScroll(item.to);
    }

    setSelectedItem(item.id);
    setOpen(false);
  };

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setSelectedItem(id);
    }
    // Dispatch custom event for testimonials and FAQ
    if (id === "testimonials" || id === "faq") {
      window.dispatchEvent(
        new Event(`scrollTo${id.charAt(0).toUpperCase() + id.slice(1)}`)
      );
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsBigScreen(window.innerWidth > 950);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <NavbarContainer>
      <NavbarInnerContainer>
        <LeftContainer>
          <img
            src={logo}
            alt="Logo"
            onClick={() => navigate("/")}
            style={{ objectFit: "100% 100%" }}
          />
        </LeftContainer>
        <MiddleContainer>
          <MiddleInnerContainer>
            {(localStorage.getItem("accessToken")
              ? loggedNavigationItems
              : notLoggedNavigationItems
            ).map((item) => (
              <li
                key={item.name}
                className={`${item.className} ${selectedItem === item.className ? "selected" : ""}`}
                onClick={() => handleItemClick(item)}
                id={item.id}
                style={{
                  cursor: "pointer",
                  fontFamily: "Fraunces, serif",
                  fontSize: "1.5rem",
                  lineHeight: "1.2",
                }}
              >
                {item.name}
              </li>
            ))}
          </MiddleInnerContainer>
        </MiddleContainer>
        <RightContainer style={{ zIndex: "10000" }}>
          {/* <Hamburger toggled={isOpen} toggle={setOpen} size={35} /> */}
          <Checkbox isOpen={isOpen} toggleOpen={() => setOpen(!isOpen)} />
        </RightContainer>
      </NavbarInnerContainer>

      {isOpen && (
        <NavbarExtendedContainer>
          {(isBigScreen
            ? NavBigScreen
            : localStorage.getItem("accessToken")
            ? loggedNavSmallScreen
            : notLoggedNavSmallScreen
          ).map(
            (item) =>
              item && (
                <li
                  key={item.name}
                  className={`${item.className} ${selectedItem === item.className ? "selected" : ""}`}
                  onClick={() => handleItemClick(item)}
                  id={item.id}
                  style={{
                    cursor: "pointer",
                    fontFamily: "Fraunces, serif",
                    fontSize: "1.5rem",
                    lineHeight: "1.2",
                  }}
                >
                  {item.name}
                </li>
              )
          )}
        </NavbarExtendedContainer>
      )}
    </NavbarContainer>
  );
}

export default function Navbar(props) {
  const navigateHook = React.useCallback(() => {
    try {
      return useNavigate();
    } catch {
      return null;
    }
  }, []);

  const locationHook = React.useCallback(() => {
    try {
      return useLocation();
    } catch {
      return null;
    }
  }, []);

  const navigate = navigateHook();
  const location = locationHook();

  return <NavbarContent navigate={navigate} location={location} {...props} />;
}