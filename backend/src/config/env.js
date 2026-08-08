import dotenv from "dotenv";

dotenv.config();

/**
 * Required environment variables.
 * The application will fail to start if any required variable is missing.
 */
const REQUIRED_VARS = ["MONGO_URI", "JWT_SECRET"];

const validateEnv = () => {
  const missing = REQUIRED_VARS.filter(
    (key) => !process.env[key] || process.env[key].trim() === "",
  );

  if (missing.length > 0) {
    console.error("\nMissing required environment variables:");
    missing.forEach((key) => console.error(` . ${key}`));
    console.error("\nPlease check your .env file against .env.example.\n");
    process.exit(1);
  }

  if (
    process.env.PORT &&
    (isNaN(Number(process.env.PORT)) || Number(process.env.PORT) <= 0)
  ) {
    console.error("\n Invalid PORT value.");
    console.error("PORT must be a positive number.\n");
    process.exit(1);
  }
};

validateEnv();

const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",

  PORT: Number(process.env.PORT) || 5000,

  MONGO_URI: process.env.MONGO_URI.trim(),

  JWT_SECRET: process.env.JWT_SECRET.trim(),

  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "8h",

  CLIENT_URL: process.env.CLIENT_URL ?? "http://localhost:5173",
};

export default env;
