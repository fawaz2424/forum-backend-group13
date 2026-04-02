import express from "express";
import cors from "cors";
import authRoutes from "./presentation/routes/authRoutes";
import userRoutes from "./presentation/routes/userRoutes";
import likeRoutes from "./presentation/routes/likeRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api", likeRoutes); 

app.get("/", (_req, res) => {
  res.send("API is running 🚀");
});

app.use("/api/auth", authRoutes);

export default app;