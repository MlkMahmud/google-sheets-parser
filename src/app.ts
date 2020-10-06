import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import router from './routes';

interface ApiError extends Error {
  statusCode?: number;
}

const app = express();
app.use(express.json());
app.use(helmet());
app.use(router);
// eslint-disable-next-line no-unused-vars
app.use((err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message,
    data: [],
  });
});

export default app;
