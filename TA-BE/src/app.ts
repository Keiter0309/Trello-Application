import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import authRouter from "./routes/auth.route";

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/auth", authRouter);

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});2

export default app;
