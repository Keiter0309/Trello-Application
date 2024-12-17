import app from "./app";
import dotenv from "dotenv";
import { connectDatabase } from "./configs/database";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Connect to database
connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error connecting to database:", error);
  });
