import React, { useState, useMemo } from 'react'
import ReviewModal from "@/components/modal/ReviewModal";
import Review from "@/components/review/Review";

interface CommentType {
    review_id : any;
    rated_entity_id :any;
    rated_entity_type :any;
    comment :string;
    created_at :any;
    updated_at :any;
    note :any;
    likes_count :number;
    dislikes_count :number;
    icon :string
    reviewer_name: string;
}

interface CommentProps {
    comments: CommentType[];
    isModal: boolean;
    rated_entity_type:string;
    rated_entity_id:string;
    commentsPerPage:number;
}

const Comment = ({ comments, isModal, rated_entity_id, rated_entity_type,commentsPerPage=3 }: CommentProps) => {
    const [currentPage, setCurrentPage] = useState(1);

    const paginatedComments = useMemo(() => {
        const startIndex = (currentPage - 1) * commentsPerPage;
        const endIndex = startIndex + commentsPerPage;
        return comments.slice(startIndex, endIndex);
    }, [comments, commentsPerPage, currentPage]);

    const totalPages = Math.ceil(comments.length / commentsPerPage);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <div>
            <div className="grid grid-cols-12 text gap-4 align-items-start">
                <div className="col-span-12">
                    <div className="p-3 bg-white rounded-2xl mb-5">
                        <div className="bg-white rounded-2xl">
                            {paginatedComments.map((comment, index) => (
                                <Review comment={comment} key={comment.review_id || index} index={index} />
                            ))}
                            {!isModal && (
                                <ReviewModal
                                    user_id={"user_id"}
                                    rated_entity_id={rated_entity_id}
                                    rated_entity_type={rated_entity_type}
                                    user_name={"user_name"}
                                />
                            )}
                        </div>
                        {totalPages > 1 && (
                            <div className="flex justify-end mt-4 space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 bg-gray-100 rounded-md">
                                    {currentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Comment