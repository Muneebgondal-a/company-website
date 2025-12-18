const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());

// Serve frontend files
app.use(express.static(__dirname));

// Contact API
app.post("/contact", (req, res) => {
    console.log("Form Data:", req.body);
    res.json({ message: "Message received successfully!" });
});

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
