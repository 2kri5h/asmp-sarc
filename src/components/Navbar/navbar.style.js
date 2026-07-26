import styled, { keyframes } from "styled-components";

export const NavbarContainer = styled.nav`
  display: flex;
  flex-direction: column;
  height: 10vh;
  width: 100vw;

  position: fixed;
  top: 0;
  left: 0;

  background: #a4b4b8;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;

  @media (max-width: 600px) {
    height: 60px;
  }

  @media (max-width: 490px) {
    height: 58px;
  }
`;

export const NavbarInnerContainer = styled.div`
  display: flex;
  align-items: center;

  height: 100%;
  width: 100%;
`;

export const LeftContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100%;
  width: 12%;
  box-sizing: border-box;

  img {
    display: block;
    width: auto;
    height: 82%;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  @media (max-width: 1050px) {
    width: 15%;
  }

  @media (max-width: 600px) {
    width: 24%;
    justify-content: flex-start;
    padding-left: 10px;

    img {
      height: 80%;
      transform: translateY(5px);
    }
  }

  @media (max-width: 490px) {
    width: 25%;
    padding-left: 8px;

    img {
      height: 78%;
      transform: translateY(4px);
    }
  }
`;
export const MiddleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100%;
  width: 78%;

  @media (max-width: 1050px) {
    width: 75%;
  }

  @media (max-width: 600px) {
    width: 64%;
  }

  @media (max-width: 490px) {
    width: 60%;
  }
`;

export const MiddleInnerContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  height: 100%;
  width: 100%;

  color: #121b3d;
  font-size: 1.5rem;
  list-style-type: none;
  text-decoration: none;

  li {
    display: flex;
    align-items: center;
    justify-content: center;

    min-height: 70px;
    padding: 12px 25px;

    color: #121b3d;
    border: 10px solid transparent;
    border-radius: 999px;

    box-sizing: border-box;
    cursor: pointer;

    transition:
      border-color 0.25s ease,
      background-color 0.25s ease,
      color 0.25s ease;
  }

  li:hover {
    color: #121b3d;
  }

  .selected {
    color: #121b3d;
    background-color: #a4b4b8;
    border: 10px solid #334956;
    border-radius: 999px;
    font-weight: 400;
  }

  .selected:hover {
    color: #121b3d;
    background-color: #a4b4b8;
    border-color: #334956;
  }

  @media (max-width: 1200px) {
    font-size: 1.35rem;

    li {
      min-height: 64px;
      padding: 10px 20px;
      border-width: 8px;
    }

    .selected {
      border-width: 8px;
    }
  }

  @media (max-width: 1050px) {
    font-size: 1.25rem;

    li {
      min-height: 58px;
      padding: 9px 16px;
      border-width: 7px;
    }

    .selected {
      border-width: 7px;
    }
  }

  @media (max-width: 950px) {
    display: none;
  }
`;

export const RightContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100%;
  width: 10%;
  box-sizing: border-box;
  color: white;

  & > * {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 600px) {
    width: 12%;
  }

  @media (max-width: 490px) {
    width: 15%;
  }
`;

const slideIn = keyframes`
  from {
    transform: translate(200px, -200px);
    opacity: 0;
  }

  to {
    transform: translate(0, 0);
    opacity: 1;
  }
`;

export const NavbarExtendedContainer = styled.div`
  position: fixed;
  top: -220px;
  right: -120px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;

  gap: 5%;
  height: 600px;
  width: 600px;
  padding-bottom: 5%;

  z-index: 1000;
  overflow: hidden;

  background: rgba(0, 0, 0, 0.5);
  border: 0 solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;

  backdrop-filter: blur(5px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);

  list-style-type: none;
  font-size: 19px;
  font-weight: 500;

  animation: ${slideIn} 0.5s ease-out forwards;
  clip-path: ellipse(0% 0%, 100% 0%, 100% 85%, 0% 100%);

  &::before {
    content: "";
    position: absolute;
    top: -20%;
    right: -20%;

    width: 140%;
    height: 140%;

    background: #a4b4b8;
    filter: blur(40px);
    z-index: -1;

    animation: ${slideIn} 1s ease-out forwards;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    background: #a4b4b8;
    clip-path: polygon(0% 10%, 100% 0%, 100% 85%, 0% 100%);
    z-index: -1;
  }

  li {
    padding: 10px 0;

    color: #121b3d;
    text-shadow: 0 0 5px #2f3750;
    cursor: pointer;

    transition:
      color 0.3s ease,
      text-shadow 0.3s ease;

    &:hover {
      color: #040817;
      text-shadow:
        0 0 10px #1c233e,
        0 0 20px #161d35;
    }
  }

  @media (max-width: 1100px) {
    height: 600px;
    width: 600px;
    gap: 5%;
  }

  @media (max-width: 950px) {
    height: 750px;
    width: 750px;
    padding-bottom: 5%;
    gap: 1%;
  }

  @media (max-width: 800px) {
    height: 700px;
    width: 700px;
    gap: 0;
  }
`;