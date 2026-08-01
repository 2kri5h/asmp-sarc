import React, { useEffect } from "react";
import UseFetchWishlist from "../../hooks/useFetchWishlist";
import UseDeleteFromWishlist from "../../hooks/useDeleteFromWishlist";
import Swal from "sweetalert2";
import UnifiedMentorCard from "../Mentors/UnifiedMentorCard";

export default function WishlistModalContent({ onSelect, selectedMentorIds = [] }) {
  const { fetchMentors, loading, error, mentors, setMentors } = UseFetchWishlist();
  const { deleteMentor } = UseDeleteFromWishlist();

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You want to remove this mentor from wishlist",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "YES",
        cancelButtonText: "CANCEL",
        customClass: {
          popup: 'custom-swal-popup',
          title: 'custom-swal-title',
          htmlContainer: 'custom-swal-text',
          confirmButton: 'custom-swal-confirm-btn',
          cancelButton: 'custom-swal-cancel-btn',
        },
        buttonsStyling: false
      });
      if (result.isConfirmed) {
        await deleteMentor(id);
        setMentors((m) => m.filter((mnt) => mnt.id !== id));
        Swal.fire({
          title: "Removed!",
          text: "Mentor has been removed from wishlist.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            popup: 'custom-swal-popup',
            title: 'custom-swal-title',
            htmlContainer: 'custom-swal-text',
            confirmButton: 'custom-swal-confirm-btn',
          },
          buttonsStyling: false
        });
      }
    } catch {
      Swal.fire({
        title: "Error!",
        text: "Failed to remove mentor from wishlist.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          popup: 'custom-swal-popup',
          title: 'custom-swal-title',
          htmlContainer: 'custom-swal-text',
          confirmButton: 'custom-swal-confirm-btn',
        },
        buttonsStyling: false
      });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-300">Loading...</div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-400">Error loading wishlist: {error}</div>
      </div>
    );
  if (!mentors || mentors.length === 0)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-300 text-center">
          <p className="text-lg font-semibold">No mentors in your wishlist</p>
          <p className="text-sm mt-2 text-gray-400">
            Add mentors to your wishlist to see them here.
          </p>
        </div>
      </div>
    );

  return (
    <div style={{ overflowY: "auto", padding: "0 0px" }}>
      <h2 className="wishlist-modal-title">MY WISHLIST</h2>
      <div className="wishlist-modal-grid">
        {mentors.map((mentor) => {
          const isAlreadySelected = selectedMentorIds.includes(mentor.id);
          return (
            <div key={mentor.id} className="selection-card-wrapper">
              <UnifiedMentorCard
                mentor={mentor}
                mentors={mentors}
                setMentors={setMentors}
                mode="selection"
                onSelect={isAlreadySelected ? undefined : onSelect}
                onDelete={handleDelete}
                showAddButton={false}
                showRemoveButton={true}
                isAlreadySelected={isAlreadySelected}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}