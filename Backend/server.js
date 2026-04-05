import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from "./routes/authRoutes.js";
import allocationRoutes from "./routes/allocationRoutes.js";
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import authorization from './middlewares/roleMiddleware.js';
import adminRoutes from './routes/adminRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
dotenv.config();

connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// Attach io to req for use in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// (moved to bottom)
app.use("/api/auth", authRoutes);
app.use("/api/allocate", allocationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tasks", taskRoutes);

app.use(notFound);
app.use(errorHandler);

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});


app.get('/', (req, res) => {
  res.send('Intelligent Resource Allocation System API is running');
});


const PORT = process.env.PORT || 5001;

httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
