import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectToDatabase from './config/db';
import { APP_ORIGIN, NODE_ENV, PORT } from './constants/env';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler';
import { OK } from './constants/http';
import authRoutes from './routes/auth.route';
import authenticate from './middleware/authenticate';
import userRoutes from './routes/user.route';
import sessionRoutes from './routes/sessionRoute';

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// Middleware to handle CORS
app.use(cors({
    origin: APP_ORIGIN,
    credentials: true, // Allow credentials (cookies, authorization headers, etc)
})
);
app.use(cookieParser())


app.get("/", (req, res, next) => {
    return res.status(OK).json({
        status: "health check",
    })
})

app.use("/api/v1/auth", authRoutes)

// protected routes
app.use("/api/v1/user", authenticate, userRoutes);
app.use("/api/v1/sessions", authenticate, sessionRoutes);

// This middleware will catch any errors thrown in any of the routes above and all the error handling logic will live in the errorHandler middleware.
app.use(errorHandler);

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT} in ${NODE_ENV} environment`);
    await connectToDatabase();

}
);