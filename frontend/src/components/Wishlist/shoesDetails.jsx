import React from "react";
import styled from "styled-components";
import { Marginer } from "../marginer";
import "./shoeDetails.css";

const DetailsContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

const MediumText = styled.span`
  font-size: 18px;
  color: #fff;
  font-weight: 800;
  text-transform: uppercase;
`;

const SmallText = styled.span`
  font-size: 11px;
  color: #fff;
  font-weight: 700;
  text-transform: uppercase;
`;

const SpacedHorizontalContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BuyButton = styled.button`
  padding: 10px 16px;
  background-color: #fbbe01;
  color: #000;
  text-transform: uppercase;
  font-size: 16px;
  font-weight: 700;
  border: 3px solid transparent;
  outline: none;
  cursor: pointer;
  transition: all 290ms ease-in-out;
  border-radius: 8px;

  &:hover {
    background-color: transparent;
    color: #fff;
    border: 3px solid #fbbe01;
  }
`;

const NikeLogo = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: auto;
    height: 13px;
  }
`;

export function ShoesDetails({
  data,
  addToWishlist = null,
  deleteFromWishlist,
}) {
  return (
    <DetailsContainer style={{ marginTop: "-80px" }}>
      <h4
        style={{
          fontSize: "20px",
          fontFamily: "revert",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
        className="colr"
      >
        {data.designation} - {data.company_name}
      </h4>
      <h6 style={{ color: "#865dff" }} className="colr">
        {data.city}
      </h6>
      <h6 style={{ color: "#865dff" }} className="colr">
        {data.dept}
      </h6>
      <p
        className="hideScrollBar"
        style={{
          fontSize: "12px",
          paddingLeft: "10px",
          paddingRight: "10px",
          maxHeight: "120px",
          overflowY: "scroll",
          // scrollbarWidth: "thin", /* For Firefox */
          // scrollbarColor: "transparent transparent", /* For Firefox */
          // msOverflowStyle: "none" /* For IE and Edge */
        }}
      >
        {data.work_profile}
      </p>

      {data.should_show ? (
        !data.wishlisted && addToWishlist !== null ? (
          <button
            onClick={() => addToWishlist(data.id)}
            className="wishlistButton"
          >
            Add to WishList
          </button>
        ) : (
          <button
            onClick={() => deleteFromWishlist(data.id)}
            className="wishlistButton"
          >
            Remove from WishList
          </button>
        )
      ) : (
        <button
          onClick={() => deleteFromWishlist(data.id)}
          disabled={true}
          className="wishlistButton"
        >
          Mentor not Available
        </button>
      )}
      <NikeLogo>
        <img className="myimg" src={NikeImg} alt="Nike Logo" />
      </NikeLogo>
    </DetailsContainer>
  );
}
