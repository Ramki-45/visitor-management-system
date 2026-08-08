import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import env from "./config/env.js";

import AppError from "./utils/AppError.js";
import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import visitorRoutes from "./routes/visitorRoutes.js";
import visitRequestRoutes from "./routes/visitRequestRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
// reportRoutes will be mounted here after the Reports module is completed.

const app = express();

/* -------------------------------------------------------------------------- */
/*                        Security & Request Parsing                          */
/* -------------------------------------------------------------------------- */

app.use(helmet());

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

/* -------------------------------------------------------------------------- */
/*                                HTTP Logging                                */
/* -------------------------------------------------------------------------- */

app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

/* -------------------------------------------------------------------------- */
/*                               Health Check                                 */
/* -------------------------------------------------------------------------- */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "ok",
    },
  });
});

/* -------------------------------------------------------------------------- */
/*                                   Routes                                   */
/* -------------------------------------------------------------------------- */

app.use("/api/auth", authRoutes);

app.use("/api/visitors", visitorRoutes);

app.use("/api/visit-requests", visitRequestRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/reports", reportRoutes);

app.use("/api/employees", employeeRoutes);

/* -------------------------------------------------------------------------- */
/*                                  404 Route                                 */
/* -------------------------------------------------------------------------- */

app.use((req, res, next) => {
  next(
    new AppError(
      `Route not found: ${req.method} ${req.originalUrl}`,
      404,
      "NOT_FOUND",
    ),
  );
});

/* -------------------------------------------------------------------------- */
/*                           Global Error Handler                             */
/* -------------------------------------------------------------------------- */

app.use(errorHandler);

export default app;
