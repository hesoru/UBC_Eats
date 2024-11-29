import React, { useState,  useEffect} from "react";
//import { Box, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useParams } from 'react-router-dom';
import '../css/UserReview.css';
import {deleteReview, fetchReviewContent, fetchUsersReviews, updateUserReview} from "../scripts";

const UserReviews = ({initialReviews }) => {
    const { userName } = useParams();
    const [reviews, setReviews] = useState(initialReviews || []);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentReview, setCurrentReview] = useState(null);
    const [editedComment, setEditedComment] = useState("");
    const [editedRating, setEditedRating] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetchUsersReviews(userName);
                const revIDs = response.result.map(item => Number(item[0]));

                const fetchedReviews = await Promise.all(
                    revIDs.map(async (id) => {
                        const reviewResponse = await fetchReviewContent(id);
                        if (reviewResponse.success) {
                            const [restaurantName, comment, rating, createdAt, updatedAt] = reviewResponse.result[0];
                            return {
                                id,
                                restaurantName,
                                comment,
                                rating,
                                createdAt,
                                updatedAt,
                            };
                        } else {
                            console.error(`Failed to fetch review with ID ${id}`);
                            return null;
                        }
                    })
                );

                setReviews(fetchedReviews.filter((review) => review !== null));
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchReviews();
    }, [userName]);

    const handleEditOpen = (review) => {
        setCurrentReview(review);
        setEditedComment(review.comment);
        setEditedRating(review.rating);
        setEditDialogOpen(true);
    };

    const handleEditClose = () => {
        setEditDialogOpen(false);
        setCurrentReview(null);
        setEditedComment("");
        setEditedRating(null);
    };

    const handleEditSave = async () => {
        try {
            // Update the comment and rating
            await updateUserReview(editedComment, "CONTENT", currentReview.id);
            await updateUserReview(editedRating, "RATING", currentReview.id);

            const updatedReviews = reviews.map((review) =>
                review.id === currentReview.id
                    ? { ...review, comment: editedComment, rating: editedRating }
                    : review
            );
            setReviews(updatedReviews);
            setMessage("Review updated successfully!");
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            setMessage("Error updating review.");
            setTimeout(() => setMessage(""), 3000);
        }

        handleEditClose()
    };

    const handleDelete = async (reviewId) => {
        try {
            await deleteReview(reviewId);
            const updatedReviews = reviews.filter((review) => review.id !== reviewId);
            setReviews(updatedReviews);
            setMessage("Review deleted successfully!");
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            setMessage("Error deleting review.");
            setTimeout(() => setMessage(""), 3000);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading} className="text-lg font-extrabold font-mono">{userName}'s Reviews</h2>

            {message && (
                <div style={styles.message} className="bg-green-500 text-white p-2 mb-4">
                    {message}
                </div>
            )}

        <ul className="review-list">
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review.id} style={styles.reviewCard}>
                        <h3 style={styles.restaurantName}>Restaurant: {review.restaurantName}</h3>
                        <p style={styles.comment}>Review: {review.comment}</p>
                        <p style={styles.rating}>Rating: {review.rating} / 5</p>
                        <div style={styles.actions}>
                            <button style={styles.button} onClick={() => handleEditOpen(review)}>
                                Edit
                            </button>
                            <button style={{ ...styles.button, backgroundColor: "red" }} onClick={() => handleDelete(review.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No reviews available.</p>
            )}
        </ul>

        <ul className="edit-review">
            {editDialogOpen && (
                <div style={styles.dialogOverlay}>
                    <div style={styles.dialog}>
                        <h3>Edit Review</h3>
                        <textarea
                            style={styles.textarea}
                            value={editedComment}
                            onChange={(e) => setEditedComment(e.target.value)}
                        ></textarea>
                        <input 
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            style={{ ...styles.input, marginBottom: '20px' }}
                            value={editedRating}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value >= 0 && value <= 5) {
                                    setEditedRating(value);
                                }
                            }}
                            placeholder="Rating (0-5)"
                        />
                        <div style={styles.dialogActions}>
                            <button style={styles.button} onClick={handleEditClose}>
                                Cancel
                            </button>
                            <button style={styles.button} onClick={handleEditSave}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ul>
        </div>
    );
};


const styles = {
    container: {
        maxWidth: "800px",
        margin: "auto",
        backgroundColor: "#f9f9f9",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
    },
    heading: {
        fontSize: "24px",
        marginBottom: "20px",
    },
    reviewCard: {
        backgroundColor: "#fff",
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "8px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        textAlign: "left",
    },
    restaurantName: {
        fontSize: "18px",
        fontWeight: "bold",
        marginBottom: "5px",
    },
    comment: {
        marginBottom: "5px",
    },
    rating: {
        color: "#555",
    },
    actions: {
        display: "flex",
        gap: "10px",
        marginTop: "10px",
    },
    button: {
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        backgroundColor: "#007BFF",
        color: "#fff",
        cursor: "pointer",
    },
    dialogOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    dialog: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        maxWidth: "400px",
        width: "100%",
        textAlign: "center",
    },
    textarea: {
        width: "100%",
        height: "100px",
        marginBottom: "15px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        padding: "10px",
    },
    dialogActions: {
        display: "flex",
        justifyContent: "space-around",
    },
};

export default UserReviews;