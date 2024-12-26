import dotenv from "dotenv";
dotenv.config();

import { app, server } from "./app";
import { connectDatabase } from "./configs/database";

const PORT = process.env.PORT || 3000;

// Connect to database
connectDatabase()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error connecting to database:", error);
  });
