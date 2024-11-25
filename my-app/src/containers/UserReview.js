import React, { useState,  useEffect} from "react";
//import { Box, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import {fetchReviewContent, fetchUsersReviews} from "../scripts";

const UserReviews = ({ userName, initialReviews }) => {
    const [reviews, setReviews] = useState(initialReviews || []);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentReview, setCurrentReview] = useState(null);
    const [editedComment, setEditedComment] = useState("");

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const revIDs = await fetchUsersReviews(userName);
                const fetchedReviews = await Promise.all(
                    revIDs.map((id) => fetchReviewContent(id))
                );
                setReviews(fetchedReviews); // Update reviews state
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchReviews(); // Trigger fetching
    }, [userName]); // Dependency ensures useEffect runs when `userName` updates


    const handleEditOpen = (review) => {
        setCurrentReview(review);
        setEditedComment(review.comment);
        setEditDialogOpen(true);
    };

    const handleEditClose = () => {
        setEditDialogOpen(false);
        setCurrentReview(null);
        setEditedComment("");
    };

    const handleEditSave = () => {
        const updatedReviews = reviews.map((review) =>
            review.id === currentReview.id ? { ...review, comment: editedComment } : review
        );
        setReviews(updatedReviews);
        handleEditClose();
    };

    const handleDelete = (reviewId) => {
        const updatedReviews = reviews.filter((review) => review.id !== reviewId);
        setReviews(updatedReviews);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Your Reviews</h2>
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

            {editDialogOpen && (
                <div style={styles.dialogOverlay}>
                    <div style={styles.dialog}>
                        <h3>Edit Review</h3>
                        <textarea
                            style={styles.textarea}
                            value={editedComment}
                            onChange={(e) => setEditedComment(e.target.value)}
                        ></textarea>
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

            <button style={{ ...styles.button, marginTop: "20px" }}>Add a Review</button>
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