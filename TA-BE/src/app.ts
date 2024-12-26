import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import authRouter from "./routes/auth.route";
import { EGlobal } from "./enums/global.enums";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import messageRouter from "./routes/message.route";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// used to store online users
const userSocketMap: { [key: string]: string } = {}; // {userId: socketId}

export function getReceiverSocketId(userId: string): string | undefined {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId as string | undefined;
  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use(EGlobal.API_URL, authRouter);
app.use(EGlobal.API_URL, messageRouter);

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

export { app, server };
