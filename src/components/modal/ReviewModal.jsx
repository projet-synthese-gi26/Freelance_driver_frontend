"use client"
import React, { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import Modal from "react-modal";
import { useContextProvider } from "../review/context";
import { reviewService } from "@/service/reviewService";
//import {REVIEW_SERVICE_URL} from "@/components/UrlConfig.js";

const ReviewModal = ({ user_id, rated_entity_id, rated_entity_type, user_name }) => {
  // const REVIEW_SERVICE_URL = process.env.REVIEW_SERVICE_URL;
  // let REVIEW_SERVICE_URL = "http://localhost:8080/review-service"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ratingStar, setRatingStar] = useState(0);
  const [reviewerComment, setReviewerComment] = useState("");

  const { reload, setReload, refresh, setRefresh } = useContextProvider();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Réinitialiser les champs du formulaire
    setRatingStar(0);
    setReviewerComment("");
  };

  const handleSubmitCommentForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(formData);
    const data = Object.fromEntries(formData);

    const normalizeSubjectType = (value) => {
      if (!value) return null;
      const v = String(value).trim().toUpperCase();
      if (v === "DRIVER" || v === "VEHICLE" || v === "PRODUCT" || v === "CLIENT" || v === "ORGANISATION" || v === "PLATFORM" || v === "REVIEW") {
        return v;
      }
      return null;
    };

    const subjectType = normalizeSubjectType(rated_entity_type);
    const subjectId = rated_entity_id;

    if (!subjectType || !subjectId) {
      console.error("ReviewModal: invalid subject", { rated_entity_type, rated_entity_id });
      handleCloseModal();
      return;
    }

    try {
      const created = await reviewService.createReview({
        subjectId,
        subjectType,
        reviewType: "RATING",
        rating: ratingStar + 1,
        comment: (data["reviewer-comment"]?.toString() || "").trim(),
      });

      console.log("result ReviewModal: ", created);
      setReload(!reload);
      setRefresh(!refresh);
    } catch (error) {
      console.error("ReviewModal, Error:", error);
    }
    //e.currentTarget.reset();
    handleCloseModal();
  };

  return (
    <>
      <button
        type="button"
        className="featured-tab link font-semibold clr-primary-400 inline-block py-3 px-6 bg-[var(--primary-light)]  hover:bg-[#2D3A96] hover:text-[var(--tertiary)] rounded-[20px] active"
        onClick={handleOpenModal}
      >
        <div className="flex gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((index) => (
            <StarIcon
              key={index}
              className={`w-5 h-5`}
              style={{ cursor: "pointer" }}
            />
          ))}
        </div>
       New Comment
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        className="bg-white rounded-2xl p-3 sm:p-4 lg:py-8 lg:px-5 outline-none max-w-md w-full"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >

        <h4 className="mb-0 text-2xl font-semibold">Write a comment</h4>
        <div className="border border-dashed my-6"></div>
        <p className="text-xl font-medium mb-3">Evaluation </p>
        <div className="flex gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((starValue, index) => (
            <StarIcon
              key={index}
              onClick={() => setRatingStar(index)}
              className={`w-10 h-10 ${
                index <= ratingStar
                  ? "text-[var(--tertiary)]"
                  : "text-[#AAAAAA]"
              }`}
              style={{ cursor: "pointer" }}
            />
          ))}
        </div>
        <form onSubmit={handleSubmitCommentForm}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <label
                htmlFor="review-review"
                className="text-xl font-medium block mb-3"
              >
                Comment
              </label>
              <textarea
                id="review-review"
                rows={5}
                className="bg-[var(--bg-1)] border rounded-2xl py-3 px-5 w-full focus:outline-none"
                name="reviewer-comment"
                value={reviewerComment}
                onChange={(e) => setReviewerComment(e.target.value)}
              ></textarea>
            </div>
            <div className="col-span-12">
              <button
                type="submit"
                className="featured-tab link font-semibold clr-primary-400 inline-block py-3 px-6 bg-[var(--primary-light)] hover:bg-primary hover:text-[var(--tertiary)] rounded-full active"
              >
                Send
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ReviewModal;
