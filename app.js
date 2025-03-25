import "dotenv/config"; // ✅ No need for require()
import express from "express";
import path from "path";
import cors from "cors";
import DBConnection from "./config/db.js";
import userRoutes from "./routes/userRoutes.js"; // ✅ Add .js extension
import authRoutes from "./routes/authRoutes.js"; // ✅ Add .js extension
const PORT = process.env.PORT ;
const app = express();
DBConnection();
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "views")); // ✅ Use path.resolve() for ES modules

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// Serve Static Files
app.use(express.static(path.join(path.resolve(), "public"))); // ✅ Use path.resolve()

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
