const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const itemRoutes = require("./routes/itemRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
