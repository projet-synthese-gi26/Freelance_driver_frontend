"use client"
import React, { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import Modal from "react-modal";
import { v4 as uuidv4 } from "uuid";
import { useContextProvider } from "../review/context";
//import {REVIEW_SERVICE_URL} from "@/components/UrlConfig.js";

const ReviewModal = ({ user_id, rated_entity_id, rated_entity_type, user_name }) => {
  // const REVIEW_SERVICE_URL = process.env.REVIEW_SERVICE_URL;
  // let REVIEW_SERVICE_URL = "http://localhost:8080/review-service"
  const REVIEW_SERVICE_URL = "http://localhost:8000";
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
    const reviewId = uuidv4();
    const formData = new FormData(e.currentTarget);
    console.log(formData);
    const data = Object.fromEntries(formData);


    const newComment = {
      user_id: user_id,
      rated_entity_id: "",
      rated_entity_type:"",
      reviewer_name: user_name,
      comment: data["reviewer-comment"].toString(),
      created_at: new Date().toString,
      updated_at: new Date().toString(),
      note: ratingStar + 1,
      likes_count: 0,
      dislikes_count: 0,
      icon:
        ratingStar == 1 || ratingStar == 2
          ? "hand_down"
          : 3
          ? "hand_up"
          : 4
          ? "heart"
          : "star",
    };
    console.log("New comment", newComment);
    const finalPath = REVIEW_SERVICE_URL + "/api/reviews/create";
    console.log(finalPath);

    try {
      const response = await fetch(finalPath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      });

      if (!response.ok) {
        console.error("Response error:", response.status, response.statusText);
        const errorData = await response.json();
        console.error("Error data:", errorData);
        throw new Error(`Network response was not ok (${response.status})`);
      }

      const result = await response.json();
      console.log("result ReviewModal: ", result);
      setReload(!reload);
      setRefresh(!refresh);
      // Gérer la réponse (par exemple, afficher un message de succès)
    } catch (error) {
      console.error("ReviewModal, Error:", error);
      // Gérer l'erreur (par exemple, afficher un message d'erreur)
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
