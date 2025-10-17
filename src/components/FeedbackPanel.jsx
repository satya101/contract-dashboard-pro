import React, { useState } from "react";
import { Box, TextField, Rating, Button, Typography, Stack } from "@mui/material";

export default function FeedbackPanel({ onSubmit }) {
  const [rating, setRating] = useState(4);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const handle = async () => {
    if (!message.trim()) return alert("Please add a short note.");
    await onSubmit?.({ rating, message, email });
    setMessage("");
  };

  return (
    <Box className="bg-white border rounded-lg p-4">
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        Feedback
      </Typography>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2">Rating:</Typography>
          <Rating value={rating} onChange={(_, v) => setRating(v || 0)} />
        </Stack>
        <TextField
          label="Your feedback"
          multiline
          minRows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <TextField
          label="Email (optional)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handle} variant="contained">Submit</Button>
      </Stack>
    </Box>
  );
}