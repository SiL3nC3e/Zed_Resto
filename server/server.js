import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import orderRoutes from './routes/orders.js';
import reservationRoutes from './routes/reservations.js';
import promotionRoutes from './routes/promotions.js';
import userRoutes from './routes/users.js';
import reviewRoutes from './routes/reviews.js';
import { errorHandler } from './middleware/errorHandler.js';
import { initSocket } from './socket/index.js';
import { getAllowedOrigins, corsOriginCheck } from './utils/corsOrigins.js';

const app = express();
const httpServer = createServer(app);
const allowedOrigins = getAllowedOrigins();

const io = new Server(httpServer, {
  cors: { origin: allowedOrigins, methods: ['GET', 'POST'] },
});
app.set('io', io);
initSocket(io);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: corsOriginCheck,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { message: 'Too many requests, please try again later' },
  })
);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', name: 'Zed-Resto API' }));

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zed-resto')
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Zed-Resto API running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
