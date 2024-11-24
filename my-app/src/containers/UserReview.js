import React, { useState } from "react";
import { Box, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const UserReviews = ({ initialReviews }) => {
    const [reviews, setReviews] = useState(initialReviews);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentReview, setCurrentReview] = useState(null);
    const [editedComment, setEditedComment] = useState("");

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
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#f0f0f0",
                padding: "20px",
                borderRadius: "10px",
                maxWidth: "800px",
                margin: "auto",
            }}
        >
            <Typography
                sx={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    marginBottom: "20px",
                }}
            >
                Your Reviews
            </Typography>

            {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                    <Box
                        key={review.id}
                        sx={{
                            backgroundColor: "#fff",
                            padding: "15px",
                            marginBottom: "15px",
                            borderRadius: "8px",
                            width: "100%",
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "1.2rem",
                                fontWeight: "600",
                                color: "#333",
                                marginBottom: "10px",
                            }}
                        >
                            Restaurant: {review.restaurantName}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "1rem",
                                color: "#555",
                                marginBottom: "10px",
                            }}
                        >
                            Review: {review.comment}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "0.9rem",
                                color: "#888",
                            }}
                        >
                            Rating: {review.rating} / 5
                        </Typography>

                        <Box sx={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleEditOpen(review)}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleDelete(review.id)}
                            >
                                Delete
                            </Button>
                        </Box>
                    </Box>
                ))
            ) : (
                <Typography>No reviews available.</Typography>
            )}

            <Dialog open={editDialogOpen} onClose={handleEditClose}>
                <DialogTitle>Edit Review</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Review Comment"
                        fullWidth
                        variant="outlined"
                        value={editedComment}
                        onChange={(e) => setEditedComment(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleEditSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Button
                variant="contained"
                sx={{
                    marginTop: "20px",
                    backgroundColor: "#012046",
                    color: "#fff",
                    fontSize: "1rem",
                }}
            >
                Add a Review
            </Button>
        </Box>
    );
};

export default UserReviews;
