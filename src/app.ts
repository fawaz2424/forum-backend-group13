import express from "express";
import cors from "cors";
import authRoutes from "./presentation/routes/authRoutes";
import userRoutes from "./presentation/routes/userRoutes";
 
import likeRoutes from "./presentation/routes/likeRoutes";
import adminRoutes from "./presentation/routes/AdminRoutes"; 

import postRoutes from "./presentation/routes/postRoutes";
import commentRoutes from "./presentation/routes/commentRoutes";


const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

app.use("/api", likeRoutes); 
app.use("/api", adminRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", commentRoutes); 

// Test route

app.get("/", (_req, res) => {
  res.send("API is running 🚀");
});

export default app;