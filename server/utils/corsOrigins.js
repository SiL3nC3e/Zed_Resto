export const getAllowedOrigins = () =>
  (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

export const corsOriginCheck = (origin, callback) => {
  const allowed = getAllowedOrigins();
  if (!origin || allowed.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  }
};
