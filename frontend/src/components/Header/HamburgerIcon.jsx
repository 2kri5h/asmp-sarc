import React from "react";
import styled from "styled-components";

const Checkbox = ({ isOpen, toggleOpen }) => {
  return (
    <StyledWrapper>
      <label className="hamburger">
        <input
          type="checkbox"
          checked={isOpen}
          onChange={toggleOpen}
        />

        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path className="line line-top" d="M7 10 H25" />
          <path className="line line-middle" d="M7 16 H25" />
          <path className="line line-bottom" d="M7 22 H25" />
        </svg>
      </label>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .hamburger {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;

    cursor: pointer;
  }

  .hamburger input {
    display: none;
  }

  .hamburger svg {
    display: block;

    width: 3em;
    height: 3em;
    margin: 0;
    padding: 0;

    overflow: visible;
  }

  .line {
    fill: none;
    stroke: #121b3d;
    stroke-width: 3;
    stroke-linecap: round;

    transition:
      transform 300ms ease,
      opacity 300ms ease;

    transform-box: view-box;
    transform-origin: center;
  }

  .hamburger input:checked + svg .line-top {
    transform: translateY(6px) rotate(45deg);
  }

  .hamburger input:checked + svg .line-middle {
    opacity: 0;
  }

  .hamburger input:checked + svg .line-bottom {
    transform: translateY(-6px) rotate(-45deg);
  }

  @media (max-width: 600px) {
    .hamburger svg {
      width: 2.7em;
      height: 2.7em;
    }
  }

  @media (max-width: 490px) {
    .hamburger svg {
      width: 2.5em;
      height: 2.5em;
    }
  }
`;

export default Checkbox;