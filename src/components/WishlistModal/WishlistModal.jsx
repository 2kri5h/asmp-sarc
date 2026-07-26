import React from "react";
import WishlistModalContent from "./WishlistModalContent";

export default function WishlistModal({ onClose, onSelect, selectedMentorIds = [] }) {
  return (
    <div
      className="fixed inset-0 bg-[#0c121d] bg-opacity-85 backdrop-blur-[2px] flex justify-center items-center z-50 p-2"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="wishlist-modal-container w-full max-w-[500px] h-[80vh] max-h-[650px] rounded-xl shadow-2xl p-6 relative flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-3 text-gray-400 hover:text-white text-xl z-10 font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <WishlistModalContent onSelect={onSelect} selectedMentorIds={selectedMentorIds} />
      </div>
    </div>
  );
}